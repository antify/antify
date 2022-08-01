import prisma from '~~/server/datasources/core/client';
import { useGuard } from '~~/composables/useGuard';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpForbiddenError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import { Response } from '~~/glue/api/users/[userId].get';

export default defineEventHandler<Response>(async (event) => {
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_USER, tenantId)) {
    throw new HttpForbiddenError();
  }

  const user = await prisma.user.findUnique({
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
  });

  return {
    default: {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isSuperAdmin,
      isBanned: user.isBanned,
      roleId:
        user.tenantAccesses.find(
          (tenantAccess) => tenantAccess.tenantId === tenantId
        )?.roleId || null,
    },
  };
});
