import { Note } from '../../datasources/note.schema';
import { isLoggedInHandler, isAuthorizedHandler } from '@antify/ant-guard';
import { extendSchemas } from '../../datasources/schema.extensions';
import { getDatabaseClientFromRequest } from '@antify/kit';
import { PermissionId } from '../../permissions';

export default defineEventHandler(async (event) => {
  const contextConfig = useRuntimeConfig().antNote.providers;
  const guard = await isLoggedInHandler(event);
  const client = await getDatabaseClientFromRequest(
    event,
    contextConfig,
    extendSchemas
  );
  const note = await client
    .getModel<Note>('notes')
    .findById(event.context.params.noteId);

  if (note) {
    await isAuthorizedHandler(
      event,
      note.isGlobalVisible ? PermissionId.CAN_DELETE_GLOBAL_NOTE : PermissionId.CAN_DELETE_PERSONAL_NOTE,
      contextConfig
    );

    if (!note.isGlobalVisible && note.owner !== guard.userId() && !guard.isSuperAdmin) {
      throw new Error('You have no access to delete this note');
    }

    await note.remove();
  }

  return {};
});
