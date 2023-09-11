import { H3Event, createError } from 'h3';
import { ServerGuard, useServerGuard } from './useServerGuard';
import { ContextConfiguration, getContext, getTenantId } from '@antify/context';
import * as jose from 'jose';

export const isLoggedInHandler = async (event: H3Event) => {
  let guard: ServerGuard;

  try {
    guard = await useServerGuard(event).verify();
  } catch (e) {
    if (!(e instanceof jose.errors.JOSEError)) {
      throw e;
    }

    // TODO:: log into security log
    console.log(e.code);

    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    });
  }

  return guard;
};

export const isAuthorizedHandler = async (
  event: H3Event,
  permissions: string | string[],
  contextConfiguration: ContextConfiguration
) => {
  const guard = await isLoggedInHandler(event);
  const context = getContext(event, contextConfiguration);

  if (!guard.hasPermissionTo(permissions, context.id, getTenantId(event))) {
    throw new Error('Forbidden');
  }

  return guard;
};
