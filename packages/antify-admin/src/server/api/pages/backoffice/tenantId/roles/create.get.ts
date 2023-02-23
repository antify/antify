import { PermissionId } from '~~/server/datasources/static/permissions';
import { isLoggedInHandler, isAuthorizedHandler } from '@antify/ant-guard';
import { permissions } from '~~/server/datasources/static/permissions';

export default defineEventHandler(async (event) => {
  isLoggedInHandler(event);
  await isAuthorizedHandler(
    event,
    PermissionId.CAN_READ_ROLE,
    useRuntimeConfig().contextConfig
  );

  return permissions;
});
