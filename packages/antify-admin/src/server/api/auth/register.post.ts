import {
  tokenValid,
  tokenContent,
  handleCreateToken,
} from '../../utils/tokenUtil';
import { HttpForbiddenError } from '../../errors';
import {
  Response,
  Input,
  validator,
} from '../../../glue/api/auth/register.post';
import { hashPassword } from '~~/server/utils/passwordHashUtil';
import { useCoreClient } from '~~/server/service/useCoreClient';

export default defineEventHandler<Response>(async (event) => {
  const requestData = await readBody<Input>(event);
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

  const password = await hashPassword(
    requestData.password,
    useRuntimeConfig().passwordSalt
  );

  const tenantClient = await useCoreClient().connect();

  await tenantClient
    .getModel('users')
    .updateOne({ id: content.id }, { password });
  await tenantClient
    .getModel('user_tenant_accesses')
    .updateOne(
      { userId: content.id, tenantId: content.tenantId },
      { isPending: false }
    );

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
