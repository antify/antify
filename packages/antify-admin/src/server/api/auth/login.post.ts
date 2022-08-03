import { handleCreateToken, hashPassword } from '~~/server/utils/tokenUtil';
import { tokenValid, tokenContent } from '../../utils/tokenUtil';
import { HttpForbiddenError } from '../../errors';
import prisma from '~~/server/datasources/core/client';
import {
  AuthLoginPostInput,
  authLoginPostValidator,
  AuthLoginPostResponse,
} from '~~/glue/api/auth/login.post';

export default defineEventHandler<AuthLoginPostResponse>(async (event) => {
  const requestData = await useBody<AuthLoginPostInput>(event);

  authLoginPostValidator.validate(requestData);

  if (authLoginPostValidator.hasErrors()) {
    return {
      badRequest: {
        errors: authLoginPostValidator.getErrors(),
      },
    };
  }

  // check if got an invite token:
  const inviteToken = requestData.token;
  if (inviteToken) {
    const isValid = await tokenValid(requestData.token);

    if (!isValid) {
      throw new HttpForbiddenError();
    }

    const inviteTokenContent = await tokenContent(requestData.token);

    // check if token was made for current user:
    const user = await prisma.user.findUnique({
      where: {
        id: inviteTokenContent.id,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (user.email !== requestData.email) {
      throw new HttpForbiddenError('Not allowed to use given token.');
    }

    // everything looks good, update tenant access to be no longer pending
    await prisma.userTenantAccess.update({
      where: {
        userId_tenantId: {
          userId: inviteTokenContent.id,
          tenantId: inviteTokenContent.tenantId,
        },
      },
      data: {
        isPending: false,
      },
    });
  }

  const password = await hashPassword(requestData.password);
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
});
