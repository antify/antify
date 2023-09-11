import { H3Event, setCookie } from 'h3';
import {
  TOKEN_COOKIE_KEY,
  AntJwtPayload,
  signToken,
  hashPassword, useServerGuard, JsonWebTokenProvider
} from '@antify/ant-guard';
import { User as UserDatabaseSchema } from '../datasources/schemas/user';
import { UserTenantAccess } from '../datasources/schemas/userTenantAccess';
import { Role } from '../datasources/schemas/roles';
import { getDatabaseClientFromRequest } from '@antify/kit';
import { extendSchemas } from '../datasources/schema.extensions';
import { getContext } from '@antify/context';
import { type Provider } from '../../../module';

export const handleCreateToken = async (
  event: H3Event,
  email: string,
  rawPassword: string
): Promise<string | null> => {
  const { providers } = useRuntimeConfig().antAuth;
  const { jwtSecret, jwtExpiration } = await getContext<Provider>(
    event,
    providers
  );
  const client = await getDatabaseClientFromRequest(
    event,
    providers,
    extendSchemas
  );
  const RoleModel = client.getModel<Role>('roles');

  const user = await client
    .getModel<UserDatabaseSchema>('users')
    .findOne({ email, password: await hashRawPassword(rawPassword, event) });

  if (!user) {
    // TODO:: Enum
    return 'notFound';
  } else if (user.isBanned) {
    // TODO:: Enum
    return 'banned';
  }

  const userTenantAccesses = await client
    .getModel<UserTenantAccess>('user_tenant_accesses')
    .find({
      user: user.id,
    })
    .populate({
      path: 'role',
      model: RoleModel,
    });

  const userToken: AntJwtPayload = {
    id: user.id,
    isSuperAdmin: user.isSuperAdmin,
    tenantsAccess: [],
  };

  const jwtProviders: JsonWebTokenProvider[] = userTenantAccesses.map((tenantAccess) => ({
    providerId: 'tenant',
    tenantId: tenantAccess.tenant._id,
    isAdmin: tenantAccess.role.isAdmin,
    permissions: tenantAccess.role.permissions,
  }));
  const guard = useServerGuard(event);

  await guard.loginUser(event, {
    id: user.id,
    isSuperAdmin: user.isSuperAdmin,
    providers: jwtProviders
  });
};

export const hashRawPassword = async (password: string, event: H3Event) => {
  const { providers } = useRuntimeConfig().antAuth;
  const { passwordSalt } = await getContext<Provider>(event, providers);

  return await hashPassword(password, passwordSalt);
};
