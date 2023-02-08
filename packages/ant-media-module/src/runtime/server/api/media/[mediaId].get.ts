import { getDatabaseClientFromRequest } from '../../utils/getDatabaseClient';
import { Media } from '../../datasources/media.schema';
import { isLoggedInHandler } from '@antify/ant-guard';

export default defineEventHandler(async (event) => {
  // const tenantId = tenantContextMiddleware(event);
  // const guard = useGuard(useAuthorizationHeader(event));

  // if (!guard.hasPermissionTo(PermissionId.CAN_READ_MEDIA, tenantId)) {
  //   throw new HttpForbiddenError();
  // }

  isLoggedInHandler(event);

  const response = await useNitroApp().hooks.callHook(
    'before:media-[mediaId].get',
    event
  );

  if (response) {
    return response;
  }

  const media = await (await getDatabaseClientFromRequest(event))
    .getModel<Media>('medias')
    .findById(event.context.params.mediaId);

  if (!media) {
    return {
      errors: ['Not found'],
      errorType: 'NOT_FOUND',
    };
  }

  return {
    default: {
      id: media.id,
      title: media.title,
      url: '', //useMediaService(media).getMediaUrl(tenantId),
      fileType: media.fileType,
    },
  };
});
