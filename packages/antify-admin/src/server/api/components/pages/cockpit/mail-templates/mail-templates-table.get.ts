import { isSuperAdminMiddleware } from '~~/server/guard/isSuperAdmin.middleware';
import { MailTemplate } from '~~/server/datasources/core/schemas/mailTemplate';

export default defineEventHandler(async (event) => {
  isSuperAdminMiddleware(event);

  const MailTemplateModel = (
    await useCoreClient().connect()
  ).getModel<MailTemplate>('mail_templates');

  return (await MailTemplateModel.find()).map((mailTemplate) => ({
    id: mailTemplate.id,
    title: mailTemplate.title,
  }));
});
