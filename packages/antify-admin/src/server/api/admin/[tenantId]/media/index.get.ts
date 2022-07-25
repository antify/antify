import prisma from '~~/server/datasources/db/client';
import { useGuard } from '~~/composables/useGuard';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpForbiddenError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import { Response } from '~~/glue/api/admin/[tenantId]/media/index.get';
import { useMediaService } from '~~/server/service/useMediaService';

export default defineEventHandler<Response>(async (event) => {
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_MEDIA, tenantId)) {
    throw new HttpForbiddenError();
  }

  const media = await prisma.media.findMany({
    where: {
      title: {
        contains: useQuery(event)?.search,
      },
    },
    select: {
      id: true,
      title: true,
      fileName: true,
      fileType: true,
    },
    orderBy: { title: 'asc' },
  });

  return {
    default: media.map((mediaItem) => {
      return {
        id: mediaItem.id,
        title: mediaItem.title,
        url: useMediaService(mediaItem).getUrl(),
        fileType: mediaItem.fileType,
      };
    }),
  };
});
