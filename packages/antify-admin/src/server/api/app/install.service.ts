import { useCoreClient } from '~~/server/service/useCoreClient';
import { doesDatabaseExist } from '@antify/ant-database';

export const apiAppInstallService = {
  requireInstall: async () => {
    const coreClient = await useCoreClient().connect();

    return !await doesDatabaseExist(coreClient.getConnection(), coreClient.getConnection().name);
  },
};
