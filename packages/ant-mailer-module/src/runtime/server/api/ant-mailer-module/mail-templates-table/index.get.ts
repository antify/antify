import { MailTemplate } from '../../../datasources/mailTemplate.schema';
import { isLoggedInHandler, isAuthorizedHandler } from '@antify/ant-guard';
import { getDatabaseClientFromRequest } from '@antify/kit';
import { extendSchemas } from '../../../datasources/schema.extensions';

export default defineEventHandler(async (event) => {
  const contextConfig = useRuntimeConfig().antMailer.providers;

  isLoggedInHandler(event);
  await isAuthorizedHandler(
    event,
    'CAN_READ_MAIL_TEMPLATES' /*PermissionId.CAN_READ_MAIL_TEMPLATES*/,
    contextConfig
  );

  const client = await getDatabaseClientFromRequest(
    event,
    contextConfig,
    extendSchemas
  );
  const MailTemplateModel = client.getModel<MailTemplate>('mail_templates');
  const mailTemplates = await MailTemplateModel.find();

  return {
    default: mailTemplates.map((mailTemplate) => ({
      id: mailTemplate.id,
      templateId: mailTemplate.templateId,
      title: mailTemplate.title,
      content: mailTemplate.content,
    })),
  };
});
