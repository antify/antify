import { useServerGuard } from '@antify/ant-guard';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpForbiddenError } from '~~/server/errors';
import { authenticatedMiddleware } from '~~/server/guard/authenticated.middleware';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import { Response } from '~~/glue/api/tenants/tenants.get';
import { Paginator } from '~~/server/utils/paginator';
import { Tenant } from '~~/server/datasources/core/schemas/tenant';
import { Model } from 'mongoose';
import { useCoreClient } from '~~/server/service/useCoreClient';

export default defineEventHandler<Response>(async (event) => {
  await authenticatedMiddleware(event);

  const guard = await useServerGuard(event);
  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_TENANT, tenantId)) {
    throw new HttpForbiddenError();
  }

  let where = {};

  // TODO:: Only show the users tenants here
  // if (!guard.token?.isSuperAdmin) {
  //   where = {
  //     id: {
  //       in: guard.token.tenantsAccess.map(
  //         (tenantAccess) => tenantAccess.tenantId
  //       ),
  //     },
  //   };
  // }

  const paginator = new Paginator(event, 'title');

  const TenantModel = (await useCoreClient().connect()).getModel<Tenant>(
    'tenants'
  );

  const tenants = await paginator.paginateQuery(TenantModel.find(where));

  return {
    default: {
      data: tenants.map((tenant: Model<Tenant>) => ({
        id: tenant.id,
        name: tenant.name,
      })),
      pagination: await paginator.getPaginationResponse(TenantModel),
    },
  };
});
