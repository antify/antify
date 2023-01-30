import {
  MultiConnectionClient,
  truncateAllCollections,
} from '@antify/ant-database';
import { extendSchemas } from './schema.extensions';

export async function loadTenantFixtures(tenantId: string) {
  require('dotenv').config();

  const tenantClient = await MultiConnectionClient.getInstance(
    process.env.TENANT_DATABASE_URL as string
  ).connect('1');

  extendSchemas(tenantClient);

  await truncateAllCollections(tenantClient.connection);

  console.log('Tenant fixtures sucessfully loaded 🐅🐅🐅🐈🐈🐆🐆🐈🐆');
}
