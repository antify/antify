import { H3Event, getCookie } from 'h3';

export const TENANT_KEY = 'anttid';

export const getTenantId = (event: H3Event): string | null =>
  (event.node.req.headers[TENANT_KEY] as string) ||
  getCookie(event, TENANT_KEY) ||
  null;

export const useTenantHeader = (tenantId?: string | null) =>
  tenantId
    ? {
        [TENANT_KEY]: tenantId,
      }
    : {};
