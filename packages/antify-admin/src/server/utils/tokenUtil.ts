import jwt from "jsonwebtoken";
import { CompatibilityEvent, setCookie } from "h3";
import { TOKEN_COOKIE_KEY, CustomToken } from "~~/composables/useGuard";
import prisma from "~~/server/datasources/db/client";
import crypto from 'crypto';

export const hashPassword = async (password: string): Promise<string> => {
  const config = useRuntimeConfig();

  return new Promise((resolve, reject) => {
    crypto.scrypt(password, config.passwordSalt, 64, (error, derivedKey) => {
      if (error) {
        return reject(error);
      }

      resolve(derivedKey.toString('hex'));
    });
  })
}

export const tokenValid = async (token: string): Promise<boolean> => {
  // TODO:: Security dude?
  // TODO:: env
  const JWT_SECRET = 'secret';

  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, function(error) {
      resolve(!!!error)
    });
  })
}

export const handleCreateToken = async (event: CompatibilityEvent, userIdentification): Promise<string | null> => {
  const user = await prisma.user.findFirst({
    select: {
      id: true,
      email: true,
      isSuperAdmin: true,
      tenantAccesses: {
        select: {
          tenantId: true,
          role: {
            select: {
              id: true,
              isAdmin: true,
              name: true,
              permissions: {
                select: {
                  permissionId: true
                }
              }
            }
          }
        }
      }
    },
    where: userIdentification
  });

  if (!user) {
    return null;
  }

  // TODO:: Security dude?
  // TODO:: env
  const JWT_SECRET = 'secret';
  const JWT_EXPIRATION = '4h';
  // Should be the same as the JWT_EXPIRATION time in seconds
  const TOKEN_MAX_AGE = 4 * 60 * 60;
  const userToken: CustomToken = {
    id: user.id,
    isSuperAdmin: user.isSuperAdmin,
    tenantsAccess: []
  };

  userToken.tenantsAccess = user.tenantAccesses.map(tenantAccess => {
    return {
      tenantId: tenantAccess.tenantId,
      isAdmin: tenantAccess.role.isAdmin,
      permissions: tenantAccess.role.permissions.map(permission => permission.permissionId)
    }
  });

  const token = jwt.sign(userToken, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

  setCookie(event, TOKEN_COOKIE_KEY, token, {
    maxAge: TOKEN_MAX_AGE
  });

  return token;
}