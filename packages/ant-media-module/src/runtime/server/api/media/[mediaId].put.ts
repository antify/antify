import { Input, Response, validator } from '../../../glue/media/[mediaId].put';
import { Media } from '../../datasources/media.schema';
import { getDatabaseClientFromRequest } from '../../utils/getDatabaseClient';
import { isLoggedInHandler } from '@antify/ant-guard';

export default defineEventHandler<Response>(async (event) => {
  const client = await getDatabaseClientFromRequest(event);

  isLoggedInHandler(event);
  // const tenantId = tenantContextMiddleware(event);

  // if (!guard.hasPermissionTo(PermissionId.CAN_EDIT_MEDIA, tenantId)) {
  //   throw createError({
  //     statusCode: 401,
  //     statusMessage: 'Forbidden',
  //   });
  // }

  const response = await useNitroApp().hooks.callHook(
    'before:media-[mediaId].put',
    event
  );

  if (response) {
    return response;
  }

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
