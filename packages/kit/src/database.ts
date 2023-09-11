import { H3Event } from 'h3';
import { getContext, getTenantId, ContextConfiguration } from '@antify/context';
import {
  getDatabaseClient,
  SingleConnectionClient,
  MultiConnectionClient,
  Client,
} from '@antify/ant-database';

export const getDatabaseClientFromRequest = async (
  event: H3Event,
  contextConfiguration: ContextConfiguration,
  // TODO:: find a propper way to extend schemas. Global registry etc?
  extendSchemaCb?: (client: Client) => void
) => {
  const context = getContext(event, contextConfiguration);
  const client = getDatabaseClient(context.id);

  if (context.isSingleTenancy) {
    await (client as SingleConnectionClient).connect();
  } else {
    const tenantId = getTenantId(event);

    if (!tenantId) {
      throw Error(
        `Context error: Missing required tenantId for multi tenancy context`
      );
    }

    await (client as MultiConnectionClient).connect(tenantId);
  }

  if (extendSchemaCb) {
    extendSchemaCb(client);
  }

  return client;
};
