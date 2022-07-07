import prisma from "~~/server/datasources/db/client";
import { useGuard } from "~~/composables/useGuard";
import { PermissionId } from '~~/server/datasources/static/permissions';
import { createForbiddenError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import { UsersUserIdGetResponse } from "~~/glue/api/users/[userId].get";

export default defineEventHandler<UsersUserIdGetResponse>(async (event) => {
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_USER, tenantId)) {
    return createForbiddenError();
  }

  const user = await prisma.user.findUnique({
    select: {
      id: true,
      email: true,
      name: true,
      tenantAccesses: {
        select: {
          tenantId: true,
          roleId: true
        }
      }
    },
    where: {
      id: event.context.params.userId
    }
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roleId: user.tenantAccesses.find(tenantAccess => tenantAccess.tenantId === tenantId)?.roleId
  };
});
