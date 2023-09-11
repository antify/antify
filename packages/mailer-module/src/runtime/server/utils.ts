import { ContextConfiguration, getContext } from '@antify/context';
import nodemailer, { TransportOptions } from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';
import { type H3Event } from 'h3';
import { MailTemplateConfiguration, Provider } from './types';
import { getDatabaseClientFromRequest } from '@antify/kit';
import { extendSchemas } from './datasources/schema.extensions';
import { MailTemplate } from './datasources/mailTemplate.schema';

export async function getMailTemplate(event: H3Event, id: string) {
  let mailTemplate = getDefaultMailTemplates().find(template => template.mailTemplateId === id);

  if (!mailTemplate) {
    return null;
  }

  const client = await getDatabaseClientFromRequest(
    event,
    getContextConfig(),
    extendSchemas
  );
  const MailTemplateModel = client.getModel<MailTemplate>('mail_templates');

  return await MailTemplateModel.findOne({ mailTemplateId: id }) || new MailTemplateModel(mailTemplate);
}

export async function getAllMailTemplates(event: H3Event) {
  const client = await getDatabaseClientFromRequest(
    event,
    getContextConfig(),
    extendSchemas
  );
  const MailTemplateModel = client.getModel<MailTemplate>('mail_templates');
  const mailTemplateIds = getDefaultMailTemplates().map(mailTemplate => mailTemplate.mailTemplateId);
  const mailTemplates = await MailTemplateModel.find({ mailTemplateId: { $in: mailTemplateIds } });

  return getDefaultMailTemplates().map(mailTemplate => {
    const mailTemplateEntity = mailTemplates
      .find(_mailTemplateEntity => _mailTemplateEntity.mailTemplateId === mailTemplate.mailTemplateId) || mailTemplate;

    return {
      mailTemplateId: mailTemplateEntity.mailTemplateId,
      title: mailTemplateEntity.title,
      content: mailTemplateEntity.content
    };
  });
}

export const getContextConfig = (): ContextConfiguration => useRuntimeConfig().antMailer.providers;
export const getDefaultMailTemplates = (): MailTemplateConfiguration[] => useRuntimeConfig().antMailer.mailTemplates;

export function useMailer(event: H3Event) {
  const provider = getContext(
    event,
    useRuntimeConfig().antMailer.providers
  ) as Provider;

  const options = {
    host: provider.smtpHost,
    port: provider.smtpPort,
    secure: false, // true for 465, false for other ports
    auth: {}
  };

  if (provider.smtpUser && provider.smtpPassword) {
    options.auth = {
      user: provider.smtpUser || null,
      pass: provider.smtpPassword || null
    };
  }
  const transporter = nodemailer.createTransport(options as TransportOptions);

  return {
    async sendMail(mailTemplateId: string, mailTo: string, mailOptions: Options = {}) {
      const mailTemplate = await getMailTemplate(event, mailTemplateId);

      if (!mailTemplate) {
        throw new Error(`Mail template with mailTemplateId ${mailTemplate} does not exists`);
      }

      return transporter.sendMail({
        ...mailOptions,
        ...{
          from: useRuntimeConfig().antMailer.systemMail,
          to: mailTo,
          subject: mailTemplate.title,
          text: mailTemplate.content,
          html: mailTemplate.content
        }
      });
    }
  };
}
