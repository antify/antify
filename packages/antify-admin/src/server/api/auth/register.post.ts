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
  const content = await tokenContent(requestData.token);

  // is token for the same e-mail? (validate or forbidden?)

  if (!isValid) {
    throw new HttpForbiddenError();
  }

  validator.validateProperty('email', requestData.email);
  validator.validateProperty('password', requestData.password);

  if (validator.hasErrors() || !isValid) {
    return {
      badRequest: {
        errors: validator.getErrors(),
      },
    };
  }

  console.log('how am i', content);
  const password = await hashPassword(requestData.password);

  // create new user
  const user = await prisma.user.create({
    data: {
      email: requestData.email,
      password: password,
      name: requestData.email.split('@')[0],
      isSuperAdmin: false,
      isBanned: false,
      tenantAccesses: {
        create: {
          roleId: 'e97f0766-3302-49eb-8e23-f61ffba6217a',
          tenantId: content.tenantId,
        },
      },
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
