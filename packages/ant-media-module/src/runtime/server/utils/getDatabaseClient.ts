import { H3Event, getQuery } from 'h3';
import { extendSchemas } from '../datasources/schema.extensions';
import { useTenantHeader } from '../service/useTenantHeader';
import { getDatabaseClient } from '@antify/ant-database';

export const getDatabaseClientFromRequest = async (event: H3Event) => {
  const query = getQuery(event);
  const provider = useRuntimeConfig().antMedia.providers[query['provider']];

  if (!provider) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid provider`,
    });
  }

  const client = await getDatabaseClient(provider.databaseName).connect(
    useTenantHeader(event)
  );

  extendSchemas(client);

  return client;
};
