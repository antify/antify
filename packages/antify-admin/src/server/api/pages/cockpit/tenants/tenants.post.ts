import { Input, validator } from '~~/glue/api/cockpit/tenants/tenants.post';
import { isSuperAdminMiddleware } from '~~/server/guard/isSuperAdmin.middleware';
import { Tenant } from '~~/server/datasources/core/schemas/tenant';
import { useCoreClient } from '~~/server/service/useCoreClient';
import {
  loadDatabaseConfiguration,
  migrateUpToEnd,
  Migrator,
} from '@antify/ant-database';
import { useTenantClient } from '~~/server/service/useTenantClient';

export default defineEventHandler(async (event) => {
  isSuperAdminMiddleware(event);

  const requestData = await readBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    return {
      badRequest: {
        errors: validator.getErrors(),
      },
    };
  }

  const TenantModel = (await useCoreClient().connect()).getModel<Tenant>(
    'tenants'
  );

  const tenant = new TenantModel({ name: requestData.name });

  await tenant.save();

  const tenantClient = await useTenantClient().connect(tenant.id);
  const configurations = loadDatabaseConfiguration();

  if (configurations['tenant'] === undefined) {
    throw new Error(`Missing required database configuration "tenant"`);
  }

  const results = await migrateUpToEnd(
    new Migrator(tenantClient, configurations['tenant'])
  );

  for (const result of results) {
    if (result.error) {
      throw result.error;
    }
  }

  return {
    default: {
      id: tenant.id,
      name: tenant.name,
    },
  };
});
