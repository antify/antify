import { isLoggedInHandler } from '@antify/ant-guard';
import { Response } from '~~/glue/api/tenants/tenants.get';
import { useMediaService } from '../../service/useMediaService';
import { Tenant } from '~~/server/datasources/core/schemas/tenant';
import { useCoreClient } from '~~/server/service/useCoreClient';

export default defineEventHandler<Response>(async (event) => {
  await isLoggedInHandler(event);

  // TODO:: only show tenants the user has access to it
  //  implement not super admin + outsource to helper function
  // let where = {};
  // if (!guard.token.isSuperAdmin) {
  //   where = {
  //     id: {
  //       in: guard.token.tenantsAccess.map(
  //         (tenantAccess) => tenantAccess.tenantId
  //       ),
  //     },
  //   };
  // }

  const TenantModel = (await useCoreClient().connect()).getModel<Tenant>(
    'tenants'
  );

  const tenants = await TenantModel.find({
    // orderBy: { name: 'asc' },
  });

  return {
    default: {
      data: tenants.map((tenant) => {
        return {
          id: tenant.id,
          name: tenant.name,
          url: tenant.logo
            ? useMediaService(tenant.logo).getLogoUrl(tenant.id)
            : null,
        };
      }),
    },
  };
});
