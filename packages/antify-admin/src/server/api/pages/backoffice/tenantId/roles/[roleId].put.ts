import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpBadRequestError } from '~~/server/errors';
import { Role } from '~~/server/datasources/core/schemas/roles';
import { useCoreClient } from '~~/server/service/useCoreClient';
import { isLoggedInHandler, isAuthorizedHandler } from '@antify/ant-guard';

// TODO:: glue
export type RoleInput = {
  name: string;
  permissions: string[];
};

// TODO:: use ant validator + glue + implement on frontend
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
  isLoggedInHandler(event);
  await isAuthorizedHandler(
    event,
    PermissionId.CAN_UPDATE_ROLE,
    useRuntimeConfig().contextConfig
  );

  const requestBody = await readBody<RoleInput>(event);
  const requestData = validate(requestBody);
  const RoleModel = (await useCoreClient().connect()).getModel<Role>('roles');
  const role = await RoleModel.findById(event.context.params.roleId);

  if (!role) {
    return {
      notFound: true,
    };
  }

  role.name = requestData.name;
  role.permissions = requestData.permissions;

  await role.save();

  return {
    id: role.id,
    name: role.name,
    isAdmin: role.isAdmin,
    permissions: role.permissions,
  };
});
