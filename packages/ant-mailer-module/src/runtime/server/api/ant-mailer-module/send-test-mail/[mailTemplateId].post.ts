import {
  Input,
  validator,
} from '../../../../glue/send-test-mail/[mailTemplateId].post';
import { MailTemplate } from '../../../datasources/mailTemplate.schema';
import { isAuthorizedHandler } from '@antify/ant-guard';
import { useMailer } from '../../../utils/useMailer';
import { createError } from 'h3';
import { getDatabaseClientFromRequest } from '@antify/kit';
import { extendSchemas } from '../../../datasources/schema.extensions';

export default defineEventHandler(async (event) => {
  const contextConfig = useRuntimeConfig().antMailer.providers;

  await isAuthorizedHandler(
    event,
    'CAN_EDIT_MAIL_TEMPLATES', /*PermissionId.CAN_EDIT_MAIL_TEMPLATES*/
    contextConfig
  );

  const requestData = await readBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    return {
      badRequest: {
        errors: validator.getErrors(),
      },
    };
  }

  const client = await getDatabaseClientFromRequest(event, contextConfig, extendSchemas);
  const MailTemplateModel = client.getModel<MailTemplate>('mail_templates');
  const mailTemplate = await MailTemplateModel.findById(
    event.context.params.mailTemplateId
  );

  if (!mailTemplate) {
    throw createError(
      `Mail template with id ${event.context.params.mailTemplateId} not found`
    );
  }

  try {
    (await useMailer(event)).sendMail({
      // TODO:: get a from
      from: '"Testsystem 👻" <noreply@example.com>',
      to: requestData.testMail,
      subject: mailTemplate.title,
      // TODO:: implement plain content
      text: 'Hello world?',
      html: mailTemplate.content,
    });
  } catch (e) {
    return {
      error: `Can not send mail with error ${e.message}`,
    };
  }

  return { default: { success: true } };
});
