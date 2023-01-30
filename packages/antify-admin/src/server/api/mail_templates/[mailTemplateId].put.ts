import {
  Input,
  validator,
} from '~~/glue/api/mail_templates/[mailTemplateId].put';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { HttpForbiddenError } from '~~/server/errors';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { useGuard } from '~~/composables/useGuard';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { MailTemplate } from '~~/server/datasources/tenant/schemas/mailTemplate';
import { useTenantClient } from '~~/server/service/useTenantClient';

export default defineEventHandler(async (event) => {
  const tenantId = tenantContextMiddleware(event);
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.hasPermissionTo(PermissionId.CAN_EDIT_MAIL_TEMPLATES, tenantId)) {
    throw new HttpForbiddenError();
  }

  const tenantClient = await useTenantClient().connect(tenantId);
  const MailTemplateModel =
    tenantClient.getModel<MailTemplate>('mail_templates');

  const requestData = await readBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    return {
      errors: validator.getErrors(),
      errorType: 'BAD_REQUEST',
    };
  }

  const mailTemplate = await MailTemplateModel.findById(
    event.context.params.mailTemplateId
  );

  if (!mailTemplate) {
    return {
      errors: ['Not Found'],
      type: 'NOT_FOUND',
    };
  }

  mailTemplate.title = requestData.title;
  mailTemplate.content = requestData.content;

  await mailTemplate.save();

  return {
    default: {
      id: mailTemplate.id,
      templateId: mailTemplate.templateId,
      title: mailTemplate.title,
      content: mailTemplate.content,
    },
  };
});
