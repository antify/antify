import { PermissionId } from '../../datasources/static/permissions';
import { HttpForbiddenError } from '../../errors';
import { useAuthorizationHeader } from '../../utils/useAuthorizationHeader';
import { tenantContextMiddleware } from '../../guard/tenantContext.middleware';
import { useGuard } from '~~/composables/useGuard';
import { useCoreClient } from '~~/server/service/useCoreClient';
import { User } from '~~/server/datasources/core/schemas/user';

export default defineEventHandler(async (event) => {
  const tenantId = tenantContextMiddleware(event);
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.hasPermissionTo(PermissionId.CAN_DELETE_USER, tenantId)) {
    throw new HttpForbiddenError();
  }

  (await useCoreClient().connect())
    .getModel<User>('users')
    .remove({ id: event.context.params.userId });

  return {};
});
