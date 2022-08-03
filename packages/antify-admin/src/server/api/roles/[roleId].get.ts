import prisma from '~~/server/datasources/auth/client';
import { useGuard } from '~~/composables/useGuard';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { Response } from '~~/glue/api/admin/[tenantId]/roles/[roleId].get';
import { HttpNotFoundError, HttpForbiddenError } from '../../errors';

export default defineEventHandler<Response>(async (event) => {
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.isUserLoggedIn) {
    throw new HttpForbiddenError();
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
    throw new HttpNotFoundError();
  }

  await new Promise((resolve) => {
    setTimeout(() => resolve(true), 2000);
  });

  return {
    default: {
      ...role,
      permissions: role.permissions.map(
        (permission) => permission.permissionId
      ),
    },
  };
});
