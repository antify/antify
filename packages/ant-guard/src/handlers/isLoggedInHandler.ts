import { H3Event, createError } from 'h3';
import { useGuard } from '../useGuard';
import { getAuthorizationHeader } from '../utils/getAuthorizationHeader';

export const isLoggedInHandler = (event: H3Event) => {
  const guard = useGuard(getAuthorizationHeader(event));

  if (!guard.isUserLoggedIn) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Forbidden',
    });
  }
};
