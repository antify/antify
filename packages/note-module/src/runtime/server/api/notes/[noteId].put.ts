import { Input, Response, validator } from '../../../glue/note/[noteId].put';
import { Note } from '../../datasources/note.schema';
import { isLoggedInHandler, isAuthorizedHandler, useGuard, getAuthorizationHeader } from '@antify/ant-guard';
import { extendSchemas } from '../../datasources/schema.extensions';
import { getDatabaseClientFromRequest } from '@antify/kit';
import { PermissionId } from '../../permissions';

export default defineEventHandler<Response>(async (event) => {
  const contextConfig = useRuntimeConfig().antNote.providers;
  const guard = useGuard(getAuthorizationHeader(event));

  isLoggedInHandler(event);

  const client = await getDatabaseClientFromRequest(
    event,
    contextConfig,
    extendSchemas
  );
  const NoteModel = client.getModel<Note>('notes');
  const note = await NoteModel.findById(event.context.params.noteId);

  if (!note) {
    return {
      notFound: true
    };
  }

  await isAuthorizedHandler(
    event,
    note.isGlobalVisible ? PermissionId.CAN_EDIT_GLOBAL_NOTE : PermissionId.CAN_EDIT_PERSONAL_NOTE,
    contextConfig
  );

  const requestData = await readBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    throw createError({
      status: 500,
      message: validator.getErrorsAsString()
    });
  }

  if (!note.isGlobalVisible && note.owner !== guard.userId && !guard.isSuperAdmin) {
    throw createError({
      status: 500,
      message: 'You have no access to edit this note'
    });
  }

  note.content = requestData.content;

  await note.save();

  return {
    default: {
      content: note.content
    }
  };
});
