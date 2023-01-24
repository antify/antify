import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpForbiddenError } from '~~/server/errors';
import { useGuard } from '~~/composables/useGuard';
import { User } from '~~/server/datasources/core/schemas/user';

export default defineEventHandler(async (event) => {
  const tenantId = tenantContextMiddleware(event);
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.hasPermissionTo(PermissionId.CAN_UNBAN_USER, tenantId)) {
    throw new HttpForbiddenError();
  }

  const UserModel = (await useCoreClient().connect()).getModel<User>('users');
  const user = await UserModel.findById(event.context.params.userId);

  if (!user) {
    return {
      errors: ['Not Found'],
      errorType: 'NOT_FOUND',
    };
  }

  user.isBanned = false;

  await user.save();

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isSuperAdmin: user.isSuperAdmin,
    isBanned: user.isBanned,
  };
});
