import { isSuperAdminMiddleware } from '~~/server/guard/isSuperAdmin.middleware';
import { Tenant } from '~~/server/datasources/core/schemas/tenant';
import { useCoreClient } from '~~/server/service/useCoreClient';

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

  return {
    default: {
      id: tenant.id,
      name: tenant.name,
    },
  };
});
