import { CompatibilityEvent } from 'h3';
import { HttpForbiddenError } from '../errors';
import { useAuthorizationHeader } from '../utils/useAuthorizationHeader';
import { useGuard } from '~~/composables/useGuard';
import { authenticatedMiddleware } from './authenticated.middleware';

export const isSuperAdminMiddleware = (event: CompatibilityEvent): void => {
  authenticatedMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.isSuperAdmin) {
    throw new HttpForbiddenError();
  }
};
