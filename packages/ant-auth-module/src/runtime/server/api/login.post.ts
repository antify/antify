import { handleCreateToken } from '../utils/tokenUtil';
import { Input, validator } from '../../glue/login.post';
import { H3Event, readBody } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  const requestData = await readBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    throw new Error(
      `Error while validating input: ${validator.getErrors()[0]}`
    );
  }

  const token = await handleCreateToken(
    event,
    requestData.email,
    requestData.password
  );

  if (token === 'notFound') {
    return {
      invalidCredentials: {
        errors: [
          // TODO:: english
          'E-Mail oder Passwort falsch - Bitte prüfen Sie Ihre Eingaben.',
        ],
      },
    };
  }

  if (token === 'banned') {
    return {
      banned: {
        errors: [
          // TODO:: english
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
