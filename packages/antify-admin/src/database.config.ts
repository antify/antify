import { defineDatabaseConfig } from '@antify/ant-database';
import { Tenant } from './server/datasources/core/schemas/tenant';
import { useCoreClient } from './server/service/useCoreClient';

export default defineDatabaseConfig({
  core: {
    databaseUrl: process.env.CORE_DATABASE_URL as string,
    isSingleConnection: true,
    migrationDir: './migrations-core',
  },
  tenant: {
    databaseUrl: process.env.TENANT_DATABASE_URL as string,
    isSingleConnection: false,
    migrationDir: './migrations-tenant',
    fetchTenants: async () => {
      return (await useCoreClient().connect())
        .getModel<Tenant>('tenants')
        .find({});
    },
  },
});
