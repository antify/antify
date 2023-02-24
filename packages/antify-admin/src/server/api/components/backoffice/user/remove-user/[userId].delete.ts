import { PermissionId } from '../../../../../datasources/static/permissions';
import { useCoreClient } from '~~/server/service/useCoreClient';
import { isLoggedInHandler, isAuthorizedHandler } from '@antify/ant-guard';
import { UserTenantAccess } from '~~/server/datasources/core/schemas/userTenantAccess';

export default defineEventHandler(async (event) => {
  isLoggedInHandler(event);
  await isAuthorizedHandler(
    event,
    PermissionId.CAN_DELETE_USER,
    useRuntimeConfig().contextConfig
  );

  await (await useCoreClient().connect())
    .getModel<UserTenantAccess>('user_tenant_accesses')
    .remove({ user: event.context.params.userId });

  return {};
});
