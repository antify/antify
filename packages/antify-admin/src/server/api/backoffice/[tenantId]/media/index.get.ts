import { useGuard } from '~~/composables/useGuard';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpForbiddenError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { Response } from '~~/glue/api/backoffice/[tenantId]/media/index.get';
import { useMediaService } from '~~/server/service/useMediaService';
import { Media } from '~~/server/datasources/tenant/schemas/media';
import { useTenantClient } from '~~/server/service/useTenantClient';

export default defineEventHandler<Response>(async (event) => {
  const tenantId = tenantContextMiddleware(event);
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_MEDIA, tenantId)) {
    throw new HttpForbiddenError();
  }

  const tenantClient = await useTenantClient().connect(tenantId);
  const MediaModel = tenantClient.getModel<Media>('medias');
  const media = await MediaModel.find({
    title: { $regex: '^' + getQuery(event)?.search, $options: 'i' },
  });

  return {
    default: media.map((mediaItem) => ({
      id: mediaItem.id,
      title: mediaItem.title,
      url: useMediaService(mediaItem).getMediaUrl(tenantId),
      fileType: mediaItem.fileType,
    })),
  };
});
