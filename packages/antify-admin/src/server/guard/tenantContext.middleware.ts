import { H3Event } from 'h3';
import { HttpBadRequestError } from '~~/server/errors';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import { authenticatedMiddleware } from './authenticated.middleware';

export const tenantContextMiddleware = async (event: H3Event): string => {
  await authenticatedMiddleware(event);

  const tenantId = useTenantHeader(event);

  if (!tenantId) {
    throw new HttpBadRequestError();
  }

  return tenantId;
};
