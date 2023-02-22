import { Media } from '../../datasources/media.schema';
import { isLoggedInHandler, isAuthorizedHandler } from '@antify/ant-guard';
import { extendSchemas } from '../../datasources/schema.extensions';
import { getDatabaseClientFromRequest } from '@antify/kit';

export default defineEventHandler(async (event) => {
  const contextConfig = useRuntimeConfig().antMedia.providers;

  isLoggedInHandler(event);
  await isAuthorizedHandler(event, 'CAN_CREATE_MEDIA', contextConfig);

  const client = await getDatabaseClientFromRequest(
    event,
    contextConfig,
    extendSchemas
  );
  // TODO:: validate files
  const files = await readBody(event);
  const MediaModel = client.getModel<Media>('medias');

  await MediaModel.insertMany(files);

  return {};
});
