import { H3Event } from 'h3';
import { HttpBadRequestError } from '~~/server/errors';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import { authenticatedMiddleware } from './authenticated.middleware';

export const tenantContextMiddleware = (event: H3Event): string => {
  authenticatedMiddleware(event);

  const tenantId = useTenantHeader(event);

  if (!tenantId) {
    throw new HttpBadRequestError();
  }

  return tenantId;
};
