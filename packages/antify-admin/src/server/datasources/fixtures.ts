import { PrismaClient as CoreClient } from '../../node_modules/@internal/prisma/core/index.js';
import { PrismaClient as TenantClient } from '../../node_modules/@internal/prisma/tenant/index.js';
import { loadCoreFixtures } from './core/fixtures';
import { loadTenantFixtures } from './tenant/fixtures';

const coreClient = new CoreClient();
const tenantClient = new TenantClient();

loadCoreFixtures()
  .then(async () => {
    await coreClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await coreClient.$disconnect();
    process.exit(1);
  });

loadTenantFixtures()
  .then(async () => {
    await tenantClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await tenantClient.$disconnect();
    process.exit(1);
  });
