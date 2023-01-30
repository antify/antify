import { extendSchemas } from '../datasources/tenant/schema.extensions';
import { useTenantClient } from '../service/useTenantClient';

export default defineEventHandler(async (event) => {
  extendSchemas(useTenantClient());
});
