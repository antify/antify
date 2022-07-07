import prisma from "~~/server/datasources/db/client";
import { 
  Input, 
  validator,
  Response
} from '~~/glue/api/mail_templates/[mailTemplateId].put';

export default defineEventHandler<Response>(async (event) => {
  const requestData = await useBody<Input>(event);

  validator.validate(requestData);

  if (validator.hasErrors()) {
    return {
      badRequest: {
        errors: validator.getErrors()
      }
    }
  }

  // TODO:: what if not exists?

  const mailTemplate = await prisma.mailTemplate.update({
    select: {
      id: true,
      title: true,
      content: true,
    },
    where: {
      id: event.context.params.mailTemplateId
    },
    data: {
      title: requestData.title,
      content: requestData.content
    }
  });

  return {
    default: mailTemplate
  }
});
