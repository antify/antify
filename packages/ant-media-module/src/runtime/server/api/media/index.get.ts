import { Media } from '../../datasources/media.schema';
import { isLoggedInHandler, isAuthorizedHandler } from '@antify/ant-guard';
import { extendSchemas } from '../../datasources/schema.extensions';
import { getDatabaseClientFromRequest } from '@antify/kit';

export default defineEventHandler<Response>(async (event) => {
  const contextConfig = useRuntimeConfig().antMedia.providers;

  isLoggedInHandler(event);
  await isAuthorizedHandler(
    event,
    'CAN_READ_MEDIA' /*PermissionId.CAN_READ_MEDIA*/,
    contextConfig
  );

  const client = await getDatabaseClientFromRequest(
    event,
    contextConfig,
    extendSchemas
  );
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
