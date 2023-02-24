import { PermissionId } from '~~/server/datasources/static/permissions';
import { Input, validator } from '~~/glue/api/users/[userId].put';
import { UserTenantAccess } from '~~/server/datasources/core/schemas/userTenantAccess';
import { Role } from '~~/server/datasources/core/schemas/roles';
import { useCoreClient } from '~~/server/service/useCoreClient';
import { isLoggedInHandler, isAuthorizedHandler } from '@antify/ant-guard';
import { getTenantId } from '@antify/context';

export default defineEventHandler(async (event) => {
  isLoggedInHandler(event);
  await isAuthorizedHandler(
    event,
    PermissionId.CAN_UPDATE_USER,
    useRuntimeConfig().contextConfig
  );

  const coreClient = await useCoreClient().connect();

  // Make sure, the user want to update a user which is related to his tenant.
  const userTenantAccess = await coreClient
    .getModel<UserTenantAccess>('user_tenant_accesses')
    .findOne({ tenant: getTenantId(event), user: event.context.params.userId })
    .populate({
      path: 'user',
      model: coreClient.getModel('users'),
    });

  if (!userTenantAccess) {
    return {
      notFound: true,
    };
  }

  const requestData = await readBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    throw createError({
      statusCode: 500,
      statusMessage: validator.getErrors(),
      fatal: true,
    });
  }

  const role = await coreClient
    .getModel<Role>('roles')
    .findById(requestData.roleId);

  if (!role) {
    return {
      roleNotFound: true,
    };
  }

  userTenantAccess.role = requestData.roleId;

  await userTenantAccess.save();

  return {
    id: userTenantAccess.user.id,
    name: userTenantAccess.user.name,
    email: userTenantAccess.user.email,
    roleId: userTenantAccess.role._id,
  };
});
