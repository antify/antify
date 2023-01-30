import { useGuard } from '~~/composables/useGuard';
import { authenticatedMiddleware } from '~~/server/guard/authenticated.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useMediaService } from '../../service/useMediaService';
import { User } from '~~/server/datasources/core/schemas/user';
import { useCoreClient } from '~~/server/service/useCoreClient';

export default defineEventHandler(async (event) => {
  authenticatedMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const user = await (await useCoreClient().connect())
    .getModel<User>('users')
    .findById(guard.token?.id);

  if (!user) {
    return {
      errors: ['Not Found'],
      errorType: 'NOT_FOUND',
    };
  }

  return {
    default: {
      id: user.id,
      email: user.email,
      name: user.name,
      // url: user.profilePicture
      //   ? useMediaService(user.profilePicture).getProfileUrl()
      //   : null,
    },
  };
});
