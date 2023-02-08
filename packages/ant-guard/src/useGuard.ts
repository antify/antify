import jwt, { JwtPayload } from 'jsonwebtoken';

export type AntJwtPayload = {
  isSuperAdmin: boolean;
  tenantsAccess: {
    tenantId: string;
    isAdmin: boolean;
    permissions: string[];
  }[];
} & JwtPayload;

// TODO:: make changeable
export const TOKEN_COOKIE_KEY = 'antt';
export const useGuard = (rawToken: string | null) => {
  let token: AntJwtPayload | null = null;

  try {
    // TODO:: get secret from somewhere
    const payload = jwt.verify(rawToken as string, 'secret') as JwtPayload;

    // Jwt.verify returns payload or string. Only work with object.
    if (typeof token === 'object') {
      token = {
        ...{
          isSuperAdmin: false,
          tenantsAccess: [],
        },
        ...payload,
      };
    }
  } catch (e) {
    // Catch it because a not valid token format throw an error.
    token = null;
  }

  return {
    isUserLoggedIn: token !== null,
    isSuperAdmin: token?.isSuperAdmin || false,
    hasPermissionTo: (permission: string[] | string, tenantId: string) => {
      if (token?.isSuperAdmin) {
        return true;
      }

      const tenantAccess = (token?.tenantsAccess || []).find(
        (tenantAccessItem) => tenantAccessItem.tenantId === tenantId
      );

      if (!tenantAccess) {
        return false;
      }

      if (tenantAccess.isAdmin) {
        return true;
      }

      if (Array.isArray(permission)) {
        return tenantAccess.permissions.some((permissionItem) =>
          permission.some(
            (permissionToFind) => permissionToFind === permissionItem
          )
        );
      }

      return tenantAccess.permissions.some(
        (permissionItem) => permissionItem === permission
      );
    },
  };
};
