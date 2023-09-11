import * as jose from 'jose';
import { JsonWebToken, Guard } from './useGuard';
import { H3Event, setCookie } from 'h3';
import { decodeJwt } from 'jose';
import { signToken } from './utils';
import { getAuthorizationHeader, TOKEN_COOKIE_KEY } from './utils';

export class ServerGuard extends Guard {
  private verified = false;

  constructor(private event: H3Event, token: JsonWebToken | null = null) {
    super(token);
  }

  async loginUser(event: H3Event, payload: JsonWebToken) {
    // TODO:: get secret from somewhere
    // TODO:: get expiration from somewhere
    const token = await signToken(payload, 'secret', '2h');

    setCookie(event, TOKEN_COOKIE_KEY, token);
    this.setToken(decodeJwt(token));

    return token;
  }

  /**
   * Verifies the guard's token.
   *
   * Throw one of following jose errors if something is wrong with the token:
   * https://github.com/panva/jose/tree/main/docs/classes
   */
  async verify() {
    const rawToken = getAuthorizationHeader(this.event);

    if (!rawToken) {
      throw new jose.errors.JWSInvalid();
    }

    // TODO:: get secret from somewhere
    await jose.jwtVerify(rawToken, new TextEncoder().encode('secret'));
    this.verified = true;

    return this;
  }

  isSuperAdmin(): boolean {
    if (!this.verified) {
      throw new CheckVerificationFirstError();
    }

    return super.isSuperAdmin();
  }

  isLoggedIn(): boolean {
    if (!this.verified) {
      throw new CheckVerificationFirstError();
    }

    return super.isLoggedIn();
  }

  userId() {
    if (!this.verified) {
      throw new CheckVerificationFirstError();
    }

    return super.userId();
  }

  hasPermissionTo(permission: string[] | string, providerId: string, tenantId: string | null = null) {
    if (!this.verified) {
      throw new CheckVerificationFirstError();
    }

    return super.hasPermissionTo(permission, providerId, tenantId);
  }
}

export const useServerGuard = (event: H3Event) => {
  const rawToken = getAuthorizationHeader(event);
  // TODO:: catch invalid token format error
  const payload = rawToken ? jose.decodeJwt(rawToken) : null;

  return new ServerGuard(event, payload);
};

class CheckVerificationFirstError extends Error {
  constructor() {
    super('In order not to create a security issue, first call the this.verify() function');
  }
}
