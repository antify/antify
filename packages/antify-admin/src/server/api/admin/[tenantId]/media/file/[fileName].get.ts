import { sendStream } from 'h3';
import prisma from '~~/server/datasources/tenant/client';
import { useGuard } from "~~/composables/useGuard";
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import { HttpForbiddenError, HttpNotFoundError } from '~~/server/errors';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { useMediaService } from '~~/server/service/useMediaService';

export default defineEventHandler(async (event) => {
    tenantContextMiddleware(event);

    const guard = useGuard(useAuthorizationHeader(event));
    const tenantId = useTenantHeader(event);

    if (!guard.hasPermissionTo(PermissionId.CAN_READ_MEDIA, tenantId)) {
        throw new HttpForbiddenError();
    }

    const media = await prisma.media.findUnique({
        select: {
            fileName: true,
            fileType: true
        },
        where: {
            fileName: event.context.params.fileName
        }
    });

    if (!media) {
        throw new HttpNotFoundError();
    }

    return sendStream(event, useMediaService(media).createReadStream());
});
