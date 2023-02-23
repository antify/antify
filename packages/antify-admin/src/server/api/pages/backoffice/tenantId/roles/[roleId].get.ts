import { PermissionId } from '~~/server/datasources/static/permissions';
import { Role } from '~~/server/datasources/core/schemas/roles';
import { useCoreClient } from '~~/server/service/useCoreClient';
import { isLoggedInHandler, isAuthorizedHandler } from '@antify/ant-guard';
import { permissions } from '~~/server/datasources/static/permissions';

export default defineEventHandler(async (event) => {
  isLoggedInHandler(event);
  await isAuthorizedHandler(
    event,
    PermissionId.CAN_READ_ROLE,
    useRuntimeConfig().contextConfig
  );

  const RoleModel = (await useCoreClient().connect()).getModel<Role>('roles');
  const role = await RoleModel.findById(event.context.params.roleId);

  if (!role) {
    return {
      notFound: true,
    };
  }

  return {
    role: {
      id: role.id,
      name: role.name,
      isAdmin: role.isAdmin,
      permissions: role.permissions,
    },
    permissions,
  };
});
