import formidable, { File, Files } from 'formidable';
import prisma from '~~/server/datasources/db/client';
import { useGuard } from '~~/composables/useGuard';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import { HttpForbiddenError } from '~~/server/errors';
import { useMediaStorage } from '~~/server/service/useMediaService';

export default defineEventHandler(async (event) => {
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_CREATE_MEDIA, tenantId)) {
    throw new HttpForbiddenError();
  }

  const mediaStorage = useMediaStorage();
  const form = formidable({
    multiples: true,
    uploadDir: mediaStorage.getAbsoluteUploadDir(),
    keepExtensions: true,
  });

  // TODO:: limit allowed file types

  const files: Files = await new Promise((resolve, reject) => {
    // TODO:: if uploading multiple large files (>5MB) this here fails some times
    form.parse(event.req, async (err, fields, files) => {
      if (err) {
        reject('could not parse form');
      }

      resolve(files);
    });
  });

  await Promise.all(
    Object.values(files).map((file: File) => {
      return prisma.media.create({
        data: {
          title: file.originalFilename,
          fileName: file.newFilename,
          fileType: file.mimetype,
        },
      });
    })
  );

  return {};
});
