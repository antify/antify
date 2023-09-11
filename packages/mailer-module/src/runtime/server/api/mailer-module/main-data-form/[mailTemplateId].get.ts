import { isAuthorizedHandler } from '@antify/ant-guard';
import { PermissionId } from '../../../permissions';
import { getMailTemplate } from '../../../utils';

export default defineEventHandler(async (event) => {
  const contextConfig = useRuntimeConfig().antMailer.providers;

  await isAuthorizedHandler(
    event,
    PermissionId.CAN_READ_MAIL_TEMPLATES,
    contextConfig
  );

  const mailTemplate = await getMailTemplate(event, event.context.params.mailTemplateId);

  if (!mailTemplate) {
    return {
      notFound: true
    };
  }

  return {
    mailTemplateId: mailTemplate.mailTemplateId,
    title: mailTemplate.title,
    content: mailTemplate.content
  };
});
