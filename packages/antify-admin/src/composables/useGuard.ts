import jwtDecode from 'jwt-decode';

export type CustomToken = {
  id: string;
  isSuperAdmin: boolean;
  tenantsAccess: {
    tenantId: string;
    isAdmin: boolean;
    permissions: string[];
  }[];
};

export type InviteToken = {
  id: string;
  tenantId: string | null;
};

export type UserToken = {
  iat: number;
  exp: number;
} & CustomToken;

export const TOKEN_COOKIE_KEY = 'antt';
export const useGuard = (rawToken: string | null) => {
  let token: UserToken | null;

  try {
    token = jwtDecode<UserToken>(rawToken);
  } catch (e) {
    // Catch it because a not valid token format throw an error.
    token = null;
  }

  return {
    rawToken,
    token,
    isUserLoggedIn: token?.exp < new Date().getTime(),
    isSuperAdmin: () => token?.isSuperAdmin || false,
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
