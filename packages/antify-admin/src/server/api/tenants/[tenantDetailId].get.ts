import { useServerGuard } from '@antify/ant-guard';
import { HttpForbiddenError, HttpNotFoundError } from '~~/server/errors';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { Response } from '~~/glue/api/tenants/[tenantDetailId].get';
import { useMediaService } from '~~/server/service/useMediaService';
import { Tenant } from '~~/server/datasources/core/schemas/tenant';
import { useCoreClient } from '~~/server/service/useCoreClient';

export default defineEventHandler<Response>(async (event) => {
  const guard = await useServerGuard(event);

  if (!guard.isUserLoggedIn) {
    throw new HttpForbiddenError();
  }

  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_TENANT, tenantId)) {
    throw new HttpForbiddenError();
  }

  const tenant = await (await useCoreClient().connect())
    .getModel<Tenant>('tenants')
    .findById(event.context.params.tenantDetailId);

  if (!tenant) {
    throw new HttpNotFoundError();
  }

  return {
    default: {
      id: tenant.id,
      name: tenant.name,
      url: tenant.logo
        ? useMediaService(tenant.logo).getLogoUrl(
            event.context.params.tenantDetailId
          )
        : null,
    },
  };
});
