import { defineFixture } from '@antify/ant-database';
import { EMPLOYEE_USER_ID } from './users';
import { EMPLOYEE_ROLE_ID } from './roles';
import { extendSchemas } from '../schema.extensions';
import { UserTenantAccess } from '../schemas/userTenantAccess';
import { TEST_TENANT_ID } from './tenants';

export default defineFixture({
  async load(client) {
    extendSchemas(client);

    await client.getModel<UserTenantAccess>('user_tenant_accesses').insertMany([
      {
        user: EMPLOYEE_USER_ID,
        role: EMPLOYEE_ROLE_ID,
        tenant: TEST_TENANT_ID,
        isBanned: false,
        isPending: false,
      },
    ]);

    // TODO:: create banned and pending user tenant access
  },

  dependsOn() {
    return ['tenants', 'users', 'roles'];
  },
});
