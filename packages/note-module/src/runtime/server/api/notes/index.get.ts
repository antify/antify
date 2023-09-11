import { Note } from '../../datasources/note.schema';
import { isAuthorizedHandler } from '@antify/ant-guard';
import { extendSchemas } from '../../datasources/schema.extensions';
import { getDatabaseClientFromRequest } from '@antify/kit';
import { PermissionId } from '../../permissions';

export default defineEventHandler<Response>(async (event) => {
  const contextConfig = useRuntimeConfig().antNote.providers;
  const query = getQuery(event);
  const isGlobalVisibleFilter = query.isGlobalVisible === 'true';
  const guard = await isAuthorizedHandler(
    event,
    isGlobalVisibleFilter ? PermissionId.CAN_READ_GLOBAL_NOTE : PermissionId.CAN_READ_PERSONAL_NOTE,
    contextConfig
  );
  const filter = isGlobalVisibleFilter ? { isGlobalVisible: isGlobalVisibleFilter } : {
    owner: guard.userId(),
    isGlobalVisible: false
  };
  const client = await getDatabaseClientFromRequest(
    event,
    contextConfig,
    extendSchemas
  );
  const noteModel = client.getModel<Note>('notes');

  return {
    default: (await noteModel.find<Note>(filter)).map((noteItem: Note) => ({
      id: noteItem.id,
      content: noteItem.content
    }))
  };
});
