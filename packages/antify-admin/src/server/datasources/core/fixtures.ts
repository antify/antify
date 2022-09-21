import { PrismaClient } from '@internal/prisma/core';
import { tenantFixtures } from './fixtures/tenant';
import { userFixtures } from './fixtures/user';

export async function loadCoreFixtures() {
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.CORE_DATABASE_URL } },
  });

  const tenantId = '1039fc07-7be9-4dd4-b299-26addb875111';
  await prisma.tenant.create({
    data: tenantFixtures.createOne({
      id: tenantId,
      name: 'Demo Mandant',
    }),
  });

  const userId = '1039fc07-7be9-4dd4-b299-26addb875771';
  await prisma.user.create({
    data: userFixtures.createOne({
      id: userId,
      name: 'Demo Benutzer',
      // Password is: admin
      password:
        '3ba0469d6c4724298538beb08d2e3f5120df0f7670c2a4ff2874cf55fbda5f634661a0ca6a0d17cafc3e05fbe9d8ad868c32c2438bd2ba653c467ba55e4695a1',
      email: 'admin@admin.de',
      isSuperAdmin: true,
    }),
  });

  const adminRole = await prisma.role.findFirst({
    select: {
      id: true,
    },
    where: {
      isAdmin: true,
    },
  });

  await prisma.userTenantAccess.create({
    data: {
      tenantId: tenantId,
      userId: userId,
      roleId: adminRole.id,
    },
  });

  // await Promise.all(userFixtures.create(50).map(async (data) => await prisma.user.create({ data })));
  await Promise.all(
    tenantFixtures
      .create(50)
      .map(async (data) => await prisma.tenant.create({ data }))
  );

  console.log('Core fixtures sucessfully loaded 🐅🐅🐅🐈🐈🐆🐆🐈🐆');
}
