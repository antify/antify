import { fileURLToPath } from 'url';
import {
  defineNuxtModule,
  createResolver,
  addServerHandler,
  addTemplate,
  addComponentsDir
} from '@nuxt/kit';
import { MailTemplateConfiguration, Provider } from './runtime/server/types';

type ModuleOptions = {
  systemMail: string;
  mailTemplates: MailTemplateConfiguration[];
  providers: Provider[];
};

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'mailer-module',
    configKey: 'antMailerModule'
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));

    if (!options.systemMail) {
      throw new Error(`Missing required option systemMail. Set the antMailerModule.systemMail option.`);
    }

    nuxt.options.runtimeConfig.antMailer = {
      systemMail: options.systemMail,
      providers: options.providers || [],
      mailTemplates: validateDefaultMailTemplates(options.mailTemplates || [])
    };

    nuxt.hook('modules:done', async () => {
      const mailTemplatesToAdd = await nuxt.callHook('antMailerModule:registerTemplates') || [];

      nuxt.options.runtimeConfig.antMailer.mailTemplates = [
        ...nuxt.options.runtimeConfig.antMailer.mailTemplates,
        ...validateDefaultMailTemplates(mailTemplatesToAdd)
      ];
    });

    await addComponentsDir({
      path: resolve('./runtime/components'),
      pathPrefix: false,
      prefix: 'AntMailerModule',
      global: true
    });

    // Export scripts server side
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {};

      nitroConfig.alias['#mailerModule'] = resolve('./runtime/server');
    });

    const template = addTemplate({
      filename: 'types/mailer-module.d.ts',
      getContents: () => [
        'declare module \'#mailerModule\' {',
        `  const useMailer: typeof import('${resolve('./runtime/server/utils')}').useMailer`,
        `  const getMailTemplate: typeof import('${resolve('./runtime/server/utils')}').getMailTemplate`,
        `  export * from '${resolve('./runtime/server/types')}'`,
        '}'
      ].join('\n')
    });

    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: template.dst });
    });

    // TODO:: do it like nuxt does it. May any kit helper function there?
    addServerHandler({
      route: '/api/mailer-module/mail-templates-table',
      method: 'get',
      handler: resolve(
        runtimeDir,
        'server/api/mailer-module/mail-templates-table/index.get'
      )
    });

    addServerHandler({
      route: '/api/mailer-module/main-data-form/:mailTemplateId',
      method: 'put',
      handler: resolve(
        runtimeDir,
        'server/api/mailer-module/main-data-form/[mailTemplateId].put'
      )
    });

    addServerHandler({
      route: '/api/mailer-module/main-data-form/:mailTemplateId',
      method: 'get',
      handler: resolve(
        runtimeDir,
        'server/api/mailer-module/main-data-form/[mailTemplateId].get'
      )
    });

    addServerHandler({
      route: '/api/mailer-module/send-test-mail/:mailTemplateId',
      method: 'post',
      handler: resolve(
        runtimeDir,
        'server/api/mailer-module/send-test-mail/[mailTemplateId].post'
      )
    });
  }
});

function validateDefaultMailTemplates(mailTemplates: MailTemplateConfiguration[]) {
  const alreadyUsedIds: Record<string, true> = {};

  mailTemplates.forEach(mailTemplate => {
    if (!mailTemplate.mailTemplateId) {
      throw new Error(`Missing required property mailTemplateId`);
    }

    if (alreadyUsedIds[mailTemplate.mailTemplateId] === true) {
      throw new Error(`There already exists a mail template with mail template id ${mailTemplate.mailTemplateId}`);
    }

    if (!mailTemplate.title) {
      throw new Error(`Missing required property title`);
    }
  });

  return mailTemplates;
}
