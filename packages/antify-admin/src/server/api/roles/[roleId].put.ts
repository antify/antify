import { useGuard } from '~~/composables/useGuard';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpBadRequestError, HttpForbiddenError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { Role } from '~~/server/datasources/core/schemas/roles';
import { useCoreClient } from '~~/server/service/useCoreClient';

// TODO:: glue
export type RoleInput = {
  name: string;
  permissions: string[];
};

// TODO:: glue + implement on frontend
export const validate = (data: RoleInput): RoleInput => {
  if (!data.name) {
    throw new HttpBadRequestError('Missing required name');
  }

  if (!Array.isArray(data.permissions)) {
    throw new HttpBadRequestError('Missing required permissions');
  }

  return data as RoleInput;
};

export default defineEventHandler(async (event) => {
  const tenantId = tenantContextMiddleware(event);
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.hasPermissionTo(PermissionId.CAN_UPDATE_ROLE, tenantId)) {
    throw new HttpForbiddenError();
  }

  const requestBody = await readBody<RoleInput>(event);
  const requestData = validate(requestBody);
  const RoleModel = (await useCoreClient().connect()).getModel<Role>('roles');
  const role = await RoleModel.findById(event.context.params.roleId);

  if (!role) {
    return {
      notFound: {
        errors: ['Not Found'],
      },
    };
  }

  role.name = requestData.name;
  role.permissions = requestData.permissions;

  await role.save();

  return {
    default: {
      id: role.id,
      name: role.name,
      isAdmin: role.isAdmin,
      permissions: role.permissions,
    },
  };
});
