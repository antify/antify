import { sendStream } from 'h3';
import { useGuard } from '~~/composables/useGuard';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { HttpForbiddenError, HttpNotFoundError } from '~~/server/errors';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { useMediaService } from '~~/server/service/useMediaService';
import { Media } from '~~/server/datasources/tenant/schemas/media';
import { useTenantClient } from '~~/server/service/useTenantClient';

export default defineEventHandler(async (event) => {
  const tenantId = tenantContextMiddleware(event);
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_MEDIA, tenantId)) {
    throw new HttpForbiddenError();
  }

  const tenantClient = await useTenantClient().connect(tenantId);
  const MediaModel = tenantClient.getModel<Media>('medias');

  const media = await MediaModel.findOne({
    fileName: event.context.params.fileName,
  });

  if (!media) {
    throw new HttpNotFoundError();
  }

  return sendStream(event, useMediaService(media).createReadStream());
});
