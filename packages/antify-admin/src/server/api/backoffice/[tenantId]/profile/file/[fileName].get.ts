import { useAuthorizationHeader } from '../../../../../utils/useAuthorizationHeader';
import { PermissionId } from '../../../../../datasources/static/permissions';
import prisma from '~~/server/datasources/core/client';
import { useTenantHeader } from '../../../../../utils/useTenantHeader';
import { tenantContextMiddleware } from '../../../../../guard/tenantContext.middleware';
import { HttpForbiddenError, HttpNotFoundError } from '../../../../../errors';
import { sendStream } from 'h3';
import { useMediaService } from '../../../../../service/useMediaService';
import { useGuard } from '~~/composables/useGuard';

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

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_MEDIA, tenantId)) {
    throw new HttpForbiddenError();
  }

  if (!user.profilePicture) {
    throw new HttpNotFoundError();
  }

  return sendStream(event, useMediaService(user.profilePicture).createReadStream());
});
