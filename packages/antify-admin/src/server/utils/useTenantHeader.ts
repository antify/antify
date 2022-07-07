import { CompatibilityEvent } from "h3";
import { CURRENT_TENANT_COOKIE_KEY, CURRENT_TENANT_HEADER_KEY } from "~~/composables/useCurrentTenant";

export const useTenantHeader = (event: CompatibilityEvent): string | null =>
    event.req.headers[CURRENT_TENANT_HEADER_KEY] || (useCookie(event, CURRENT_TENANT_COOKIE_KEY) || null);