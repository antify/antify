import { useGuard } from '~~/composables/useGuard';
import { HttpForbiddenError } from '~~/server/errors';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { PermissionId } from '~~/server/datasources/static/permissions';
import { tenantContextMiddleware } from '~~/server/guard/tenantContext.middleware';
import { MailTemplate } from '~~/server/datasources/tenant/schemas/mailTemplate';

export default defineEventHandler(async (event) => {
  const tenantId = tenantContextMiddleware(event);
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.hasPermissionTo(PermissionId.CAN_READ_MAIL_TEMPLATES, tenantId)) {
    throw new HttpForbiddenError();
  }

  const tenantClient = await useTenantClient().connect(tenantId);
  const MailTemplateModel =
    tenantClient.getModel<MailTemplate>('mail_templates');
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
