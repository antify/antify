import prisma from '~~/server/datasources/core/client';
import formidable, { Files, File } from 'formidable';
import { tenantContextMiddleware } from '../../../../guard/tenantContext.middleware';
import { useAuthorizationHeader } from '../../../../utils/useAuthorizationHeader';
import { useTenantHeader } from '../../../../utils/useTenantHeader';
import { useGuard } from '../../../../../composables/useGuard';
import { PermissionId } from '../../../../datasources/static/permissions';
import { HttpForbiddenError, HttpBadRequestError } from '../../../../errors';
import { useMediaStorage } from '../../../../service/useMediaService';

export default defineEventHandler(async (event) => {
  tenantContextMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const globTenantId = useTenantHeader(event);
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
    !guard.hasPermissionTo(PermissionId.CAN_UPLOAD_TENANT_LOGO, globTenantId) ||
    !user
  ) {
    throw new HttpForbiddenError();
  }

  // The tenant in wich I try to set the new logo
  const tenantId = event.context.params.tenantDetailId;

  // TODO:: virus scanner

  const mediaStorage = useMediaStorage();
  const form = formidable({
    multiples: true, // TODO:: check should be false in this instance
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
    form.parse(event.req, async (error, fields, files) => {
      if (error) {
        reject(`Upload failed: ${error}`);
        throw new HttpBadRequestError(`Upload failed: ${error}`);
      }

      resolve(files);
    });
  });

  const file = Object.values(files)[0] as File;

  // Save file in storage
  const logoImage = await prisma.media.create({
    data: {
      title: file.originalFilename,
      fileName: file.newFilename,
      fileType: file.mimetype,
    },
  });

  await prisma.tenant.update({
    select: {
      id: true,
      name: true,
    },
    where: {
      id: tenantId,
    },
    data: {
      logo: {
        connect: {
          id: logoImage.id,
        },
      },
    },
  });

  return {};
});
