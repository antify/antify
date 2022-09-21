import { PrismaClient as CoreClient } from '../../node_modules/@internal/prisma/core/index.js';
import { PrismaClient as TenantClient } from '../../node_modules/@internal/prisma/tenant/index.js';
import { seedCore } from './core/seed';
import { seedTenant } from './tenant/seed';

const coreClient = new CoreClient();
const tenantClient = new TenantClient();

seedCore()
  .then(async () => {
    await coreClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await coreClient.$disconnect();
    process.exit(1);
  });

seedTenant()
  .then(async () => {
    await tenantClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await tenantClient.$disconnect();
    process.exit(1);
  });
