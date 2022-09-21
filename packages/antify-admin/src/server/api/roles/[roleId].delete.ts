import { useGuard } from '~~/composables/useGuard';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpForbiddenError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import prisma from '~~/server/datasources/core/client';
import { Response } from '../../../glue/api/backoffice/[tenantId]/roles/[roleId].delete';
import { checkUserTenantAccess } from '~~/server/service/roleService';

export default defineEventHandler(async (event): Promise<Response> => {
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_DELETE_ROLE, tenantId)) {
    throw new HttpForbiddenError();
  }

  const access = await checkUserTenantAccess(event.context.params.roleId);

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
