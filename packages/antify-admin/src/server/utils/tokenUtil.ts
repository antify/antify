import jwt from 'jsonwebtoken';
import { H3Event, setCookie } from 'h3';
import { TOKEN_COOKIE_KEY, CustomToken } from '~~/composables/useGuard';
import { InviteToken } from '../../composables/useGuard';
import jwtDecode from 'jwt-decode';
import { User } from '../../glue/api/global/me.get';
import { User as UserDatabaseSchema } from '~~/server/datasources/core/schemas/user';
import { UserTenantAccess } from '../datasources/core/schemas/userTenantAccess';
import { Role } from '../datasources/core/schemas/roles';

export const tokenValid = async (token: string): Promise<boolean> => {
  // TODO:: Security dude?
  // TODO:: env
  const JWT_SECRET = 'secret';

  return new Promise((resolve, reject) => {
    // TODO:: accept changed tokens!!!
    jwt.verify(token, JWT_SECRET, function (error) {
      resolve(!!!error);
    });
  });
};

export const tokenContent = async (token: string): Promise<any> => {
  return new Promise((resolve) => {
    resolve(jwtDecode(token));
  });
};

export const handleCreateToken = async (
  event: H3Event,
  userCredentials: { email?: string; password?: string; _id?: string }
): Promise<string | null> => {
  const coreClient = await useCoreClient().connect();
  const UserModel = coreClient.getModel<UserDatabaseSchema>('users');
  const UserTenantAccessModel = coreClient.getModel<UserTenantAccess>(
    'user_tenant_accesses'
  );
  const RoleModel = coreClient.getModel<Role>('roles');

  const user = await UserModel.findOne(userCredentials);

  if (!user) {
    // TODO:: Enum
    return 'notFound';
  } else if (user.isBanned) {
    // TODO:: Enum
    return 'banned';
  }

  const userTenantAccesses = await UserTenantAccessModel.find({
    user: user.id,
  }).populate({
    path: 'role',
    model: RoleModel,
  });

  // TODO:: Security dude?
  // TODO:: env
  const JWT_SECRET = 'secret';
  const JWT_EXPIRATION = '4h';
  // Should be the same as the JWT_EXPIRATION time in seconds
  const TOKEN_MAX_AGE = 4 * 60 * 60;
  const userToken: CustomToken = {
    id: user.id,
    isSuperAdmin: user.isSuperAdmin,
    tenantsAccess: [],
  };

  userToken.tenantsAccess = userTenantAccesses.map((tenantAccess) => ({
    tenantId: tenantAccess.tenant._id,
    isAdmin: tenantAccess.role.isAdmin,
    permissions: tenantAccess.role.permissions,
  }));

  const token = jwt.sign(userToken, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

  setCookie(event, TOKEN_COOKIE_KEY, token, {
    maxAge: TOKEN_MAX_AGE,
  });

  return token;
};

export const createInviteToken = async (
  user: User,
  tenantId: string | null
) => {
  const inviteToken: InviteToken = {
    id: user.id,
    tenantId,
  };

  // TODO:: env
  const JWT_SECRET = 'secret';
  const JWT_EXPIRATION = '4h';

  const token = jwt.sign(inviteToken, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });

  return token;
};
