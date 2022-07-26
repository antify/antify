import { useGuard } from '~~/composables/useGuard';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpForbiddenError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import prisma from '~~/server/datasources/db/client';
import { Response } from '~~/glue/api/admin/[tenantId]/media/[mediaId].get';
import { useMediaService } from '../../../../service/useMediaService';

export default defineEventHandler<Response>(async (event) => {
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_MEDIA, tenantId)) {
    throw new HttpForbiddenError();
  }

  const media = await prisma.media.findUnique({
    select: {
      id: true,
      title: true,
      fileName: true,
      fileType: true,
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

  return {
    default: {
      id: media.id,
      title: media.title,
      url: useMediaService(media).getMediaUrl(tenantId),
      fileType: media.fileType,
    },
  };
});
