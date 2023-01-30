import { tenantContextMiddleware } from '../../../../guard/tenantContext.middleware';
import { useGuard } from '../../../../../composables/useGuard';
import { useAuthorizationHeader } from '../../../../utils/useAuthorizationHeader';
import { PermissionId } from '../../../../datasources/static/permissions';
import { HttpForbiddenError, HttpNotFoundError } from '../../../../errors';
import { useMediaService } from '../../../../service/useMediaService';
import { Tenant } from '~~/server/datasources/core/schemas/tenant';
import { useCoreClient } from '~~/server/service/useCoreClient';

export default defineEventHandler(async (event) => {
  const tenantId = tenantContextMiddleware(event);
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.hasPermissionTo(PermissionId.CAN_REMOVE_TENANT_LOGO, tenantId)) {
    throw new HttpForbiddenError();
  }

  const coreClient = await useCoreClient().connect();
  const tenant = coreClient
    .getModel<Tenant>('tenants')
    .findOne({ id: tenantId });

  if (!tenant || !tenant.logo) {
    throw new HttpNotFoundError(tenantId);
  }

  // Delete from file system
  await useMediaService(tenant.logo).deleteFile();

  // Delete in media table
  await coreClient.getModel('medias').remove({ id: tenant.logo.id });

  return {};
});
