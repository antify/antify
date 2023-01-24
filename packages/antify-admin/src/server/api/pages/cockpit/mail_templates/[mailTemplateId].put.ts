import {
  Input,
  validator,
} from '~~/glue/api/cockpit/mail_templates/[mailTemplateId].put';
import { isSuperAdminMiddleware } from '~~/server/guard/isSuperAdmin.middleware';
import { MailTemplate } from '~~/server/datasources/core/schemas/mailTemplate';

export default defineEventHandler(async (event) => {
  isSuperAdminMiddleware(event);

  const MailTemplateModel = (
    await useCoreClient().connect()
  ).getModel<MailTemplate>('mail_templates');

  const mailTemplate = await MailTemplateModel.findById(
    event.context.params.mailTemplateId
  );

  if (!mailTemplate) {
    return {
      notFound: {
        errors: ['Not Found'],
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

  mailTemplate.title = requestData.title;
  mailTemplate.content = requestData.content;

  return {
    default: {
      id: mailTemplate.id,
      title: mailTemplate.title,
      content: mailTemplate.content,
    },
  };
});
