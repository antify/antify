import { extendSchemas } from '../datasources/core/schema.extensions';
import { useCoreClient } from '../service/useCoreClient';

export default defineEventHandler(async (event) => {
  extendSchemas(useCoreClient());
});
