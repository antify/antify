import { tenantContextMiddleware } from '../../../../guard/tenantContext.middleware';
import { useGuard } from '../../../../../composables/useGuard';
import { useAuthorizationHeader } from '../../../../utils/useAuthorizationHeader';
import { useTenantHeader } from '../../../../utils/useTenantHeader';
import { PermissionId } from '../../../../datasources/static/permissions';
import prisma from '~~/server/datasources/core/client';
import { HttpForbiddenError, HttpNotFoundError } from '../../../../errors';
import { useMediaService } from '../../../../service/useMediaService';
export default defineEventHandler(async (event) => {
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const globTenantId = useTenantHeader(event);

  if (
    !guard.hasPermissionTo(PermissionId.CAN_REMOVE_TENANT_LOGO, globTenantId)
  ) {
    throw new HttpForbiddenError();
  }

  // The tenant in wich I try to delete the logo in
  const tenantId = event.context.params.tenantDetailId;

  const tenant = await prisma.tenant.findUnique({
    select: {
      id: true,
      name: true,
      logo: true,
    },
    where: {
      id: tenantId,
    },
  });

  if (!tenant || !tenant.logo) {
    throw new HttpNotFoundError(tenantId);
  }

  // Delete from file system
  await useMediaService(tenant.logo).deleteFile();

  // Delete in media table
  await prisma.media.delete({
    where: {
      id: tenant.logo.id,
    },
  });

  return {};
});
