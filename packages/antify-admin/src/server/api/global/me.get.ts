import { isLoggedInHandler } from '@antify/ant-guard';
import { HttpNotFoundError } from '~~/server/errors';
import { Response } from '~~/glue/api/global/me.get';
import { useMediaService } from '../../service/useMediaService';
import { User } from '~~/server/datasources/core/schemas/user';
import { useCoreClient } from '~~/server/service/useCoreClient';

export default defineEventHandler<Response>(async (event) => {
  const guard = await isLoggedInHandler(event);

  const coreClient = await useCoreClient().connect();
  const UserModel = coreClient.getModel<User>('users');
  const user = await UserModel.findOne({
    _id: guard.userId()
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
        : null
    }
  };
});
