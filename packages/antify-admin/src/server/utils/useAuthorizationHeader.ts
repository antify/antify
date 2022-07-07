import { CompatibilityEvent, useCookie } from "h3";
import { TOKEN_COOKIE_KEY } from "~~/composables/useGuard";

export const useAuthorizationHeader = (event: CompatibilityEvent): string | null =>
    event.req.headers['authorization'] || (useCookie(event, TOKEN_COOKIE_KEY) || null);