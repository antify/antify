import {
  Input,
  validator
} from '../../../../glue/main-data-form/[mailTemplateId].put';
import { isAuthorizedHandler } from '@antify/ant-guard';
import { PermissionId } from '../../../permissions';
import { getMailTemplate } from '../../../utils';

export default defineEventHandler(async (event) => {
  const contextConfig = useRuntimeConfig().antMailer.providers;

  await isAuthorizedHandler(
    event,
    PermissionId.CAN_EDIT_MAIL_TEMPLATES,
    contextConfig
  );

  const requestData = await readBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    throw new Error(validator.getErrorsAsString());
  }

  const mailTemplate = await getMailTemplate(event, event.context.params.mailTemplateId);

  if (!mailTemplate) {
    return {
      notFound: true
    };
  }

  mailTemplate.title = requestData.title;
  mailTemplate.content = requestData.content;

  await mailTemplate.save();

  return {
    mailTemplateId: mailTemplate.mailTemplateId,
    title: mailTemplate.title,
    content: mailTemplate.content || ''
  };
});
