import { useGuard } from '~~/composables/useGuard';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { HttpForbiddenError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { Role } from '~~/server/datasources/core/schemas/roles';
import { useCoreClient } from '~~/server/service/useCoreClient';

export default defineEventHandler(async (event) => {
  const tenantId = tenantContextMiddleware(event);
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_ROLE, tenantId)) {
    throw new HttpForbiddenError();
  }

  const roles = await (await useCoreClient().connect())
    .getModel<Role>('roles')
    .find({ tenant: tenantId });

  return {
    default: roles.map((role) => ({
      id: role.id,
      name: role.name,
      isAdmin: role.isAdmin,
      permissions: role.permissions,
    })),
  };
});
