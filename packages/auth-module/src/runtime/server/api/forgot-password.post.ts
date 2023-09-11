import { Input, validator, Response } from '../../glue/forgot-password.post';
import { getDatabaseClientFromRequest } from '@antify/kit';
import { extendSchemas } from '../datasources/schema.extensions';
import { User } from '../datasources/schemas/user';
import { readBody } from 'h3';
import { useMailer } from '#mailerModule';
import { MailTemplateId } from '../mailTemplates';

export default defineEventHandler<Response>(async (event) => {
  const requestData = await readBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    throw new Error(
      `Error while validating input: ${validator.getErrors()[0]}`
    );
  }

  const client = await getDatabaseClientFromRequest(
    event,
    useRuntimeConfig().antAuth.providers,
    extendSchemas
  );

  const UserModel = client.getModel<User>('users');
  const user = await UserModel.findOne({ email: requestData.email });

  if (!user) {
    return {
      notFound: `There exist no user with this email`,
    };
  }

  // TODO:: save forgot password request
  user.forgotPassword = {
    code: '0815',
    sendAt: new Date(),
  };

  await user.save();
  await useMailer(event)
    .sendMail(MailTemplateId.FORGOT_PASSWORD, requestData.email);

  return {
    success: true,
  };
});
