import { H3Event, getCookie } from 'h3';
import jwtDecode from 'jwt-decode';
import jwt from 'jsonwebtoken';

export type JsonWebToken = {
  iat: number;
  exp: number;
  documentStorage: {
    read: string[];
    write: string[];
    delete: string[];
  };
};

export const getToken = (event: H3Event): string | null =>
  event.node.req.headers['authorization'] ||
  getCookie(event, useRuntimeConfig().tokenCookieKey) ||
  null;

export const isTokenValid = async (token: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // TODO:: accept changed tokens!!!
    jwt.verify(token, useRuntimeConfig().jwtSecret, function (error) {
      resolve(!!!error);
    });
  });
};

export const decodeToken = async (
  token: string
): Promise<JsonWebToken | any> => {
  return new Promise((resolve) => {
    resolve(jwtDecode(token));
  });
};

export const validateAndGetToken = async (
  event: H3Event
): Promise<JsonWebToken> => {
  const rawToken = getToken(event);

  if (!rawToken || !(await isTokenValid(rawToken))) {
    throw createError({
      statusCode: 401,
      statusMessage: `Unauthorized`,
    });
  }

  const token = await decodeToken(rawToken);

  if (!token?.documentStorage) {
    throw createError({
      statusCode: 401,
      statusMessage: `Unauthorized`,
    });
  }

  return token;
};
