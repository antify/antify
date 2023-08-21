import { H3Event, createError } from 'h3';
import { getContext, getTenantId, ContextConfiguration } from '@antify/context';
import { isLoggedInHandler } from './isLoggedInHandler';
import { useGuard } from '../useGuard';
import { getAuthorizationHeader } from '../http/getAuthorizationHeader';

export const isAuthorizedHandler = async (
  event: H3Event,
  permissions: string | string[],
  contextConfiguration: ContextConfiguration
) => {
  isLoggedInHandler(event);

  const guard = useGuard(getAuthorizationHeader(event));
  const context = await getContext(event, contextConfiguration);

  if (!Array.isArray(permissions)) {
    permissions = [permissions];
  }

  if (context.isSingleTenancy) {
    // TODO:: Implement auth for single tenancy too
  } else {
    const tenantId = getTenantId(event);

    if (!tenantId) {
      throw createError('Missing required tenantId');
    }

    if (
      !permissions.some((permission) =>
        guard.hasPermissionTo(permission, tenantId)
      )
    ) {
      throw createError('Unauthorized');
    }
  }
};
