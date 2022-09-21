import { PrismaClient } from '../../../node_modules/@internal/prisma/core/index.js';
import { PermissionId } from '../static/permissions';

export async function seedCore() {
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.CORE_DATABASE_URL } },
  });

  await prisma.role.create({
    data: {
      name: 'Administrator',
      isAdmin: true,
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

  console.log('Core seeds sucessfully loaded 🌱🌱🌱');
}
