import { type JWTPayload } from 'jose';
import * as jose from 'jose';
import { getAuthorizationHeader, TOKEN_COOKIE_KEY } from './utils';
import { H3Event } from 'h3';
import { serialize } from 'cookie-es';

export type JsonWebToken = {
  id?: string,
  isSuperAdmin?: boolean;
  providers?: JsonWebTokenProvider[];
} & JWTPayload;
export type JsonWebTokenProvider = {
  providerId: string;
  tenantId: string | null;
  isAdmin: boolean;
  permissions: string[];
}
export class Guard {
  constructor(private token: JsonWebToken | null = null) {
  }

  setToken(token: JsonWebToken | null) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  userId() {
    return this.token?.id;
  }

  isLoggedIn(): boolean {
    return this.token !== null;
  }

  isSuperAdmin(): boolean {
    return this.token?.isSuperAdmin || false;
  }

  hasPermissionTo(permission: string[] | string, providerId: string, tenantId: string | null = null) {
    if (this.token?.isSuperAdmin) {
      return true;
    }

    const provider = (this.token?.providers || [])
      .find((provider) => tenantId ?
        tenantId === provider.tenantId && provider.providerId === providerId :
        provider.providerId === providerId);

    if (!provider) {
      return false;
    }

    if (provider.isAdmin) {
      return true;
    }

    if (Array.isArray(permission)) {
      return (provider.permissions || []).some((permissionItem) =>
        permission.some(
          (permissionToFind) => permissionToFind === permissionItem
        )
      );
    }

    return (provider.permissions || []).some(
      (permissionItem) => permissionItem === permission
    );
  }

  logoutUser() {
    if (typeof document !== 'undefined' && document?.cookie) {
      document.cookie = serialize(TOKEN_COOKIE_KEY, '', {
        expires: new Date()
      });

      this.token = null;
    }
  }

  reset() {
    const rawToken = getAuthorizationHeader();

    this.token = rawToken ? jose.decodeJwt(rawToken) : null;
  }
}

export const useGuard = (event: H3Event | undefined) => {
  const rawToken = getAuthorizationHeader(event);
  // TODO:: catch invalid token format error
  const payload = rawToken ? jose.decodeJwt(rawToken) : null;

  return new Guard(payload);
};
