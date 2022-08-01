import prisma from '~~/server/datasources/auth/client';
import { useGuard } from '~~/composables/useGuard';
import { createForbiddenError, createNotFoundError } from '~~/server/errors';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';

export default defineEventHandler(async (event) => {
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.isUserLoggedIn) {
    return createForbiddenError();
  }

  // TODO:: check permission

  const role = await prisma.role.findUnique({
    select: {
      id: true,
      name: true,
      isAdmin: true,
      permissions: {
        select: {
          permissionId: true,
        },
      },
    },
    where: {
      id: event.context.params.roleId,
    },
  });

  if (!role) {
    return createNotFoundError();
  }

  // Role can not be deleted if it has a connection in userTenantAccess
  const access = await prisma.userTenantAccess.findMany({
    select: {
      tenantId: true,
      userId: true,
      roleId: true,
    },
    where: {
      roleId: event.context.params.roleId,
    },
  });

  return {
    ...role,
    permissions: role.permissions.map((permission) => permission.permissionId),
    canDelete: access.length === 0,
  };
});
