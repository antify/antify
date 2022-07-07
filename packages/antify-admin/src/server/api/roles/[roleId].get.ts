import prisma from "~~/server/datasources/db/client";
import { useGuard } from "~~/composables/useGuard";
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
          permissionId: true
        }
      }
    },
    where: {
      id: event.context.params.roleId
    }
  });

  if (!role) {
    return createNotFoundError();
  }

  return {
    ...role,
    permissions: role.permissions
      .map(permission => permission.permissionId)
  };
});
