import { tenantContextMiddleware } from '../../guard/tenantContext.middleware';
import { useGuard } from '~~/composables/useGuard';
import { useAuthorizationHeader } from '../../utils/useAuthorizationHeader';
import { useTenantHeader } from '../../utils/useTenantHeader';
import { PermissionId } from '../../datasources/static/permissions';
import { HttpForbiddenError } from '../../errors';
import prisma from '~~/server/datasources/core/client';

export default defineEventHandler(async (event) => {
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_DELETE_TENANT, tenantId)) {
    throw new HttpForbiddenError();
  }

  await prisma.tenant.delete({
    where: {
      id: event.context.params.tenantDetailId,
    },
  });

  return {};
});
