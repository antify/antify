import { defineFixture } from '@antify/ant-database';
import { tenantFixtures } from '../fixture-utils/tenant';
import { extendSchemas } from '../schema.extensions';
import { Tenant } from '../schemas/tenant';

export const TEST_TENANT_ID = '63e398316c6c22a1f5479ab6';

export default defineFixture({
  async load(client) {
    extendSchemas(client);

    client.getModel<Tenant>('tenants').insertMany([
      tenantFixtures.createOne({
        _id: TEST_TENANT_ID,
        name: 'Test tenant',
      }),
    ]);
  },

  dependsOn() {
    return [];
  },
});
