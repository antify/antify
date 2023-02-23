import { PermissionId } from '~~/server/datasources/static/permissions';
import { UserTenantAccessRepository } from '~~/server/repository/userTenantAccess';
import { Role } from '~~/server/datasources/core/schemas/roles';
import { isLoggedInHandler, isAuthorizedHandler } from '@antify/ant-guard';
import { useCoreClient } from '~~/server/service/useCoreClient';

export default defineEventHandler(async (event) => {
  isLoggedInHandler(event);
  await isAuthorizedHandler(
    event,
    PermissionId.CAN_READ_ROLE,
    useRuntimeConfig().contextConfig
  );

  const userTenantAccesses = await new UserTenantAccessRepository().findByRole(
    event.context.params.roleId
  );

  if (userTenantAccesses && userTenantAccesses.length > 0) {
    return {
      notDeleteAble: `Eine Rolle kann nur gelöscht werden wenn sie keinem Benutzer zugewiesen ist. Aktuell ist diese Rolle ${userTenantAccesses.length} Benutzern zugewiesen.`,
    };
  }

  const RoleModel = (await useCoreClient().connect()).getModel<Role>('roles');
  const role = RoleModel.findById(event.context.params.roleId);

  if (role) {
    await role.remove();
  }

  return {};
});
