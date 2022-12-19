// import { PermissionId } from '../static/permissions';
import { Role } from '../datasources/core/schemas/user';
// TODO:: import correctly
import { useCoreClient } from '~~/../../ant-database/src/runtime/server/useCoreClient';

export async function seedCore() {
  const coreClient = await useCoreClient().connect();
  const RoleModel = coreClient.getModel<Role>('roles');

  await RoleModel.insertMany([
    {
      name: 'Administrator',
      isAdmin: true,
    },
    {
      name: 'Mitarbeiter',
      isAdmin: false,
      // permissions: {
      //   create: Object.values(PermissionId).map((id) => ({
      //     permissionId: id,
      //   })),
      // },
    },
  ]);

  console.log('Core seeds sucessfully loaded 🌱🌱🌱');
}
