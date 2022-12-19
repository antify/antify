import { H3Event } from 'h3';
import { HttpForbiddenError } from '../errors';
import { useAuthorizationHeader } from '../utils/useAuthorizationHeader';
import { useGuard } from '~~/composables/useGuard';
import { tokenValid } from '../utils/tokenUtil';

export const authenticatedMiddleware = (event: H3Event): void => {
  const guard = useGuard(useAuthorizationHeader(event));

  // useGuard only url decode the token. Verify it is valid.
  if (!tokenValid(guard.rawToken) || !guard.isUserLoggedIn) {
    throw new HttpForbiddenError();
  }
};
