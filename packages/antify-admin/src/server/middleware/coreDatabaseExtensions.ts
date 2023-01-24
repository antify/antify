import { extendSchemas } from '../datasources/core/schema.extensions';

export default defineEventHandler(async (event) => {
  extendSchemas(useCoreClient());
});
