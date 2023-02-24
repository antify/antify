import { PermissionId } from '~~/server/datasources/static/permissions';
import { useCoreClient } from '~~/server/service/useCoreClient';
import { isLoggedInHandler, isAuthorizedHandler } from '@antify/ant-guard';
import { getTenantId } from '@antify/context';
import { UserTenantAccess } from '~~/server/datasources/core/schemas/userTenantAccess';

export default defineEventHandler(async (event) => {
  isLoggedInHandler(event);
  await isAuthorizedHandler(
    event,
    PermissionId.CAN_BAN_USER,
    useRuntimeConfig().contextConfig
  );

  const coreClient = await useCoreClient().connect();
  const UserModel = coreClient.getModel<UserTenantAccess>(
    'user_tenant_accesses'
  );
  const userTenantAccess = await UserModel.findOne({
    user: event.context.params.userId,
    tenant: getTenantId(event),
  }).populate({
    path: 'user',
    model: coreClient.getModel('users'),
  });

  if (!userTenantAccess) {
    return {
      notFound: true,
    };
  }

  if (userTenantAccess.isBanned) {
    return {};
  }

  userTenantAccess.isBanned = true;

  await userTenantAccess.save();

  return {};
});
