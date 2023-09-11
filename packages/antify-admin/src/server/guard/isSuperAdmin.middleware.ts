import { CompatibilityEvent } from 'h3';
import { HttpForbiddenError } from '../errors';
import { useServerGuard } from '@antify/ant-guard';
import { authenticatedMiddleware } from './authenticated.middleware';

export const isSuperAdminMiddleware = async (event: CompatibilityEvent): void => {
  await authenticatedMiddleware(event);

  const guard = await useServerGuard(event);

  if (!guard.isSuperAdmin) {
    throw new HttpForbiddenError();
  }
};
