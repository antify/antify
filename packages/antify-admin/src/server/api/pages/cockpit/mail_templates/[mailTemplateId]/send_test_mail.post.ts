import {
  Input,
  validator,
} from '~~/glue/api/cockpit/mail_templates/[mailTemplateId]/send_test_mail.post';
import { useMailer } from '~~/server/utils/useMailer';
import { isSuperAdminMiddleware } from '~~/server/guard/isSuperAdmin.middleware';
import { MailTemplate } from '~~/server/datasources/core/schemas/mailTemplate';
import { useCoreClient } from '~~/server/service/useCoreClient';

export default defineEventHandler(async (event) => {
  isSuperAdminMiddleware(event);

  const requestData = await readBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    return {
      badRequest: {
        errors: validator.getErrors(),
      },
    };
  }

  const mailTemplate = await (await useCoreClient().connect())
    .getModel<MailTemplate>('mail_templates')
    .findById(event.context.params.mailTemplateId);

  if (!mailTemplate) {
    return {
      notFound: {
        errors: ['Not found'],
      },
    };
  }

  useMailer().sendMail({
    // TODO:: get a from
    from: '"Testsystem 👻" <noreply@example.com>',
    to: requestData.testMail,
    subject: mailTemplate.title,
    // TODO:: implement plain content
    text: 'Hello world?',
    html: mailTemplate.content,
  });

  return { default: { success: true } };
});
