import { Media } from '../../datasources/media.schema';
import { isLoggedInHandler, isAuthorizedHandler } from '@antify/ant-guard';
import { extendSchemas } from '../../datasources/schema.extensions';
import { getDatabaseClientFromRequest } from '@antify/kit';

export default defineEventHandler(async (event) => {
  const contextConfig = useRuntimeConfig().antMedia.providers;

  isLoggedInHandler(event);
  await isAuthorizedHandler(event, 'CAN_DELETE_MEDIA', contextConfig);

  const client = await getDatabaseClientFromRequest(
    event,
    contextConfig,
    extendSchemas
  );
  const media = await client
    .getModel<Media>('medias')
    .findById(event.context.params.mediaId);

  if (!media) {
    return {
      errors: ['Not found'],
      errorType: 'NOT_FOUND',
    };
  }

  await media.remove();

  return {};
});
