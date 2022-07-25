import { TOKEN_COOKIE_KEY } from "~~/composables/useGuard";
import { CURRENT_TENANT_COOKIE_KEY, CURRENT_TENANT_HEADER_KEY } from "~~/composables/useCurrentTenant";

export const useDefaultFetchOpts = () => {
    const headers = {
        authorization: useCookie(TOKEN_COOKIE_KEY).value,
        'Cache-Control': 'no-cache'
    };

    headers[CURRENT_TENANT_HEADER_KEY] = useCookie(CURRENT_TENANT_COOKIE_KEY).value

    return {
        headers,
        initialCache: false
    };
}