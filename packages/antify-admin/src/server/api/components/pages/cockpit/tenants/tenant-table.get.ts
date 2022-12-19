import { Tenant } from '~~/server/datasources/core/schemas/tenant';
import { isSuperAdminMiddleware } from '~~/server/guard/isSuperAdmin.middleware';
import { Paginator } from '~~/server/utils/paginator';

export default defineEventHandler(async (event) => {
  isSuperAdminMiddleware(event);

  const paginator = new Paginator(event, 'name');

  const TenantModel = (await useCoreClient().connect()).getModel<Tenant>(
    'tenants'
  );

  const tenants = await paginator.paginateQuery(TenantModel.find());

  return {
    default: {
      data: tenants.map((tenant) => ({
        id: tenant.id,
        name: tenant.name,
      })),
      pagination: await paginator.getPaginationResponse(TenantModel),
    },
  };
});
