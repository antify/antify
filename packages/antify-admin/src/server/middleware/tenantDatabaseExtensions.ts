import { extendSchemas } from '../datasources/tenant/schema.extensions';

export default defineEventHandler(async (event) => {
  extendSchemas(useTenantClient());
});
