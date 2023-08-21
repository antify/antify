import { describe, test, expect, beforeAll } from 'vitest';
import { useGuard } from '../useGuard';

describe('useGuard test', async () => {
  // Info: for all token is "secret" used as secret.
  const tokenWithoutExp =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTYyMzkwMjJ9.ygbbkdw2ZRJSTyNSL5o8fKNLngAIQTkGsDCM8g6sGrg';
  const expieredToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjIzOTAyM30.vK2qplADijF9w834FC2oA4f-fXfrFnSdPeDST8-1nGE';
  const validToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MzUxNjIzOTAyMywiaXNTdXBlckFkbWluIjpmYWxzZSwidGVuYW50c0FjY2VzcyI6W3sidGVuYW50SWQiOiIwODE1IiwiaXNBZG1pbiI6ZmFsc2UsInBlcm1pc3Npb25zIjpbIkNBTl9URVNUIl19XSwicGVybWlzc2lvbnMiOlsiQ0FOX1RFU1QiXX0.qnETi24Nv3F4CngfffzmEhJDZxO90zzr5UFAXjJHoX8';
  const wrongSecretToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MzUxNjIzOTAyM30.-1-pNZDfn00yEBFQ0Xn7E54meO5aVTad0j3c8HLlACA';
  const superAdminToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MzUxNjIzOTAyMywiaXNTdXBlckFkbWluIjp0cnVlLCJ0ZW5hbnRzQWNjZXNzIjpbXSwicGVybWlzc2lvbnMiOlsiQ0FOX1RFU1QiXX0.uRvfGB6Vkj-p3xAFINWIaGlrVYDnSwuU3NVCRFB640E';

  test('should validate a token without exp correctly', async () => {
    const guard = useGuard(tokenWithoutExp);

    expect(guard.isUserLoggedIn).toBeTruthy();
  });

  test('should validate an expiered token correctly', async () => {
    const guard = useGuard(expieredToken);

    expect(guard.isUserLoggedIn).toBeFalsy();
  });

  test('should validate a valid token correctly', async () => {
    const guard = useGuard(validToken);

    expect(guard.isUserLoggedIn).toBeTruthy();
    expect(guard.isSuperAdmin).toBeFalsy();
    expect(guard.hasPermissionTo('CAN_TEST', '0815')).toBeTruthy();
    expect(guard.hasPermissionTo(['CAN_TEST'], '0815')).toBeTruthy();
    expect(guard.hasPermissionTo(['CAN_NOT_TEST'], '0815')).toBeFalsy();
  });

  test('should validate an invlaid token correctly', async () => {
    const guard = useGuard(wrongSecretToken);

    expect(guard.isUserLoggedIn).toBeFalsy();
  });

  test('should give access to a super admin', async () => {
    const guard = useGuard(superAdminToken);

    expect(guard.isUserLoggedIn).toBeTruthy();
    expect(guard.isSuperAdmin).toBeTruthy();
    expect(guard.hasPermissionTo('CAN_TEST', '0815')).toBeTruthy();
    expect(guard.hasPermissionTo(['CAN_TEST'], '0815')).toBeTruthy();
    expect(guard.hasPermissionTo(['CAN_NOT_TEST'], '0815')).toBeTruthy();
  });
});
