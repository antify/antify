import {
  SingleConnectionClient,
  loadDatabaseConfiguration,
} from '@antify/ant-database';

export const useCoreClient = () => {
  // TODO:: load configuration once only
  return SingleConnectionClient.getInstance(
    loadDatabaseConfiguration()['core']
  );
};
