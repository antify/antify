import { JsonWebToken } from './useGuard';
import { SignJWT } from 'jose';
import * as crypto from 'crypto';
import { H3Event, getCookie } from 'h3';
import { parse } from 'cookie-es';

export const TOKEN_COOKIE_KEY = 'antt';
export const JWT_ALGORITHM = 'HS256';

export const hashPassword = async (
  password: string,
  salt: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        return reject(error);
      }

      resolve(derivedKey.toString('hex'));
    });
  });
};

export async function signToken(
  payload: JsonWebToken,
  secret: string,
  expiration: string,
  issuedAt?: number
) {
  return await new SignJWT(payload)
    .setExpirationTime(expiration)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt(issuedAt)
    .sign(new TextEncoder().encode(secret));
}

export function getAuthorizationHeader(event: H3Event | undefined = undefined): string | null {
  if (event) {
    return event.node.req.headers['authorization'] ||
      getCookie(event, TOKEN_COOKIE_KEY) ||
      null;
  }

  if (typeof document !== 'undefined' && document?.cookie) {
    return parse(document.cookie)[TOKEN_COOKIE_KEY] || null;
  }

  return null;
}
