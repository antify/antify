import { Note } from '../../datasources/note.schema';
import { isAuthorizedHandler } from '@antify/ant-guard';
import { extendSchemas } from '../../datasources/schema.extensions';
import { getDatabaseClientFromRequest } from '@antify/kit';
import { validator } from '../../../glue/note/index.post';
import { PermissionId } from '../../permissions';

export default defineEventHandler(async (event) => {
  const contextConfig = useRuntimeConfig().antNote.providers;
  const requestData = await readBody(event);

  const guard = await isAuthorizedHandler(
    event,
    requestData.isGlobalVisible ? PermissionId.CAN_CREATE_GLOBAL_NOTE : PermissionId.CAN_CREATE_PERSONAL_NOTE,
    contextConfig
  );

  validator.validate(requestData);

  if (validator.hasErrors()) {
    throw new Error(validator.getErrorsAsString());
  }

  const client = await getDatabaseClientFromRequest(
    event,
    contextConfig,
    extendSchemas
  );

  const NoteModel = client.getModel<Note>('notes');
  const note = new NoteModel({
    ...requestData,
    owner: guard.userId()
  });

  await note.save();

  return {
    id: note.id,
    content: note.content
  };
});
