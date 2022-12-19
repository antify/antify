import { useGuard } from '~~/composables/useGuard';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { HttpForbiddenError } from '../../errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { Role } from '~~/server/datasources/core/schemas/roles';

export default defineEventHandler(async (event) => {
  const tenantId = tenantContextMiddleware(event);
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.hasPermissionTo(PermissionId.CAN_UPDATE_ROLE, tenantId)) {
    throw new HttpForbiddenError();
  }

  const RoleModel = (await useCoreClient().connect()).getModel<Role>('roles');
  const role = await RoleModel.findById(event.context.params.roleId);

  if (!role) {
    return {
      notFound: {
        errors: ['Not Found'],
      },
    };
  }

  return {
    default: {
      id: role.id,
      name: role.name,
      isAdmin: role.isAdmin,
      permissions: role.permissions,
    },
  };
});
