import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpBadRequestError } from '~~/server/errors';
import { Role } from '~~/server/datasources/core/schemas/roles';
import { useCoreClient } from '~~/server/service/useCoreClient';
import { isLoggedInHandler, isAuthorizedHandler } from '@antify/ant-guard';
import { getTenantId } from '@antify/context';

// TODO:: move to glue
export type RoleInput = {
  name: string;
  permissions: string[];
};

// TODO:: mvoe to glue and implement in frontend
export const validate = (data: RoleInput): RoleInput => {
  console.log(data);
  if (!data.name) {
    throw new HttpBadRequestError('Missing required name');
  }

  if (!Array.isArray(data.permissions)) {
    throw new HttpBadRequestError('Missing required permissions');
  }

  return data;
};

export default defineEventHandler(async (event) => {
  isLoggedInHandler(event);
  await isAuthorizedHandler(
    event,
    PermissionId.CAN_CREATE_ROLE,
    useRuntimeConfig().contextConfig
  );

  const requestBody = await readBody(event);
  const requestData = validate(requestBody);
  const RoleModel = (await useCoreClient().connect()).getModel<Role>('roles');
  const role = new RoleModel({
    name: requestData.name,
    isAdmin: false,
    permissions: requestData.permissions,
    tenant: getTenantId(event),
  });

  await role.save();

  return {
    id: role.id,
    name: role.name,
    isAdmin: role.isAdmin,
    permissions: role.permissions,
  };
});
