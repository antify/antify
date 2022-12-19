import { useGuard } from '~~/composables/useGuard';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpForbiddenError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { Response } from '~~/glue/api/users/[userId].get';
import { UserTenantAccess } from '~~/server/datasources/core/schemas/userTenantAccess';

export default defineEventHandler<Response>(async (event) => {
  const tenantId = tenantContextMiddleware(event);
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_USER, tenantId)) {
    throw new HttpForbiddenError();
  }

  const coreClient = await useCoreClient().connect();

  // Make sure, the user want to read a user which is related to his tenant.
  const userTenantAccess = await coreClient
    .getModel<UserTenantAccess>('user_tenant_accesses')
    .findOne({ tenant: tenantId, user: event.context.params.userId })
    .populate({
      path: 'user',
      model: coreClient.getModel('users'),
    });

  if (!userTenantAccess) {
    throw new HttpForbiddenError();
  }

  return {
    default: {
      id: userTenantAccess.user.id,
      name: userTenantAccess.user.name,
      email: userTenantAccess.user.email,
      roleId: userTenantAccess.role._id,
    },
  };
});
