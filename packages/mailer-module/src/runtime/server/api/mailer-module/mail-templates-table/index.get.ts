import { isAuthorizedHandler } from '@antify/ant-guard';
import { PermissionId } from '../../../permissions';
import { getAllMailTemplates } from '../../../utils';

export default defineEventHandler(async (event) => {
  const contextConfig = useRuntimeConfig().antMailer.providers;

  await isAuthorizedHandler(
    event,
    PermissionId.CAN_READ_MAIL_TEMPLATES,
    contextConfig
  );

  const mailTemplates = await getAllMailTemplates(event);

  return {
    default: mailTemplates.map((mailTemplate) => ({
      mailTemplateId: mailTemplate.mailTemplateId,
      title: mailTemplate.title,
      content: mailTemplate.content,
    })),
  };
});
