import { Input, validator, Response } from '~~/glue/api/auth/new_password.post';

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

  // TODO:: check token to be valid and still in time
  console.log('Token', requestData.token);

  // TODO:: update password in database
  console.log('New password', requestData.password);

  // TODO:: return success message?
  return {
    default: {},
  };
});
