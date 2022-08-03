import { useGuard } from "~~/composables/useGuard";
import { PermissionId } from '~~/server/datasources/static/permissions';
import { HttpForbiddenError, HttpNotFoundError } from '~~/server/errors';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import prisma from "~~/server/datasources/tenant/client";
import { useMediaService } from "~~/server/service/useMediaService";

export default defineEventHandler(async (event) => {
    tenantContextMiddleware(event);

    const guard = useGuard(useAuthorizationHeader(event));
    const tenantId = useTenantHeader(event);

    if (!guard.hasPermissionTo(PermissionId.CAN_DELETE_MEDIA, tenantId)) {
        throw new HttpForbiddenError();
    }

    const media = await prisma.media.findUnique({
        select: {
            fileName: true,
            fileType: true
        },
        where: {
            id: event.context.params.mediaId
        }
    });

    if (!media) {
        throw new HttpNotFoundError();
    }

    await prisma.media.delete({
        where: {
            id: event.context.params.mediaId
        },
    });

    useMediaService(media).deleteFile();

    return {};
});
