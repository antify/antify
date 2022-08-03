import { useGuard } from '~~/composables/useGuard';
import { permissions } from '~~/server/datasources/static/permissions';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { Response } from '~~/glue/api/admin/[tenantId]/roles/permissions.get';
import { HttpForbiddenError } from '../../errors';

export default defineEventHandler<Response>(async (event) => {
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.isUserLoggedIn) {
    throw new HttpForbiddenError();
  }

  // TODO:: check permission

  return { default: permissions };
});
