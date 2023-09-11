import {
  Input,
  validator
} from '../../../../glue/send-test-mail/[mailTemplateId].post';
import { isAuthorizedHandler } from '@antify/ant-guard';
import { getContextConfig, useMailer } from '../../../utils';
import { createError } from 'h3';
import { PermissionId } from '../../../permissions';

export default defineEventHandler(async (event) => {
  await isAuthorizedHandler(
    event,
    PermissionId.CAN_EDIT_MAIL_TEMPLATES,
    getContextConfig()
  );

  const requestData = await readBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    throw createError(validator.getErrorsAsString());
  }

  try {
    await useMailer(event)
      .sendMail(event.context.params.mailTemplateId, requestData.testMail);
  } catch (e) {
    return {
      error: `Can not send mail with error ${e.message}`
    };
  }

  return { default: { success: true } };
});
