import Module from '..';
import AntToasterModule from '@antify/ant-toaster-module';
import AntDevModule from '@antify/dev-module';

export default defineNuxtConfig({
  modules: [
    Module,
    AntToasterModule,
    // TODO:: remove me and replace with antify-ui
    '@nuxtjs/tailwindcss',
    AntDevModule
  ],
  antMailerModule: {
    systemMail: '"Testsystem 👻" <noreply@example.com>',
    mailTemplates: [
      {
        mailTemplateId: 'FIRST_TEST',
        title: 'First test',
        content: 'This is a test mail'
      }, {
        mailTemplateId: 'SECOND_TEST',
        title: 'Second test',
        content: 'This is a test mail'
      }
    ],
    providers: [
      {
        id: 'core',
        smtpHost: 'localhost',
        smtpPort: '1025',
        isSingleTenancy: true
      },
      {
        id: 'tenant',
        smtpHost: 'localhost',
        smtpPort: '1025',
        isSingleTenancy: false
      }
    ]
  },
  tailwindcss: {
    config: {
      // plugins: [tailwindForms],
      content: [
        // TODO:: find a smarter way
        '../../../packages/**/components/**/*.{js,vue,ts}',
        '../../../packages/**/layouts/**/*.vue',
        '../../../packages/**/pages/**/*.vue',
        '../../../packages/**/plugins/**/*.{js,ts}',
        // "../../../packages/**/nuxt.config.{js,ts}",

        '../../../playground/**/components/**/*.{js,vue,ts}',
        '../../../playground/**/layouts/**/*.vue',
        '../../../playground/**/pages/**/*.vue',
        '../../../playground/**/plugins/**/*.{js,ts}',
        // Next line throw an error. Discussion here https://github.com/nuxt-community/tailwindcss-module/issues/429
        // "../../../playground/**/nuxt.config.{js,ts}",

        './node_modules/@antify/antify-ui/dist/components/**/*.{js,vue,ts}',
        './node_modules/@antify/antify-ui/dist/index.{js,vue,ts}'
      ]
    }
  },
  hooks: {
    'antMailerModule:registerTemplates': () => {
      return [
        {
          mailTemplateId: 'THIRD_TEST',
          title: 'Third test',
          content: 'This is a test mail'
        }
      ]
    }
  }
});
