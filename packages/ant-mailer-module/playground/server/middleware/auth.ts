import { H3Event } from 'h3';

export default defineEventHandler(() => {
  // TODO:: compare with server config
  [
    'before:mailer-[mailTemplateId].put',
    'before:mailer-[mailTemplateId].get',
    'before:mail-template.get',
  ].forEach((_event) =>
    useNitroApp().hooks.hook(_event, (event: H3Event) => {
      console.log(_event);
    })
  );
});
