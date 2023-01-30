import {
  MultiConnectionClient,
  loadDatabaseConfiguration,
} from '@antify/ant-database';

export const useTenantClient = () => {
  return MultiConnectionClient.getInstance(
    loadDatabaseConfiguration()['tenant']
  );
};
