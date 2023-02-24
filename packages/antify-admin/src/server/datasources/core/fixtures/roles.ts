import { defineFixture } from '@antify/ant-database';
import { PermissionId } from '../../static/permissions';
import { extendSchemas } from '../schema.extensions';
import { Role } from '../schemas/roles';
import { TEST_TENANT_ID } from './tenants';

export const ADMIN_ROLE_ID = '63f73526b5db16c4a92d6c33';
export const EMPLOYEE_ROLE_ID = '63f73526b5db16c4a92d6c34';

export default defineFixture({
  async load(client) {
    extendSchemas(client);

    await client.getModel<Role>('roles').insertMany([
      {
        _id: ADMIN_ROLE_ID,
        name: 'Admin',
        isAdmin: true,
        tenant: TEST_TENANT_ID,
      },
      {
        _id: EMPLOYEE_ROLE_ID,
        name: 'Employee',
        isAdmin: false,
        permissions: Object.values(PermissionId),
        tenant: TEST_TENANT_ID,
      },
    ]);
  },

  dependsOn() {
    return ['tenants'];
  },
});
