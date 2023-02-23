import { PermissionId } from '~~/server/datasources/static/permissions';
import { Role } from '~~/server/datasources/core/schemas/roles';
import { useCoreClient } from '~~/server/service/useCoreClient';
import { isLoggedInHandler, isAuthorizedHandler } from '@antify/ant-guard';
import { getTenantId } from '@antify/context';

export default defineEventHandler(async (event) => {
  isLoggedInHandler(event);
  await isAuthorizedHandler(
    event,
    PermissionId.CAN_READ_ROLE,
    useRuntimeConfig().contextConfig
  );

  const roles = await (await useCoreClient().connect())
    .getModel<Role>('roles')
    .find({ tenant: getTenantId(event) });

  return {
    default: roles.map((role) => ({
      id: role.id,
      name: role.name,
      isAdmin: role.isAdmin,
      permissions: role.permissions,
    })),
  };
});
