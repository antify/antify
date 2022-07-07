import { handleCreateToken, hashPassword } from "~~/server/utils/tokenUtil";
import { AuthLoginPostInput, authLoginPostValidator, AuthLoginPostResponse } from "~~/glue/api/auth/login.post";

export default defineEventHandler<AuthLoginPostResponse>(async (event) => {
  const requestData = await useBody<AuthLoginPostInput>(event);

  authLoginPostValidator.validate(requestData);

  if (authLoginPostValidator.hasErrors()) {
    return {
      badRequest: {
        errors: authLoginPostValidator.getErrors()
      }
    }
  }

  const password = await hashPassword(requestData.password);
  const token = await handleCreateToken(event, {
    email: requestData.email,
    password
  });

  if (!token) {
    return {
      invalidCredentials: {
        errors: [
          // TODO:: translate me
          'Invalid credentials - please try again'
        ]
      }
    }
  }

  return {
    default: {
      token
    }
  }
});
