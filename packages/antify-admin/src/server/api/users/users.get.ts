import { useGuard } from '~~/composables/useGuard';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpForbiddenError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import prisma from '~~/server/datasources/core/client';

export default defineEventHandler(async (event) => {
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_USER, tenantId)) {
    throw new HttpForbiddenError();
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      isSuperAdmin: true,
      tenantAccesses: true,
    },
    where: {
      OR: [
        {
          tenantAccesses: {
            every: {
              tenantId: tenantId,
            },
          },
        },
        {
          isSuperAdmin: true,
        },
      ],
    },
  });

  return users;
});
