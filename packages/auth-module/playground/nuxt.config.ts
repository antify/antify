import Module from '..';
import AntDevModule from '@antify/dev-module';
import MailerModule from '@antify/mailer-module';

const passwordSalt = '#a!SaveSalt123';

export default defineNuxtConfig({
  modules: [
    MailerModule,
    Module,
    // TODO:: remove me and replace with antify-ui
    '@nuxtjs/tailwindcss',
    AntDevModule
  ],
  antAuthModule: {
    interface: '',
    providers: [
      {
        id: 'core',
        isSingleTenancy: true,
        jwtSecret: '#a!SuperSecret123',
        jwtExpiration: '8h',
        passwordSalt,
        canRegister: true
      }
    ]
  },
  antMailerModule: {
    systemMail: '"Testsystem 👻" <noreply@example.com>',
    foo: '',
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
  }
});
