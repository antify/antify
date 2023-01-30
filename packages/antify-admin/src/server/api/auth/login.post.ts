import { handleCreateToken } from '~~/server/utils/tokenUtil';
import { tokenValid, tokenContent } from '~~/server/utils/tokenUtil';
import { HttpForbiddenError } from '~~/server/errors';
import {
  AuthLoginPostInput,
  authLoginPostValidator,
  AuthLoginPostResponse,
} from '~~/glue/api/auth/login.post';
import { H3Event, readBody } from 'h3';
import { User } from '~~/server/datasources/core/schemas/user';
import { UserTenantAccess } from '~~/server/datasources/core/schemas/userTenantAccess';
import { hashPassword } from '~~/server/utils/passwordHashUtil';
import { useCoreClient } from '~~/server/service/useCoreClient';

export default defineEventHandler<AuthLoginPostResponse>(
  async (event: H3Event) => {
    const requestData = await readBody<AuthLoginPostInput>(event);

    authLoginPostValidator.validate(requestData);

    if (authLoginPostValidator.hasErrors()) {
      return {
        badRequest: {
          errors: authLoginPostValidator.getErrors(),
        },
      };
    }

    // check if got an invite token:
    if (requestData.token) {
      const isValid = await tokenValid(requestData.token);

      if (!isValid) {
        throw new HttpForbiddenError();
      }

      const inviteTokenContent = await tokenContent(requestData.token);

      // check if token was made for current user:
      const coreClient = await useCoreClient().connect();
      const UserModel = coreClient.getModel<User>('users');
      const UserTenantAccessModel = coreClient.getModel<UserTenantAccess>(
        'user_tenant_accesses'
      );
      const user = await UserModel.findById(inviteTokenContent.id);

      if (user?.email !== requestData.email) {
        // TODO:: handle by response error not http error
        throw new HttpForbiddenError('Not allowed to use given token.');
      }

      // everything looks good, update tenant access to be no longer pending
      await UserTenantAccessModel.updateOne(
        { user: inviteTokenContent.id, tenant: inviteTokenContent.tenantId },
        { isPending: false }
      );
    }

    const password = await hashPassword(
      requestData.password,
      useRuntimeConfig().passwordSalt
    );
    const token = await handleCreateToken(event, {
      email: requestData.email,
      password,
    });

    if (token === 'notFound') {
      return {
        invalidCredentials: {
          errors: [
            'E-Mail oder Passwort falsch - Bitte prüfen Sie Ihre Eingaben.',
          ],
        },
      };
    }

    if (token === 'banned') {
      return {
        banned: {
          errors: [
            'Ihr Account wurde gesperrt. Bitte wenden Sie sich an unseren Support.',
          ],
        },
      };
    }

    return {
      default: {
        token,
      },
    };
  }
);
