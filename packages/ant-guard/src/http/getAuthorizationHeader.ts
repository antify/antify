import { H3Event, getCookie } from 'h3';
import { TOKEN_COOKIE_KEY } from '../useGuard';

export const getAuthorizationHeader = (event: H3Event): string | null =>
  event.node.req.headers['authorization'] ||
  getCookie(event, TOKEN_COOKIE_KEY) ||
  null;
