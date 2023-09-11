import { describe, test, expect, spyOn, vi, beforeEach, afterEach } from 'vitest';
import { isAuthorizedHandler, isLoggedInHandler } from '../handlers';
import { expiredToken, validToken } from './testTokens';
import { ServerGuard } from '../useServerGuard';
import { getTenantId } from '@antify/context';

describe('handlers test', async () => {
  let getAuthorizationHeaderSpy: spyOn;
  let getContextSpy: spyOn;
  let getTenantIdSpy: spyOn;

  beforeEach(async () => {
    getAuthorizationHeaderSpy = vi.spyOn(await import('../utils'), 'getAuthorizationHeader');
    getContextSpy = vi.spyOn(await import('@antify/context'), 'getContext');
    getTenantIdSpy = vi.spyOn(await import('@antify/context'), 'getTenantId');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should emit if user is not logged in', async () => {
    getAuthorizationHeaderSpy.mockReturnValue(expiredToken);
    expect.assertions(2);

    try {
      await isLoggedInHandler();
    } catch (e) {
      expect(e.statusCode).toBe(401);
      expect(e.statusMessage).toBe('Unauthorized');
    }
  });

  test('should emit if user is logged in', async () => {
    getAuthorizationHeaderSpy.mockReturnValue(validToken);

    const guard = await isLoggedInHandler();

    expect(guard).toBeInstanceOf(ServerGuard);
    expect(guard.isLoggedIn()).toBeTruthy();
  });

  test('should emit if user is authorized correctly', async () => {
    getAuthorizationHeaderSpy.mockReturnValue(validToken);
    getContextSpy.mockReturnValue({
      id: 'tenant',
      isSingleTenancy: false
    });
    getTenantId.mockReturnValue('one');

    const guard = await isAuthorizedHandler(
      {},
      'CAN_TEST',
      [
        {
          id: 'core',
          isSingleTenancy: true
        },
        {
          id: 'tenant',
          isSingleTenancy: false
        }
      ]
    );

    expect(guard).toBeInstanceOf(ServerGuard);
    expect(guard.isLoggedIn()).toBeTruthy();
  });

  test('should emit if user is not authorized correctly', async () => {
    getAuthorizationHeaderSpy.mockReturnValue(validToken);
    getContextSpy.mockReturnValue({
      id: 'tenant',
      isSingleTenancy: false
    });
    getTenantId.mockReturnValue('notExistingOne');

    expect.assertions(1);

    try {
      await isAuthorizedHandler(
        {},
        'CAN_TEST',
        [
          {
            id: 'core',
            isSingleTenancy: true
          },
          {
            id: 'tenant',
            isSingleTenancy: false
          }
        ]
      );
    } catch (e) {
      expect(e.message).toBe('Forbidden');
    }
  });
});
