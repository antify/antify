import { handleCreateToken, hashRawPassword } from '../utils/tokenUtil';
import { Input, validator } from '../../glue/login.post';
import { H3Event, readBody } from 'h3';
import { getContext } from '@antify/context';
import { Provider } from '../../../module';
import { getDatabaseClientFromRequest } from '@antify/kit';
import { extendSchemas } from '../datasources/schema.extensions';
import { Role } from '../datasources/schemas/roles';
import { User as UserDatabaseSchema } from '../datasources/schemas/user';
import { UserTenantAccess } from '../datasources/schemas/userTenantAccess';
import { AntJwtPayload, JsonWebTokenProvider, useServerGuard } from '@antify/ant-guard';
import databaseHandler from '#authModuleDatabaseHandler';

export default defineEventHandler(async (event: H3Event) => {
  const requestData = await readBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    throw new Error(validator.getErrorsAsString());
  }

  const { providers } = useRuntimeConfig().antAuth;
  // const { jwtSecret, jwtExpiration } = await getContext<Provider>(
  //   event,
  //   providers
  // );
  const client = await getDatabaseClientFromRequest(
    event,
    providers,
    extendSchemas
  );

  const user = await databaseHandler
    .findOneUser(client, requestData.email, await hashRawPassword(requestData.password, event));

  if (!user) {
    return {
      invalidCredentials: {
        errors: [
          // TODO:: english
          'E-Mail oder Passwort falsch - Bitte prüfen Sie Ihre Eingaben.'
        ]
      }
    };
  }

  if (user.isBanned) {
    return {
      banned: {
        errors: [
          'Your account is banned. Please contact the support.'
        ]
      }
    };
  }

  const RoleModel = client.getModel<Role>('roles');
  const userTenantAccesses = await client
    .getModel<UserTenantAccess>('user_tenant_accesses')
    .find({
      user: user.id
    })
    .populate({
      path: 'role',
      model: RoleModel
    });
  const guard = useServerGuard(event);

  await guard.loginUser(event, {
    id: user.id,
    isSuperAdmin: user.isSuperAdmin,
    providers: userTenantAccesses.map<JsonWebTokenProvider>((tenantAccess) => ({
      providerId: 'tenant',
      tenantId: tenantAccess.tenant._id,
      isAdmin: tenantAccess.role.isAdmin,
      permissions: tenantAccess.role.permissions
    }))
  });

  return {
    success: true
  };
});
