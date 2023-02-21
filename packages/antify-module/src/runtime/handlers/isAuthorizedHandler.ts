import { H3Event, createError } from 'h3';
import { useGuard, getAuthorizationHeader } from '@antify/ant-guard';
import { getContext, getTenantId } from '@antify/context';
import { isLoggedInHandler } from './isLoggedInHandler';

export const isAuthorizedHandler = async (
  event: H3Event,
  permissions: string | string[]
) => {
  isLoggedInHandler(event);

  const guard = useGuard(getAuthorizationHeader(event));
  const context = await getContext(event, useRuntimeConfig().antify.context);

  if (!Array.isArray(permissions)) {
    permissions = [permissions];
  }

  // @ts-ignore
  if (context.isMultiTenantcy) {
    const tenantId = getTenantId(event);

    if (!tenantId) {
      throw Error('Missing required tenantId');
    }

    if (
      !permissions.some((permission) =>
        guard.hasPermissionTo(permission, tenantId)
      )
    ) {
      throw createError({ statusCode: 403, statusMessage: 'Unauthorized' });
    }
  } else {
    // TODO:: Implement auth for single tenancy too
  }
};
