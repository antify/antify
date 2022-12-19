import {
  appInstallPostValidator,
  AppInstallPostInput,
  AppInstallPostResponse,
} from '~~/glue/api/app/install.post';
import { handleCreateToken, hashPassword } from '~~/server/utils/tokenUtil';
import { apiAppInstallService } from './install.service';
import { User } from '~~/server/datasources/core/schemas/user';

export default defineEventHandler<AppInstallPostResponse>(async (event) => {
  const requireInstall = await apiAppInstallService.requireInstall();

  if (!requireInstall) {
    return {
      installNotPossible: {
        errors: ['Install process is already done'],
      },
    };
  }

  const requestData = await readBody<AppInstallPostInput>(event);

  appInstallPostValidator.validate(requestData);

  if (appInstallPostValidator.hasErrors()) {
    return {
      badRequest: {
        errors: appInstallPostValidator.getErrors(),
      },
    };
  }

  const coreClient = await useCoreClient().connect();

  const UserModel = coreClient.getModel<User>('users');
  const password = await hashPassword(requestData.password);

  await new UserModel({
    email: requestData.email,
    name: requestData.name,
    isSuperAdmin: true,
    password,
  }).save();

  const token = await handleCreateToken(event, {
    email: requestData.email,
    password,
  });

  if (!token) {
    throw new Error('Unable to create a token for initial user');
  }

  return {
    default: {
      token,
    },
  };
});
