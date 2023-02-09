import { defineDatabaseConfig } from '@antify/ant-database';
import { extendSchemas } from './server/datasources/core/schema.extensions';
import { Tenant } from './server/datasources/core/schemas/tenant';
import { useCoreClient } from './server/service/useCoreClient';

export default defineDatabaseConfig({
  core: {
    databaseUrl: process.env.CORE_DATABASE_URL as string,
    isSingleConnection: true,
    migrationDir: './server/datasources/core/migrations',
    fixturesDir: './server/datasources/core/fixtures',
  },
  tenant: {
    databaseUrl: process.env.TENANT_DATABASE_URL as string,
    isSingleConnection: false,
    migrationDir: './server/datasources/tenant/migrations',
    fixturesDir: './server/datasources/tenant/fixtures',
    fetchTenants: async () => {
      const client = useCoreClient();

      extendSchemas(client);

      return (await client.connect()).getModel<Tenant>('tenants').find({});
    },
  },
});
