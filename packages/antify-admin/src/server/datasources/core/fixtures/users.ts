import { defineFixture } from '@antify/ant-database';
import { hashPassword } from '@antify/ant-guard';
import { PermissionId } from '../../static/permissions';
import { extendSchemas } from '../schema.extensions';
import { Role } from '../schemas/roles';
import { User } from '../schemas/user';
import { userFixtures } from '../fixture-utils/user';
import { TEST_TENANT_ID } from './tenants';

export default defineFixture({
  async load(client) {
    extendSchemas(client);

    client.getModel<Role>('roles').insertMany([
      {
        name: 'Admin',
        isAdmin: true,
        tenant: TEST_TENANT_ID,
      },
      {
        name: 'Employee',
        isAdmin: false,
        permissions: Object.values(PermissionId),
        tenant: TEST_TENANT_ID,
      },
    ]);

    client.getModel<User>('users').insertMany([
      userFixtures.createOne({
        email: 'admin@admin.de',
        password: await hashPassword(
          'admin',
          process.env.PASSWORD_SALT as string
        ),
        name: 'Admin',
        isSuperAdmin: true,
        tenantAccesses: [],
      }),
      userFixtures.createOne({
        email: 'user@user.de',
        password: await hashPassword(
          'user',
          process.env.PASSWORD_SALT as string
        ),
        isSuperAdmin: false,
        tenantAccesses: [],
      }),
    ]);
  },

  dependsOn() {
    return ['tenants'];
  },
});
