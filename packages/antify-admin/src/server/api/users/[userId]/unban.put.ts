import { tenantContextMiddleware } from '../../../guard/tenantContext.middleware';
import { useAuthorizationHeader } from '../../../utils/useAuthorizationHeader';
import { useTenantHeader } from '../../../utils/useTenantHeader';
import { PermissionId } from '../../../datasources/static/permissions';
import { HttpForbiddenError } from '../../../errors';
import prisma from '~~/server/datasources/auth/client';
import { useGuard } from '~~/composables/useGuard';

export default defineEventHandler(async (event) => {
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_UNBAN_USER, tenantId)) {
    throw new HttpForbiddenError();
  }

  return await prisma.user.update({
    select: {
      id: true,
      email: true,
      name: true,
      isSuperAdmin: true,
      isBanned: true,
      tenantAccesses: {
        select: {
          tenantId: true,
          roleId: true,
        },
      },
    },
    where: {
      id: event.context.params.userId,
    },
    data: {
      isBanned: false,
    },
  });
});
