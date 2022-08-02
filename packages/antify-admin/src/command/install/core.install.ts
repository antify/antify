(async () => {
  const {
    PrismaClient,
  } = require('../../node_modules/@internal/prisma/core/index.js');
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.CORE_DATABASE_URL } },
  });

  console.log('Install required data');

  // TODO:: import and use from /server/datasources/static
  enum PermissionId {
    CAN_CREATE_USER = 'CAN_CREATE_USER',
    CAN_READ_USER = 'CAN_READ_USER',
    CAN_UPDATE_USER = 'CAN_UPDATE_USER',
    CAN_DELETE_USER = 'CAN_DELETE_USER',
    CAN_UPDATE_SELF = 'CAN_UPDATE_SELF',
  }

  await prisma.role.create({
    data: {
      name: 'Administrator',
      isAdmin: true,
      // permissions: {
      //     create: Object.values(PermissionId).map((id) => ({
      //         permissionId: id
      //     }))
      // }
    },
  });

  await prisma.role.create({
    data: {
      name: 'Mitarbeiter',
      isAdmin: false,
      permissions: {
        create: Object.values(PermissionId).map((id) => ({
          permissionId: id,
        })),
      },
    },
  });

  console.log('Everything ready to go 🚀🚀🚀');
})();
