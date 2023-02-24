import { defineFixture } from '@antify/ant-database';
import { hashPassword } from '@antify/ant-guard';
import { extendSchemas } from '../schema.extensions';
import { User } from '../schemas/user';
import { userFixtures } from '../fixture-utils/user';

export const ADMIN_USER_ID = '63f73526b5db16c4a92d6c37';
export const EMPLOYEE_USER_ID = '63f73526b5db16c4a92d6c38';

export default defineFixture({
  async load(client) {
    extendSchemas(client);

    await client.getModel<User>('users').insertMany([
      userFixtures.createOne({
        _id: ADMIN_USER_ID,
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
        _id: EMPLOYEE_USER_ID,
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
    return [];
  },
});
