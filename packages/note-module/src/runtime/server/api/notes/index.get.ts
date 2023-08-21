import { Note } from '../../datasources/note.schema';
import { isLoggedInHandler, isAuthorizedHandler } from '@antify/ant-guard';
import { extendSchemas } from '../../datasources/schema.extensions';
import { getDatabaseClientFromRequest } from '@antify/kit';
import { useGuard, useAuthorizationHeader } from '@antify/ant-guard';
import { PermissionId } from '../../permissions';

export default defineEventHandler<Response>(async (event) => {
  const contextConfig = useRuntimeConfig().antNote.providers;
  const query = getQuery(event);
  const isGlobalVisibleFilter = query.isGlobalVisible === 'true';
  const guard = useGuard(useAuthorizationHeader(event));

  isLoggedInHandler(event);

  const client = await getDatabaseClientFromRequest(
    event,
    contextConfig,
    extendSchemas
  );
  const noteModel = client.getModel<Note>('notes');
  const filter = isGlobalVisibleFilter ? { isGlobalVisible: isGlobalVisibleFilter } : {
    owner: guard.userId,
    isGlobalVisible: false
  };

  await isAuthorizedHandler(
    event,
    filter.isGlobalVisible ? PermissionId.CAN_READ_GLOBAL_NOTE : PermissionId.CAN_READ_PERSONAL_NOTE,
    contextConfig
  );

  return {
    default: (await noteModel.find<Note>(filter)).map((noteItem: Note) => ({
      id: noteItem.id,
      content: noteItem.content
    }))
  };
});
