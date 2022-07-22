import {
  Input,
  validator,
  Response,
} from '~~/glue/api/auth/forgot_password.post';

export default defineEventHandler<Response>(async (event) => {
  const requestData = await useBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    return {
      badRequest: {
        errors: validator.getErrors(),
      },
    };
  }

  // TODO:: send forgot password e-mail
  console.log('E-Mail', requestData.email);

  return {
    default: {},
  };
});
