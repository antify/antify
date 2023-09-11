/**
 * @vitest-environment jsdom
 */

import { describe, test, expect, spyOn, beforeEach, vi, afterEach } from 'vitest';
import { useGuard } from '../useGuard';

describe('useGuard test', async () => {
  let getAuthorizationHeaderSpy: spyOn;
  const superAdminToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6InRlc3QtaWQiLCJpc1N1cGVyQWRtaW4iOnRydWUsInByb3ZpZGVycyI6W3sicHJvdmlkZXJJZCI6ImNvcmUiLCJ0ZW5hbnRJZCI6IiIsInBlcm1pc3Npb25zIjpbIkNBTl9URVNUIl19LHsicHJvdmlkZXJJZCI6InRlbmFudCIsInRlbmFudElkIjoib25lIiwicGVybWlzc2lvbnMiOlsiQ0FOX1RFU1QiXX0seyJwcm92aWRlcklkIjoidGVuYW50IiwidGVuYW50SWQiOiJ0d28iLCJwZXJtaXNzaW9ucyI6WyJDQU5fVEVTVCJdfV0sImV4cCI6MzI1MjQzNzAyNDgsImlhdCI6MTY5MzIxNDI0OH0.pIW16YZ_2047GCb79I5LutThaSxodMaQBS1JyieVhDs';
  const adminToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6InRlc3QtaWQiLCJpc1N1cGVyQWRtaW4iOmZhbHNlLCJwcm92aWRlcnMiOlt7ImlzQWRtaW4iOnRydWUsInByb3ZpZGVySWQiOiJjb3JlIiwidGVuYW50SWQiOiIiLCJwZXJtaXNzaW9ucyI6WyJDQU5fVEVTVCJdfSx7ImlzQWRtaW4iOnRydWUsInByb3ZpZGVySWQiOiJ0ZW5hbnQiLCJ0ZW5hbnRJZCI6Im9uZSIsInBlcm1pc3Npb25zIjpbIkNBTl9URVNUIl19LHsiaXNBZG1pbiI6dHJ1ZSwicHJvdmlkZXJJZCI6InRlbmFudCIsInRlbmFudElkIjoidHdvIiwicGVybWlzc2lvbnMiOlsiQ0FOX1RFU1QiXX1dLCJleHAiOjMyNTI0MzcwMjQ4LCJpYXQiOjE2OTMyMTQyNDh9.YZbZFFJoYkEJjJr8n3s_dWvdQXrgmgneONmboDoxFi0';
  const normalToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6InRlc3QtaWQiLCJpc1N1cGVyQWRtaW4iOmZhbHNlLCJwcm92aWRlcnMiOlt7ImlzQWRtaW4iOmZhbHNlLCJwcm92aWRlcklkIjoiY29yZSIsInRlbmFudElkIjoiIiwicGVybWlzc2lvbnMiOlsiQ0FOX1RFU1QiXX0seyJpc0FkbWluIjpmYWxzZSwicHJvdmlkZXJJZCI6InRlbmFudCIsInRlbmFudElkIjoib25lIiwicGVybWlzc2lvbnMiOlsiQ0FOX1RFU1QiXX0seyJpc0FkbWluIjpmYWxzZSwicHJvdmlkZXJJZCI6InRlbmFudCIsInRlbmFudElkIjoidHdvIiwicGVybWlzc2lvbnMiOlsiQ0FOX1RFU1QiXX1dLCJleHAiOjMyNTI0MzcwMjQ4LCJpYXQiOjE2OTMyMTQyNDh9.dP25wYfoXMbbmiuVARBsTME9ExN7wIlyckcGF7cJvVA';
  vi.mock('../utils');

  beforeEach(async () => {
    getAuthorizationHeaderSpy = vi.spyOn(await import('../utils'), 'getAuthorizationHeader');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should give access to a super admin to a single connection', async () => {
    getAuthorizationHeaderSpy.mockReturnValue(superAdminToken);

    const guard = useGuard();

    expect(guard.isLoggedIn()).toBeTruthy();
    expect(guard.isSuperAdmin()).toBeTruthy();
    expect(guard.hasPermissionTo('CAN_TEST', 'core')).toBeTruthy();
    expect(guard.hasPermissionTo(['CAN_TEST'], 'core')).toBeTruthy();
    expect(guard.hasPermissionTo('CAN_NOT_TEST', 'tenant', 'one')).toBeTruthy();
    expect(guard.hasPermissionTo(['CAN_NOT_TEST'], 'core')).toBeTruthy();
  });

  test('should give access to a super admin to a multi connection', async () => {
    getAuthorizationHeaderSpy.mockReturnValue(superAdminToken);

    const guard = useGuard();

    expect(guard.isLoggedIn()).toBeTruthy();
    expect(guard.isSuperAdmin()).toBeTruthy();
    expect(guard.hasPermissionTo('CAN_TEST', 'tenant', 'one')).toBeTruthy();
    expect(guard.hasPermissionTo(['CAN_TEST'], 'tenant', 'one')).toBeTruthy();
    expect(guard.hasPermissionTo('CAN_NOT_TEST', 'tenant', 'one')).toBeTruthy();
    expect(guard.hasPermissionTo(['CAN_NOT_TEST'], 'tenant', 'one')).toBeTruthy();
  });

  test('should give access to an admin to a single connection', async () => {
    getAuthorizationHeaderSpy.mockReturnValue(adminToken);

    const guard = useGuard();

    expect(guard.isLoggedIn()).toBeTruthy();
    expect(guard.isSuperAdmin()).toBeFalsy();
    expect(guard.hasPermissionTo('CAN_TEST', 'core')).toBeTruthy();
    expect(guard.hasPermissionTo(['CAN_TEST'], 'core')).toBeTruthy();
    expect(guard.hasPermissionTo('CAN_NOT_TEST', 'core')).toBeTruthy();
    expect(guard.hasPermissionTo(['CAN_NOT_TEST'], 'core')).toBeTruthy();
  });

  test('should give access to an admin to a multi connection', async () => {
    getAuthorizationHeaderSpy.mockReturnValue(adminToken);

    const guard = useGuard();

    expect(guard.isLoggedIn()).toBeTruthy();
    expect(guard.isSuperAdmin()).toBeFalsy();
    expect(guard.hasPermissionTo('CAN_TEST', 'tenant', 'one')).toBeTruthy();
    expect(guard.hasPermissionTo(['CAN_TEST'], 'tenant', 'one')).toBeTruthy();
    expect(guard.hasPermissionTo('CAN_NOT_TEST', 'tenant', 'one')).toBeTruthy();
    expect(guard.hasPermissionTo(['CAN_NOT_TEST'], 'tenant', 'one')).toBeTruthy();
  });

  test('should give access to a normal user to a single connection', async () => {
    getAuthorizationHeaderSpy.mockReturnValue(normalToken);

    const guard = useGuard();

    expect(guard.isLoggedIn()).toBeTruthy();
    expect(guard.isSuperAdmin()).toBeFalsy();
    expect(guard.hasPermissionTo('CAN_TEST', 'core')).toBeTruthy();
    expect(guard.hasPermissionTo(['CAN_TEST'], 'core')).toBeTruthy();
    expect(guard.hasPermissionTo('CAN_NOT_TEST', 'core')).toBeFalsy();
    expect(guard.hasPermissionTo(['CAN_NOT_TEST'], 'core')).toBeFalsy();
  });

  test('should give access to a normal user to a multi connection', async () => {
    getAuthorizationHeaderSpy.mockReturnValue(normalToken);

    const guard = useGuard();

    expect(guard.isLoggedIn()).toBeTruthy();
    expect(guard.isSuperAdmin()).toBeFalsy();
    expect(guard.hasPermissionTo('CAN_TEST', 'tenant', 'one')).toBeTruthy();
    expect(guard.hasPermissionTo(['CAN_TEST'], 'tenant', 'one')).toBeTruthy();
    expect(guard.hasPermissionTo('CAN_NOT_TEST', 'tenant', 'one')).toBeFalsy();
    expect(guard.hasPermissionTo(['CAN_NOT_TEST'], 'tenant', 'one')).toBeFalsy();
  });

  test('should not give access to a normal user to a multi connection with a tenant which does not exists', async () => {
    getAuthorizationHeaderSpy.mockReturnValue(normalToken);

    const guard = useGuard();

    expect(guard.hasPermissionTo('CAN_TEST', 'tenant', 'notExistingOne')).toBeFalsy();
  });

  test('should not give access to a normal user to a connection which does not exists', async () => {
    getAuthorizationHeaderSpy.mockReturnValue(normalToken);

    const guard = useGuard();

    expect(guard.hasPermissionTo('CAN_TEST', 'notExistingOne')).toBeFalsy();
  });
});
