import { PrismaClient } from '@internal/prisma/tenant';
import { mediaFixtures } from './fixtures/media';

export async function loadTenantFixtures() {
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.TENANT_DATABASE_URL } },
  });

  await prisma.media.create({
    data: mediaFixtures.createOne({
      id: '1039fc07-7bf9-4dd4-b299-26addb875123',
      title: '__test image',
    }),
  });

  await prisma.media.createMany({
    data: mediaFixtures.create(50),
  });

  console.log('Tenant fixtures sucessfully loaded 🐅🐅🐅🐈🐈🐆🐆🐈🐆');
}
