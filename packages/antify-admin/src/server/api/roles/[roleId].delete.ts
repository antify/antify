import { useGuard } from '~~/composables/useGuard';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpForbiddenError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import prisma from '~~/server/datasources/auth/client';
import { Response } from '../../../glue/api/admin/[tenantId]/roles/[roleId].delete';

export default defineEventHandler(async (event): Promise<Response> => {
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_DELETE_ROLE, tenantId)) {
    throw new HttpForbiddenError();
  }

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

  if (access && access.length > 0) {
    return {
      errors: [
        'Eine Rolle kann nur gelöscht werden wenn sie keinem Benutzer zugewiesen ist.',
      ],
    };
  }

  await prisma.role.delete({
    where: {
      id: event.context.params.roleId,
    },
  });

  return {};
});
