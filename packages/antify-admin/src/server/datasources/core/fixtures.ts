import { PermissionId } from '../static/permissions';
import { extendSchemas } from './schema.extensions';
import { Role } from './schemas/roles';
import {
  SingleConnectionClient,
  truncateAllCollections,
} from '@antify/ant-database';
import { tenantFixtures } from './fixtures/tenant';
import { Tenant } from './schemas/tenant';
import { User } from './schemas/user';
import { userFixtures } from './fixtures/user';
import { hashPassword } from '../../utils/passwordHashUtil';

export async function loadCoreFixtures() {
  require('dotenv').config();

  const coreClient = await SingleConnectionClient.getInstance(
    process.env.CORE_DATABASE_URL as string
  ).connect();

  extendSchemas(coreClient);

  await truncateAllCollections(coreClient.connection);

  const TenantModel = coreClient.getModel<Tenant>('tenants');

  const testTenant = await new TenantModel(
    tenantFixtures.createOne({
      name: 'Test tenant',
    })
  ).save();

  await coreClient.getModel<Role>('roles').insertMany([
    {
      name: 'Admin',
      isAdmin: true,
      tenant: testTenant._id,
    },
    {
      name: 'Employee',
      isAdmin: false,
      permissions: Object.values(PermissionId),
      tenant: testTenant._id,
    },
  ]);

  const UserModel = coreClient.getModel<User>('users');

  const admin = await new UserModel(
    userFixtures.createOne({
      email: 'admin@admin.de',
      password: await hashPassword(
        'admin',
        process.env.PASSWORD_SALT as string
      ),
      name: 'Admin',
      isSuperAdmin: true,
      tenantAccesses: [],
    })
  ).save();

  const employee = await new UserModel(
    userFixtures.createOne({
      email: 'user@user.de',
      password: await hashPassword('user', process.env.PASSWORD_SALT as string),
      isSuperAdmin: false,
      tenantAccesses: [],
    })
  ).save();

  console.log('Core fixtures sucessfully loaded 🐅🐅🐅🐈🐈🐆🐆🐈🐆');
  // console.log('Core seeds sucessfully loaded 🌱🌱🌱');

  return { tenants: [testTenant] };
}
