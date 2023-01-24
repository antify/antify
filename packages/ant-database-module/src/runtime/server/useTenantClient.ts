import { SingleConnectionClient } from '@antify/ant-database';

export const useTenantClient = () => {
  return SingleConnectionClient.getInstance(
    useRuntimeConfig().antDatabase.tenantMongoUrl
  );
};
