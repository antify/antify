import {
  tokenValid,
  hashPassword,
  tokenContent,
  handleCreateToken,
} from '../../utils/tokenUtil';
import { HttpForbiddenError } from '../../errors';
import prisma from '~~/server/datasources/auth/client';
import {
  Response,
  Input,
  validator,
} from '../../../glue/api/auth/register.post';

export default defineEventHandler<Response>(async (event) => {
  const requestData = await useBody<Input>(event);
  const isValid = await tokenValid(requestData.token);

  if (!isValid) {
    throw new HttpForbiddenError();
  }

  // is token for the same e-mail? (validate or forbidden?)
  const content = await tokenContent(requestData.token);

  validator.validateProperty('email', requestData.email);
  validator.validateProperty('password', requestData.password);

  if (validator.hasErrors() || !isValid) {
    return {
      badRequest: {
        errors: validator.getErrors(),
      },
    };
  }

  const password = await hashPassword(requestData.password);

  // set user password
  const user = await prisma.user.update({
    where: {
      id: content.id,
    },
    data: {
      password: password,
    },
  });

  // set isPending to false
  await prisma.userTenantAccess.update({
    where: {
      userId_tenantId: {
        userId: content.id,
        tenantId: content.tenantId,
      },
    },
    data: {
      isPending: false,
    },
  });

  // create login token
  const loginToken = await handleCreateToken(event, {
    email: requestData.email,
    password,
  });

  return {
    default: {
      token: loginToken,
    },
  };
});
