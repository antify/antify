import prisma from '~~/server/datasources/db/client';
import { useGuard } from '~~/composables/useGuard';
import { HttpForbiddenError } from '~~/server/errors';
import { useAuthorizationHeader } from '~~/server/utils/useAuthorizationHeader';
import { useTenantHeader } from '~~/server/utils/useTenantHeader';
import { PermissionId } from '~~/server/datasources/static/permissions';
import {
  Input,
  Response,
  validator,
} from '~~/glue/api/mail_templates/[mailTemplateId]/send_test_mail.post';
import { useMailer } from '~~/server/utils/useMailer';

export default defineEventHandler<Response>(async (event) => {
  const guard = useGuard(useAuthorizationHeader(event));

  if (!guard.isUserLoggedIn) {
    throw new HttpForbiddenError();
  }

  const tenantId = useTenantHeader(event);

  if (!guard.hasPermissionTo(PermissionId.CAN_EDIT_MAIL_TEMPLATES, tenantId)) {
    throw new HttpForbiddenError();
  }

  const requestData = await useBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    return {
      badRequest: {
        errors: validator.getErrors(),
      },
    };
  }

  const mailTemplate = await prisma.mailTemplate.findUnique({
    select: {
      id: true,
      title: true,
      content: true,
    },
    where: {
      id: event.context.params.mailTemplateId,
    },
  });

  if (!mailTemplate) {
    return {
      notFound: {
        errors: ['Not found'],
      },
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
