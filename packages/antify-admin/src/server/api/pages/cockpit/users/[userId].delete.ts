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

  await UserModel.remove({
    _id: event.context.params.userId,
  });

  return {};
});
