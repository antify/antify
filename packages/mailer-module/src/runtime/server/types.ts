import { type ContextConfigurationItem } from '@antify/context';

export type Provider = {
  id: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser?: string;
  smtpPassword?: string;
} & ContextConfigurationItem;

export type MailTemplateConfiguration = {
  mailTemplateId: string,
  title: string,
  content: string
}
