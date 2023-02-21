import {
  Input,
  validator,
} from '../../../../glue/main-data-form/[mailTemplateId].put';
import { MailTemplate } from '../../../datasources/mailTemplate.schema';
import { isLoggedInHandler, isAuthorizedHandler } from '@antify/ant-guard';
import { getDatabaseClientFromRequest } from '@antify/kit';
import { extendSchemas } from '../../../datasources/schema.extensions';

export default defineEventHandler(async (event) => {
  const contextConfig = useRuntimeConfig().antMailer.providers;

  isLoggedInHandler(event);
  await isAuthorizedHandler(
    event,
    'CAN_EDIT_MAIL_TEMPLATES', /*PermissionId.CAN_EDIT_MAIL_TEMPLATES*/
    contextConfig
  );

  const requestData = await readBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    return {
      errors: validator.getErrors(),
      errorType: 'BAD_REQUEST',
    };
  }

  const client = await getDatabaseClientFromRequest(event, contextConfig, extendSchemas);
  const MailTemplateModel = client.getModel<MailTemplate>('mail_templates');
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
      content: mailTemplate.content || '',
    },
  };
});
