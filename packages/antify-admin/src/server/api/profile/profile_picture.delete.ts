import { tenantContextMiddleware } from '../../guard/tenantContext.middleware';
import prisma from '~~/server/datasources/core/client';
import { useGuard } from '~~/composables/useGuard';
import { useAuthorizationHeader } from '../../utils/useAuthorizationHeader';
import { useTenantHeader } from '../../utils/useTenantHeader';
import { HttpForbiddenError } from '../../errors';
import { PermissionId } from '../../datasources/static/permissions';
import { useMediaService } from '../../service/useMediaService';

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
      profilePicture: true,
    },
    where: {
      id: userId,
    },
  });

  if (
    !guard.hasPermissionTo(PermissionId.CAN_REMOVE_PROFILE_PICTURE, tenantId) ||
    !user ||
    !user.profilePicture
  ) {
    throw new HttpForbiddenError();
  }

  // Delete from file system
  await useMediaService(user.profilePicture).deleteFile();

  // Delete in media table
  await prisma.media.delete({
    where: {
      id: user.profilePicture.id,
    },
  });

  return {};
});
