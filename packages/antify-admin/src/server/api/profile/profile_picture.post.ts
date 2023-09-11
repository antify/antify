import { tenantContextMiddleware } from '../../guard/tenantContext.middleware';
import { PermissionId } from '../../datasources/static/permissions';
import { HttpBadRequestError, HttpForbiddenError } from '../../errors';
import { useServerGuard } from '@antify/ant-guard';
import { useMediaStorage } from '../../service/useMediaService';
import formidable, { Files, File } from 'formidable';
import { User } from '~~/server/datasources/core/schemas/user';
import { Media } from '~~/server/datasources/core/schemas/media';
import { useCoreClient } from '~~/server/service/useCoreClient';

export default defineEventHandler(async (event) => {
  const tenantId = await tenantContextMiddleware(event);
  const guard = await useServerGuard(event);
  const coreClient = await useCoreClient().connect();
  const user = await coreClient
    .getModel<User>('users')
    .findById(guard.token?.id)
    .populate('profilePicture');

  if (!user) {
    return {
      errors: ['Not Found'],
      errorType: 'NOT_FOUND',
    };
  }

  if (
    !guard.hasPermissionTo(PermissionId.CAN_UPLOAD_PROFILE_PICTURE, tenantId) ||
    !user
  ) {
    throw new HttpForbiddenError();
  }

  // TODO:: virus scanner

  const mediaStorage = useMediaStorage();
  const form = formidable({
    multiples: true,
    uploadDir: mediaStorage.getAbsoluteUploadDir(),
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // TODO:: get from env 10 MB
    filter: function ({ name, originalFilename, mimetype }) {
      // keep only images
      return mimetype && mimetype.includes('image');
      // TODO:: throw error when non image
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

  const file = Object.values(files)[0] as File;

  // Save file in storage
  const Media = coreClient.getModel<Media>('medias');
  await new Media({
    title: file.originalFilename,
    fileName: file.newFilename,
    fileType: file.mimetype,
  }).save();

  return {};
});
