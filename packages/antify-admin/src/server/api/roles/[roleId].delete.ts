import { useGuard } from '~~/composables/useGuard';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpForbiddenError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { UserTenantAccessRepository } from '~~/server/repository/userTenantAccess';
import { Role } from '~~/server/datasources/core/schemas/roles';

export default defineEventHandler(async (event) => {
  const tenantId = tenantContextMiddleware(event);
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.hasPermissionTo(PermissionId.CAN_DELETE_ROLE, tenantId)) {
    throw new HttpForbiddenError();
  }

  const userTenantAccesses = await new UserTenantAccessRepository().findByRole(
    event.context.params.roleId
  );

  if (userTenantAccesses && userTenantAccesses.length > 0) {
    return {
      errors: [
        `Eine Rolle kann nur gelöscht werden wenn sie keinem Benutzer zugewiesen ist. Aktuell ist diese Rolle ${userTenantAccesses.length} Benutzern zugewiesen.`,
      ],
      errorType: 'NOT_DELETE_ABLE',
    };
  }

  const RoleModel = (await useCoreClient().connect()).getModel<Role>('roles');
  const role = RoleModel.findById(event.context.params.roleId);

  if (!role) {
    return {
      errors: ['Not Found'],
      errorType: 'NOT_FOUND',
    };
  }

  await role.remove();

  return {};
});
