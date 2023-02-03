import { H3Event, getCookie } from 'h3';
import jwt, { JwtPayload } from 'jsonwebtoken';

export type JsonWebToken = {
  isSuperAdmin: boolean;
  documentStorage: {
    read: string[];
    write: string[];
    delete: string[];
  };
} & JwtPayload;

export const getToken = (event: H3Event): string | null =>
  event.node.req.headers['authorization'] ||
  getCookie(event, useRuntimeConfig().tokenCookieKey) ||
  null;

export const validateAndGetToken = (event: H3Event): JsonWebToken => {
  const rawToken = getToken(event);

  try {
    const payload = jwt.verify(
      rawToken as string,
      useRuntimeConfig().jwtSecret
    ) as JwtPayload;

    return {
      ...{
        isSuperAdmin: false,
        documentStorage: {
          read: [],
          write: [],
          delete: [],
        },
      },
      ...payload,
    };
  } catch (e) {
    // Catch it because a not valid token format throw an error.
    throw createError({
      statusCode: 401,
      statusMessage: `Unauthorized`,
    });
  }
};
