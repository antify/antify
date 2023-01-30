import { useGuard } from '~~/composables/useGuard';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpForbiddenError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { Input, validator } from '~~/glue/api/users/[userId].put';
import { UserTenantAccess } from '~~/server/datasources/core/schemas/userTenantAccess';
import { Role } from '~~/server/datasources/core/schemas/roles';
import { useCoreClient } from '~~/server/service/useCoreClient';

export default defineEventHandler(async (event) => {
  const tenantId = tenantContextMiddleware(event);
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.hasPermissionTo(PermissionId.CAN_UPDATE_USER, tenantId)) {
    throw new HttpForbiddenError();
  }

  const coreClient = await useCoreClient().connect();

  // Make sure, the user want to update a user which is related to his tenant.
  const userTenantAccess = await coreClient
    .getModel<UserTenantAccess>('user_tenant_accesses')
    .findOne({ tenant: tenantId, user: event.context.params.userId })
    .populate({
      path: 'user',
      model: coreClient.getModel('users'),
    });

  if (!userTenantAccess) {
    throw new HttpForbiddenError();
  }

  const requestData = await readBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    return {
      errors: validator.getErrors(),
      errorType: 'BAD_REQUEST',
    };
  }

  const role = await coreClient
    .getModel<Role>('roles')
    .findById(requestData.roleId);

  if (!role) {
    return {
      errors: [`Role with id ${requestData.roleId} does not exists.`],
      errorType: 'BAD_REQUEST',
    };
  }

  userTenantAccess.role = requestData.roleId;

  await userTenantAccess.save();

  return {
    default: {
      id: userTenantAccess.user.id,
      name: userTenantAccess.user.name,
      email: userTenantAccess.user.email,
      roleId: userTenantAccess.role._id,
    },
  };
});
