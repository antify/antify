import { tenantContextMiddleware } from '../../../../guard/tenantContext.middleware';
import { useGuard } from '../../../../../composables/useGuard';
import { useAuthorizationHeader } from '../../../../utils/useAuthorizationHeader';
import { PermissionId } from '../../../../datasources/static/permissions';
import { HttpForbiddenError, HttpNotFoundError } from '../../../../errors';
import prisma from '~~/server/datasources/core/client';
import { sendStream } from 'h3';
import { useMediaService } from '../../../../service/useMediaService';

export default defineEventHandler(async (event) => {
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
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

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_MEDIA, tenantId)) {
    throw new HttpForbiddenError();
  }

  if (!tenant || !tenant.logo) {
    throw new HttpNotFoundError();
  }

  return sendStream(event, useMediaService(tenant.logo).createReadStream());
});
