import prisma from '~~/server/datasources/core/client';
import { useGuard } from '~~/composables/useGuard';
import { HttpForbiddenError, HttpNotFoundError } from '~~/server/errors';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { Response } from '~~/glue/api/tenants/[tenantDetailId].get';
import { useMediaService } from '../../service/useMediaService';

export default defineEventHandler<Response>(async (event) => {
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.isUserLoggedIn) {
    throw new HttpForbiddenError();
  }

  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_TENANT, tenantId)) {
    throw new HttpForbiddenError();
  }

  const tenant = await prisma.tenant.findUnique({
    select: {
      id: true,
      name: true,
      logo: true,
    },
    where: {
      id: event.context.params.tenantDetailId,
    },
  });

  if (!tenant) {
    throw new HttpNotFoundError();
  }

  return {
    default: {
      ...tenant,
      url: tenant.logo ? useMediaService(tenant.logo).getLogoUrl(event.context.params.tenantDetailId) : null,
    },
  };
});
