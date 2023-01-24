import { useGuard } from '~~/composables/useGuard';
import { HttpUnauthorizedError } from '~~/server/errors';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { Input, validator } from '~~/glue/api/profile/user.put';
import { authenticatedMiddleware } from '~~/server/guard/authenticated.middleware';
import { User } from '~~/server/datasources/core/schemas/user';

export default defineEventHandler(async (event) => {
  authenticatedMiddleware(event);

  const guard = useGuard(useAuthorizationHeader(event));
  const requestData = await readBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    return {
      errors: validator.getErrors(),
      errorType: 'BAD_REQUEST',
    };
  }

  const user = await (await useCoreClient().connect())
    .getModel<User>('users')
    .findById(guard.token?.id);

  if (!user) {
    // Weird error here... There is a token to a user which does not exists?
    throw new HttpUnauthorizedError();
  }

  user.name = requestData.name;
  user.email = requestData.email;
  console.log(requestData);

  await user.save();

  return {
    default: {
      id: user.id,
      email: user.email,
      name: user.name,
      // url: user.profilePicture
      //   ? useMediaService(user.profilePicture).getProfileUrl()
      //   : null,
    },
  };
});
