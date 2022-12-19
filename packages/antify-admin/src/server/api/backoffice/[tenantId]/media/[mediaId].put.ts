import { useGuard } from '~~/composables/useGuard';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpForbiddenError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import {
  Input,
  Response,
  validator,
} from '~~/glue/api/backoffice/[tenantId]/media/[mediaId].put';
import { useMediaService } from '../../../../service/useMediaService';
import { Media } from '~~/server/datasources/tenant/schemas/media';

export default defineEventHandler<Response>(async (event) => {
  const tenantId = tenantContextMiddleware(event);
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.hasPermissionTo(PermissionId.CAN_EDIT_MEDIA, tenantId)) {
    throw new HttpForbiddenError();
  }

  const tenantClient = await useTenantClient().connect(tenantId);
  const MediaModel = tenantClient.getModel<Media>('medias');

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
      url: useMediaService(media).getMediaUrl(tenantId),
      fileType: media.fileType,
    },
  };
});
