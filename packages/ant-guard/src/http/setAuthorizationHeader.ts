import { H3Event, setCookie } from 'h3';
import { TOKEN_COOKIE_KEY } from '../useGuard';

export const setAuthorizationHeader = (event: H3Event, rawToken: string) =>
  setCookie(event, TOKEN_COOKIE_KEY, rawToken);
