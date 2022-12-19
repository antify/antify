import { H3Event, getCookie } from 'h3';
import {
  CURRENT_TENANT_COOKIE_KEY,
  CURRENT_TENANT_HEADER_KEY,
} from '~~/composables/useCurrentTenant';

export const useTenantHeader = (event: H3Event): string | null =>
  event.req.headers[CURRENT_TENANT_HEADER_KEY] ||
  getCookie(event, CURRENT_TENANT_COOKIE_KEY) ||
  null;
