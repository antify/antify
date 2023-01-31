import { isSuperAdminMiddleware } from '~~/server/guard/isSuperAdmin.middleware';
import { Tenant } from '~~/server/datasources/core/schemas/tenant';
import { useCoreClient } from '~~/server/service/useCoreClient';
import { useTenantClient } from '~~/server/service/useTenantClient';

export default defineEventHandler(async (event) => {
  isSuperAdminMiddleware(event);

  const tenant = await (await useCoreClient().connect())
    .getModel<Tenant>('tenants')
    .findById(event.context.params.tenantDetailId);

  if (!tenant) {
    return {
      notFound: {
        errors: ['Not Found'],
      },
    };
  }

  await tenant.remove();

  const tenantClient = await useTenantClient().connect(tenant.id);

  await tenantClient.getConnection().dropDatabase();

  return {};
});
