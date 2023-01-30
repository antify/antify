import { useGuard } from '~~/composables/useGuard';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpForbiddenError } from '~~/server/errors';
import { authenticatedMiddleware } from '~~/server/guard/authenticated.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import { Response } from '~~/glue/api/tenants/tenants.get';
import { useMediaService } from '../../service/useMediaService';
import { Tenant } from '~~/server/datasources/core/schemas/tenant';
import { useCoreClient } from '~~/server/service/useCoreClient';

export default defineEventHandler<Response>(async (event) => {
  authenticatedMiddleware(event);

  // TODO:: use middleware
  const guard = useGuard(useAuthorizationHeader(event));
  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_TENANT, tenantId)) {
    throw new HttpForbiddenError();
  }

  // TODO:: implement not super admin + outsource to helper function
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
