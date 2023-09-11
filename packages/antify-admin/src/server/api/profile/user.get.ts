import { useServerGuard } from '@antify/ant-guard';
import { authenticatedMiddleware } from '~~/server/guard/authenticated.middleware';
import { useMediaService } from '../../service/useMediaService';
import { User } from '~~/server/datasources/core/schemas/user';
import { useCoreClient } from '~~/server/service/useCoreClient';

export default defineEventHandler(async (event) => {
  await authenticatedMiddleware(event);

  const guard = await useServerGuard(event);
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
