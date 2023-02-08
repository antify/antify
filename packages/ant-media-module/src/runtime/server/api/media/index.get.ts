import { getDatabaseClientFromRequest } from '../../utils/getDatabaseClient';
import { Media } from '../../datasources/media.schema';
import { isLoggedInHandler } from '@antify/ant-guard';

export default defineEventHandler<Response>(async (event) => {
  // const tenantId = tenantContextMiddleware(event);
  // const guard = useGuard(useAuthorizationHeader(event));

  // if (!guard.hasPermissionTo(PermissionId.CAN_READ_MEDIA, tenantId)) {
  //   throw new HttpForbiddenError();
  // }

  isLoggedInHandler(event);

  const response = await useNitroApp().hooks.callHook(
    'before:media.get',
    event
  );

  if (response) {
    return response;
  }

  const client = await getDatabaseClientFromRequest(event);

  const MediaModel = client.getModel<Media>('medias');
  const media = await MediaModel.find({
    title: { $regex: '^' + getQuery(event)?.search, $options: 'i' },
  });

  return {
    default: media.map((mediaItem) => ({
      id: mediaItem.id,
      title: mediaItem.title,
      url: '', //useMediaService(mediaItem).getMediaUrl(tenantId),
      fileType: mediaItem.fileType,
    })),
  };
});
