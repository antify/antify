import tenantClient from "~~/server/datasources/tenant/client";
import { useGuard } from "~~/composables/useGuard";
import { createForbiddenError, HttpForbiddenError } from '~~/server/errors';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { PermissionId } from "~~/server/datasources/static/permissions";
import { useTenantHeader } from "~~/server/utils/useTenantHeader";

export default defineEventHandler(async (event) => {
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.isUserLoggedIn) {
    return createForbiddenError();
  }

  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_MAIL_TEMPLATES, tenantId)) {
    throw new HttpForbiddenError();
  }

  return await tenantClient.mailTemplate.findMany({
    select: {
      id: true,
      title: true
    }
  });
});
