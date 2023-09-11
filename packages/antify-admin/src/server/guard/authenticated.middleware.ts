import { H3Event } from 'h3';
import { HttpForbiddenError } from '../errors';
import { useServerGuard } from '@antify/ant-guard';
import { tokenValid } from '../utils/tokenUtil';

export const authenticatedMiddleware = async (event: H3Event): void => {
  const guard = await useServerGuard(event);

  // useGuard only url decode the token. Verify it is valid.
  if (!await tokenValid(guard.rawToken) || !guard.isUserLoggedIn) {
    throw new HttpForbiddenError();
  }
};
