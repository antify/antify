import { describe, test, expect, spyOn, vi, beforeEach, afterEach } from 'vitest';
import { useServerGuard } from '../useServerGuard';
import { changedToken, expiredToken, tokenWithoutExp, validToken, wrongSecretToken } from './testTokens';

vi.mock('h3');

describe('useServerGuard test', async () => {
  let getAuthorizationHeaderSpy: spyOn;

  beforeEach(async () => {
    getAuthorizationHeaderSpy = vi.spyOn(await import('../utils'), 'getAuthorizationHeader');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  async function testErrorCaseWithToken(rawToken: string | null, errorCode: string) {
    getAuthorizationHeaderSpy.mockReturnValue(rawToken);
    expect.assertions(1);

    const guard = await useServerGuard();
    try {
      await guard.verify();
    } catch (e) {
      expect(e.code).toBe(errorCode);
    }
  }

  test('should force calling verify first', async () => {
    getAuthorizationHeaderSpy.mockReturnValue(expiredToken);

    const guard = await useServerGuard();
    const expectedErrorMessage = 'In order not to create a security issue, first call the this.verify() function';

    expect(() => guard.isLoggedIn()).toThrowError(expectedErrorMessage);
    expect(() => guard.isSuperAdmin()).toThrowError(expectedErrorMessage);
    expect(() => guard.userId()).toThrowError(expectedErrorMessage);
    expect(() => guard.hasPermissionTo(['FOO'])).toThrowError(expectedErrorMessage);
  });

  test('should validate a valid token correctly', async () => {
    getAuthorizationHeaderSpy.mockReturnValue(validToken);

    const guard = await useServerGuard().verify();

    expect(guard.isLoggedIn()).toBeTruthy();
  });

  test('should validate a token without exp correctly', async () => {
    getAuthorizationHeaderSpy.mockReturnValue(tokenWithoutExp);

    const guard = await useServerGuard().verify();

    expect(guard.isLoggedIn()).toBeTruthy();
  });

  test('should validate an expired token correctly', async () => {
    await testErrorCaseWithToken(expiredToken, 'ERR_JWT_EXPIRED');
  });

  test('should validate an invlaid token correctly', async () => {
    await testErrorCaseWithToken(wrongSecretToken, 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED');
  });

  test('should validate a changed token correctly', async () => {
    await testErrorCaseWithToken(changedToken, 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED');
  });

  test('should validate a empty token correctly', async () => {
    await testErrorCaseWithToken('', 'ERR_JWS_INVALID');
  });

  test('should validate a not existing token correctly', async () => {
    await testErrorCaseWithToken(null, 'ERR_JWS_INVALID');
  });

  test('should create a token correctly', async () => {
    const decodedToken = {
      'id': 'test-id',
      'isSuperAdmin': false,
      'providers': [
        {
          'isAdmin': false,
          'providerId': 'core',
          'tenantId': '',
          'permissions': [
            'CAN_TEST'
          ]
        },
        {
          'isAdmin': false,
          'providerId': 'tenant',
          'tenantId': 'one',
          'permissions': [
            'CAN_TEST'
          ]
        },
        {
          'isAdmin': false,
          'providerId': 'tenant',
          'tenantId': 'two',
          'permissions': [
            'CAN_TEST'
          ]
        }
      ]
    };
    const guard = useServerGuard();

    function testToken(token) {
      expect(token).toHaveProperty('exp');
      expect(token['exp']).toBeGreaterThan(Math.round(new Date().getTime() / 1000));
      expect(token).toHaveProperty('iat');
      expect(token['iat']).toBeLessThanOrEqual(Math.round(new Date().getTime() / 1000));

      delete token['exp'];
      delete token['iat'];

      expect(token).toStrictEqual(decodedToken);
    }

    await guard.loginUser({}, decodedToken);
    testToken(guard.getToken());
  });
});
