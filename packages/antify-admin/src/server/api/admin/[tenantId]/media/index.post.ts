import formidable, { File, Files } from 'formidable';
import prisma from '~~/server/datasources/tenant/client';
import { useGuard } from '~~/composables/useGuard';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import { HttpForbiddenError } from '~~/server/errors';
import { useMediaStorage } from '~~/server/service/useMediaService';
import { HttpBadRequestError } from '../../../../errors';

export default defineEventHandler(async (event) => {
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_CREATE_MEDIA, tenantId)) {
    throw new HttpForbiddenError();
  }

  // TODO:: virus scanner
  const mediaStorage = useMediaStorage();
  const form = formidable({
    multiples: true,
    uploadDir: mediaStorage.getAbsoluteUploadDir(),
    keepExtensions: true,
    filter: function ({ name, originalFilename, mimetype }) {
      // keep only images, text files and pdf's
      return (
        mimetype &&
        (mimetype.includes('image') ||
          mimetype.includes('application/pdf') ||
          mimetype.includes('text/plain'))
      );
    },
  });

  const files: Files = await new Promise((resolve, reject) => {
    form.parse(event.req, async (err, fields, files) => {
      if (err) {
        throw new HttpBadRequestError(`Upload failed: ${err}`);
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
