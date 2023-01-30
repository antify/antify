import { User } from '~~/server/datasources/core/schemas/user';
import { useCoreClient } from '~~/server/service/useCoreClient';

export const apiAppInstallService = {
  requireInstall: async () => {
    const coreClient = await useCoreClient().connect();

    const User = coreClient.getModel<User>('users');

    return (await User.find({})).length <= 0;
  },
};
