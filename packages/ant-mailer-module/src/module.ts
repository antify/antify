import { fileURLToPath } from 'url';
import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addServerHandler,
} from '@nuxt/kit';
import { type ContextConfigurationItem } from '@antify/context';

export type Provider = {
  id: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser?: string;
  smtpPassword?: string;
} & ContextConfigurationItem;

type ModuleOptions = {
  providers: Provider[];
};

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'ant-mailer-module',
    configKey: 'antMailerModule',
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));

    // TODO:: validate options
    nuxt.options.runtimeConfig.antMailer = options;

    await addComponentsDir({
      path: resolve('./runtime/components'),
      pathPrefix: false,
      prefix: 'AntMailerModule',
      global: true,
    });

    // addPlugin(resolve(runtimeDir, 'plugins/document-storage-client'));

    // nuxt.hook('imports:dirs', (dirs) => {
    //   dirs.push(resolve(runtimeDir, 'composables'));
    // });

    // TODO:: do it like nuxt does it. May any kit helper function there?
    addServerHandler({
      route: '/api/ant-mailer-module/mail-templates-table',
      method: 'get',
      handler: resolve(
        runtimeDir,
        'server/api/ant-mailer-module/mail-templates-table/index.get'
      ),
    });

    addServerHandler({
      route: '/api/ant-mailer-module/main-data-form/:mailTemplateId',
      method: 'put',
      handler: resolve(
        runtimeDir,
        'server/api/ant-mailer-module/main-data-form/[mailTemplateId].put'
      ),
    });

    addServerHandler({
      route: '/api/ant-mailer-module/main-data-form/:mailTemplateId',
      method: 'get',
      handler: resolve(
        runtimeDir,
        'server/api/ant-mailer-module/main-data-form/[mailTemplateId].get'
      ),
    });

    addServerHandler({
      route: '/api/ant-mailer-module/send-test-mail/:mailTemplateId',
      method: 'post',
      handler: resolve(
        runtimeDir,
        'server/api/ant-mailer-module/send-test-mail/[mailTemplateId].post'
      ),
    });
  },
});
