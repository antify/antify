import { tenantContextMiddleware } from '../../guard/tenantContext.middleware';
import { useAuthorizationHeader } from '../../utils/useAuthorizationHeader';
import { useTenantHeader } from '../../utils/useTenantHeader';
import { PermissionId } from '../../datasources/static/permissions';
import { HttpBadRequestError, HttpForbiddenError } from '../../errors';
import { useGuard } from '~~/composables/useGuard';
import { useMediaStorage } from '../../service/useMediaService';
import formidable, { Files, File } from 'formidable';
import prisma from '~~/server/datasources/auth/client';

export default defineEventHandler(async (event) => {
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const tenantId = useTenantHeader(event);
  const userId = guard.token.id;
  const user = await prisma.user.findUnique({
    select: {
      id: true,
      email: true,
      name: true,
    },
    where: {
      id: userId,
    },
  });

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
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    filter: function ({ name, originalFilename, mimetype }) {
      // keep only images
      return mimetype && mimetype.includes('image');
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
  const userProfilePicture = await prisma.media.create({
    data: {
      title: file.originalFilename,
      fileName: file.newFilename,
      fileType: file.mimetype,
    },
  });

  await prisma.user.update({
    select: {
      id: true,
      email: true,
      name: true,
    },
    where: {
      id: userId,
    },
    data: {
      profilePicture: {
        connect: {
          id: userProfilePicture.id,
        },
      },
    },
  });

  return {};
});
