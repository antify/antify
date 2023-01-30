import { useGuard } from '~~/composables/useGuard';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpForbiddenError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { UserTenantAccess } from '~~/server/datasources/core/schemas/userTenantAccess';
import { useCoreClient } from '~~/server/service/useCoreClient';

export default defineEventHandler(async (event) => {
  const tenantId = tenantContextMiddleware(event);
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_USER, tenantId)) {
    throw new HttpForbiddenError();
  }

  const coreClient = await useCoreClient().connect();

  const userTenantAccesses = await coreClient
    .getModel<UserTenantAccess>('user_tenant_accesses')
    .find({ tenant: tenantId })
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
