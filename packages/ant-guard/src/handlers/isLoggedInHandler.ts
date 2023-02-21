import { H3Event, createError } from 'h3';
import { getAuthorizationHeader } from '../http/getAuthorizationHeader';
import { useGuard } from '../useGuard';

export const isLoggedInHandler = (event: H3Event) => {
  const guard = useGuard(getAuthorizationHeader(event));

  if (!guard.isUserLoggedIn) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Forbidden',
    });
  }
};
