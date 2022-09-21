import prisma from '~~/server/datasources/core/client';
import { useGuard } from '~~/composables/useGuard';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { Response as RolesResponse } from '~~/glue/api/backoffice/[tenantId]/roles/roles.get';
import { HttpForbiddenError } from '../../errors';

export default defineEventHandler<RolesResponse>(async (event) => {
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.isUserLoggedIn) {
    throw new HttpForbiddenError();
  }

  // TODO:: check permission

  const roles = await prisma.role.findMany({
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
  });

  const result = roles.map((role) => {
    return {
      ...role,
      permissions: role.permissions.map(
        (permission) => permission.permissionId
      ),
    };
  });

  return { default: result };
});
