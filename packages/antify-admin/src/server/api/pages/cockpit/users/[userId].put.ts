import {
  Input,
  Response,
  validator,
} from '~~/glue/api/cockpit/users/[userId].put';
import { isSuperAdminMiddleware } from '~~/server/guard/isSuperAdmin.middleware';
import { User } from '~~/server/datasources/core/schemas/user';
import mongoose from 'mongoose';
import { useCoreClient } from '~~/server/service/useCoreClient';

export default defineEventHandler<Response>(async (event) => {
  isSuperAdminMiddleware(event);

  if (!mongoose.isValidObjectId(event.context.params.userId)) {
    return {
      notFound: {
        message: 'Not Found',
      },
    };
  }

  const UserModel = (await useCoreClient().connect()).getModel<User>('users');

  const user = await UserModel.findOne({ id: event.context.params.userId });

  if (!user) {
    return {
      notFound: {
        message: 'Not Found',
      },
    };
  }

  const requestData = await readBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    return {
      badRequest: {
        errors: validator.getErrors(),
      },
    };
  }

  await UserModel.updateOne({ id: user.id }, { email: requestData.email, name: requestData.name });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
});
