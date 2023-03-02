import jwt from 'jsonwebtoken';
import { AntJwtPayload } from '../useGuard';

export const signToken = (
  payload: AntJwtPayload,
  secret: string,
  expiration: number
) => {
  return jwt.sign(payload, secret, { expiresIn: expiration });
};
