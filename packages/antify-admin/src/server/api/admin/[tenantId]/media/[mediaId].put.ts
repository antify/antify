import { useGuard } from '~~/composables/useGuard';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpForbiddenError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import prisma from '~~/server/datasources/db/client';
import {
  Input,
  Response,
  validator,
} from '~~/glue/api/admin/[tenantId]/media/[mediaId].put';
import { useMediaService } from '../../../../service/useMediaService';

export default defineEventHandler<Response>(async (event) => {
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_EDIT_MEDIA, tenantId)) {
    throw new HttpForbiddenError();
  }

  const media = await prisma.media.findUnique({
    select: {
      id: true,
      title: true,
    },
    where: {
      id: event.context.params.mediaId,
    },
  });

  if (!media) {
    return {
      notFound: {
        errors: ['Not found'],
      },
    };
  }

  const requestData = await useBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    return {
      badRequest: {
        errors: validator.getErrors(),
      },
    };
  }

  const updatedMedia = await prisma.media.update({
    select: {
      id: true,
      title: true,
      fileName: true,
      fileType: true,
    },
    where: {
      id: event.context.params.mediaId,
    },
    data: {
      title: requestData.title,
    },
  });

  return {
    default: {
      id: updatedMedia.id,
      title: updatedMedia.title,
      url: useMediaService(updatedMedia).getUrl(),
      fileType: updatedMedia.fileType,
    },
  };
});
