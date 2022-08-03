import prisma from '~~/server/datasources/core/client';
import { useGuard } from '~~/composables/useGuard';
import { HttpNotFoundError } from '~~/server/errors';
import { authenticatedMiddleware } from '~~/server/guard/authenticated.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { Response } from '~~/glue/api/profile/user.get';
import { useMediaService } from '../../service/useMediaService';

export default defineEventHandler<Response>(async (event) => {
  authenticatedMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const user = await prisma.user.findUnique({
    where: {
      id: guard.token.id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      profilePicture: true,
    },
  });

  if (!user) {
    throw new HttpNotFoundError();
  }

  return {
    default: {
      ...user,
      url: user.profilePicture
        ? useMediaService(user.profilePicture).getProfileUrl()
        : null,
    },
  };
});
