import { PermissionId } from '~~/server/datasources/static/permissions';
import { UserTenantAccess } from '~~/server/datasources/core/schemas/userTenantAccess';
import { useCoreClient } from '~~/server/service/useCoreClient';
import { isLoggedInHandler, isAuthorizedHandler } from '@antify/ant-guard';
import { getTenantId } from '@antify/context';

export default defineEventHandler(async (event) => {
  isLoggedInHandler(event);
  await isAuthorizedHandler(
    event,
    PermissionId.CAN_READ_USER,
    useRuntimeConfig().contextConfig
  );

  const coreClient = await useCoreClient().connect();
  const userTenantAccesses = await coreClient
    .getModel<UserTenantAccess>('user_tenant_accesses')
    .find({ tenant: getTenantId(event) })
    .populate({
      path: 'user',
      model: coreClient.getModel('users'),
    });

  return userTenantAccesses.map((userTenantAccess) => ({
    id: userTenantAccess.user.id,
    email: userTenantAccess.user.email,
    name: userTenantAccess.user.name,
  }));
});
