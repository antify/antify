import { Input, Response, validator } from '../../../glue/media/[mediaId].put';
import { Media } from '../../datasources/media.schema';
import { isLoggedInHandler, isAuthorizedHandler } from '@antify/ant-guard';
import { extendSchemas } from '../../datasources/schema.extensions';
import { getDatabaseClientFromRequest } from '@antify/kit';

export default defineEventHandler<Response>(async (event) => {
  const contextConfig = useRuntimeConfig().antMedia.providers;

  isLoggedInHandler(event);
  await isAuthorizedHandler(event, 'CAN_EDIT_MEDIA', contextConfig);

  const client = await getDatabaseClientFromRequest(
    event,
    contextConfig,
    extendSchemas
  );
  const MediaModel = client.getModel<Media>('medias');

  const media = await MediaModel.findById(event.context.params.mediaId);

  if (!media) {
    return {
      errors: ['Not found'],
      errorType: 'NOT_FOUND',
    };
  }

  const requestData = await readBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    return {
      badRequest: {
        errors: validator.getErrors(),
      },
    };
  }

  media.title = requestData.title;

  await media.save();

  return {
    default: {
      id: media.id,
      title: media.title,
      url: '', //useMediaService(media).getMediaUrl(tenantId),
      fileType: media.fileType,
    },
  };
});
