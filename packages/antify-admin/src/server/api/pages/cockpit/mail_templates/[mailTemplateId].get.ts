import { MailTemplate } from '~~/server/datasources/core/schemas/mailTemplate';
import { isSuperAdminMiddleware } from '~~/server/guard/isSuperAdmin.middleware';
import { useCoreClient } from '~~/server/service/useCoreClient';

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

  return {
    id: mailTemplate.id,
    title: mailTemplate.title,
    content: mailTemplate.content,
  };
});
