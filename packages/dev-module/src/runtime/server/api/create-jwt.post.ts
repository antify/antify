import { JsonWebToken, useServerGuard, signToken, TOKEN_COOKIE_KEY } from '@antify/ant-guard';
import { setCookie } from 'h3';

export default defineEventHandler(async (event) => {
  const guard = await useServerGuard(event);
  const data = await readBody<JsonWebToken>(event);

  await guard.loginUser(event, data);

  const payload = await signToken(data, 'secret', data.exp || '2h', data.iat);

  setCookie(event, TOKEN_COOKIE_KEY, payload);

  return {};
});
