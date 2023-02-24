import { PermissionId } from '~~/server/datasources/static/permissions';
import { Response } from '~~/glue/api/users/[userId].get';
import { UserTenantAccess } from '~~/server/datasources/core/schemas/userTenantAccess';
import { useCoreClient } from '~~/server/service/useCoreClient';
import { isLoggedInHandler, isAuthorizedHandler } from '@antify/ant-guard';
import { getTenantId } from '@antify/context';
import { Role } from '~~/server/datasources/core/schemas/roles';

export default defineEventHandler<Response>(async (event) => {
  isLoggedInHandler(event);
  await isAuthorizedHandler(
    event,
    PermissionId.CAN_READ_USER,
    useRuntimeConfig().contextConfig
  );

  const coreClient = await useCoreClient().connect();

  // Make sure, the user want to read a user which is related to his tenant.
  const userTenantAccess = await coreClient
    .getModel<UserTenantAccess>('user_tenant_accesses')
    .findOne({ tenant: getTenantId(event), user: event.context.params.userId })
    .populate({
      path: 'user',
      model: coreClient.getModel('users'),
    });

  if (!userTenantAccess) {
    return { notFound: true };
  }

  const roles = await coreClient
    .getModel<Role>('roles')
    .find({ tenant: getTenantId(event) });

  return {
    user: {
      id: userTenantAccess.user.id,
      name: userTenantAccess.user.name,
      email: userTenantAccess.user.email,
      roleId: userTenantAccess.role._id,
      isBannedInCurrentTenant: userTenantAccess.isBanned,
    },
    roles: roles.map((role) => ({
      id: role.id,
      name: role.name,
      isAdmin: role.isAdmin,
    })),
  };
});
