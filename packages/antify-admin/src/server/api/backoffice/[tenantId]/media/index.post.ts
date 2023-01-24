import formidable, { File, Files } from 'formidable';
import { useGuard } from '~~/composables/useGuard';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { HttpForbiddenError } from '~~/server/errors';
import { useMediaStorage } from '~~/server/service/useMediaService';
import { HttpBadRequestError } from '~~/server/errors';
import { Media } from '~~/server/datasources/tenant/schemas/media';

export default defineEventHandler(async (event) => {
  const tenantId = tenantContextMiddleware(event);
  const guard = useGuard(useAuthorizationHeader(event));

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
    form.parse(event.node.req, async (err, fields, files) => {
      if (err) {
        throw new HttpBadRequestError(`Upload failed: ${err}`);
      }

      resolve(files);
    });
  });

  const tenantClient = await useTenantClient().connect(tenantId);
  const MediaModel = tenantClient.getModel<Media>('medias');

  await MediaModel.insertMany(
    Object.values(files).map((file: File) => ({
      title: file.originalFilename,
      fileName: file.newFilename,
      fileType: file.mimetype,
    }))
  );

  return {};
});
