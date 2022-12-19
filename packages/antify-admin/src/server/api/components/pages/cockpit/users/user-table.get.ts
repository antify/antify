import { User } from '~~/server/datasources/core/schemas/user';
import { isSuperAdminMiddleware } from '~~/server/guard/isSuperAdmin.middleware';

export default defineEventHandler(async (event) => {
  isSuperAdminMiddleware(event);

  const UserModel = (await useCoreClient().connect()).getModel<User>('users');

  return (await UserModel.find({})).map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
  }));
});
