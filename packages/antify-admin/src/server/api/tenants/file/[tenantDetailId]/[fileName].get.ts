import { tenantContextMiddleware } from '../../../../guard/tenantContext.middleware';
import { useServerGuard } from '@antify/ant-guard';
import { PermissionId } from '../../../../datasources/static/permissions';
import { HttpForbiddenError, HttpNotFoundError } from '../../../../errors';
import { sendStream } from 'h3';
import { useMediaService } from '../../../../service/useMediaService';
import { useCoreClient } from '~~/server/service/useCoreClient';
import { Tenant } from '~~/server/datasources/core/schemas/tenant';

export default defineEventHandler(async (event) => {
  const tenantId = await tenantContextMiddleware(event);
  const guard = await useServerGuard(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_MEDIA, tenantId)) {
    throw new HttpForbiddenError();
  }

  const tenant = (await useCoreClient().connect())
    .getModel<Tenant>('tenants')
    .findOne({ id: tenantId });

  if (!tenant || !tenant.logo) {
    throw new HttpNotFoundError();
  }

  return sendStream(event, useMediaService(tenant.logo).createReadStream());
});
