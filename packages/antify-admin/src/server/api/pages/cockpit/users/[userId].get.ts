import { User } from '~~/server/datasources/core/schemas/user';
import { isSuperAdminMiddleware } from '~~/server/guard/isSuperAdmin.middleware';
import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
  isSuperAdminMiddleware(event);

  if (!mongoose.isValidObjectId(event.context.params.userId)) {
    return {
      notFound: {
        message: 'Not Found',
      },
    };
  }

  const UserModel = (await useCoreClient().connect()).getModel<User>('users');

  const user = await UserModel.findById(event.context.params.userId);

  if (!user) {
    return {
      notFound: {
        message: 'Not Found',
      },
    };
  }

  return {
    default: {
      id: user.id,
      name: user.name,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
      isBanned: user.isBanned,
    },
  };
});
