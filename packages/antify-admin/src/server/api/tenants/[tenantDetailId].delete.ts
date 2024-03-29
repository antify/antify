import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpForbiddenError } from '~~/server/errors';
import { Tenant } from '~~/server/datasources/core/schemas/tenant';
import { useCoreClient } from '~~/server/service/useCoreClient';
import { useServerGuard } from '@antify/ant-guard';

export default defineEventHandler(async (event) => {
  await tenantContextMiddleware(event);

  const guard = await useServerGuard(event);
  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_DELETE_TENANT, tenantId)) {
    throw new HttpForbiddenError();
  }

  const TenantModel = (await useCoreClient().connect()).getModel<Tenant>(
    'tenants'
  );
  const tenant = await TenantModel.findById(
    event.context.params.tenantDetailId
  );

  if (!tenant) {
    return {
      notFound: {
        errors: ['Not Found'],
      },
    };
  }

  tenant.remove();

  return {};
});
