import { handleCreateToken, hashPassword } from '~~/server/utils/tokenUtil';
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
