import { H3Event } from 'h3';

export default defineEventHandler(() => {
  useNitroApp().hooks.hook('ant-guard:onValidateToken', (event: H3Event) => {
    console.log('ant-guard:onValidateToken');
  });
});
