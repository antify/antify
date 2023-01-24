import { useGuard } from '~~/composables/useGuard';
import { HttpForbiddenError } from '~~/server/errors';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { PermissionId } from '~~/server/datasources/static/permissions';
import {
  Input,
  validator,
} from '~~/glue/api/mail_templates/[mailTemplateId]/send_test_mail.post';
import { useMailer } from '~~/server/utils/useMailer';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { MailTemplate } from '~~/server/datasources/tenant/schemas/mailTemplate';

export default defineEventHandler(async (event) => {
  const tenantId = tenantContextMiddleware(event);
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.hasPermissionTo(PermissionId.CAN_EDIT_MAIL_TEMPLATES, tenantId)) {
    throw new HttpForbiddenError();
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

  const tenantClient = await useTenantClient().connect(tenantId);
  const MailTemplateModel =
    tenantClient.getModel<MailTemplate>('mail_templates');
  const mailTemplate = await MailTemplateModel.findById(
    event.context.params.mailTemplateId
  );

  if (!mailTemplate) {
    return {
      errors: ['Not found'],
      errorType: 'NOT_FOUND',
    };
  }

  await useMailer().sendMail({
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
