import { MultiConnectionClient } from '@antify/ant-database';

export const useCoreClient = () => {
  return MultiConnectionClient.getInstance(
    useRuntimeConfig().antDatabase.coreMongoUrl
  );
};
