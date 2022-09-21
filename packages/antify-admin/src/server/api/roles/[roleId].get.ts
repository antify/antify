import prisma from '~~/server/datasources/core/client';
import { useGuard } from '~~/composables/useGuard';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { Response } from '~~/glue/api/backoffice/[tenantId]/roles/[roleId].get';
import { HttpNotFoundError, HttpForbiddenError } from '../../errors';
import { checkUserTenantAccess } from '~~/server/service/roleService';

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

  const access = await checkUserTenantAccess(event.context.params.roleId);

  return {
    default: {
      ...role,
      permissions: role.permissions.map(
        (permission) => permission.permissionId
      ),
      canDelete: access.length === 0,
    },
  };
});
