import { useGuard } from '~~/composables/useGuard';
import { HttpNotFoundError } from '~~/server/errors';
import { authenticatedMiddleware } from '~~/server/guard/authenticated.middleware';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { Response } from '~~/glue/api/global/me.get';
import { useMediaService } from '../../service/useMediaService';
import { User } from '~~/server/datasources/core/schemas/user';

export default defineEventHandler<Response>(async (event) => {
  authenticatedMiddleware(event);

  const coreClient = await useCoreClient().connect();
  const UserModel = coreClient.getModel<User>('users');
  const guard = useGuard(useAuthorizationHeader(event));
  const user = await UserModel.findOne({
    _id: guard.token.id,
  });

  if (!user) {
    throw new HttpNotFoundError();
  }

  return {
    default: {
      id: user._id,
      email: user.email,
      name: user.name,
      url: user.profilePicture
        ? useMediaService(user.profilePicture).getProfileUrl()
        : null,
    },
  };
});
