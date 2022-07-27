import prisma from '~~/server/datasources/auth/client';
import { useGuard } from '~~/composables/useGuard';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpForbiddenError, HttpNotFoundError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import { Input, Response, validator } from '~~/glue/api/users/[userId].put';

export default defineEventHandler<Response>(async (event) => {
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const tenantId = useTenantHeader(event);
  const userId = guard.token.id;

  const user = await prisma.user.findUnique({
    select: {
      id: true,
      email: true,
      name: true,
    },
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new HttpNotFoundError();
  }

  if (!guard.hasPermissionTo(PermissionId.CAN_UPDATE_USER, tenantId)) {
    throw new HttpForbiddenError();
  }

  const requestData = await useBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    return {
      badRequest: {
        errors: validator.getErrors(),
      },
    };
  }

  const connection = await prisma.userTenantAccess.findUnique({
    where: {
      userId_tenantId: {
        tenantId: tenantId,
        userId: event.context.params.userId,
      },
    },
  });

  if (connection) {
    await prisma.userTenantAccess.delete({
      where: {
        userId_tenantId: {
          tenantId: tenantId,
          userId: event.context.params.userId,
        },
      },
    });
  }

  const updatedUser = await prisma.user.update({
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
      email: requestData.email,
      name: requestData.name,
      tenantAccesses: {
        create: {
          tenantId: tenantId,
          roleId: requestData.roleId,
        },
      },
    },
  });

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    roleId: updatedUser.tenantAccesses.find(
      (tenantAccess) => tenantAccess.tenantId === tenantId
    )?.roleId,
  };
});
