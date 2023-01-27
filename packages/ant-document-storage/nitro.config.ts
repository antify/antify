import { defineNitroConfig } from 'nitropack';

export default defineNitroConfig({
  storage: {
    templates: {
      driver: 'fs',
      base: './templates',
    },
  },
  runtimeConfig: {
    filesStorageDir: process.env.FILES_STORAGE_DIR,
    jwtSecret: process.env.JWT_SECRET,
    tokenCookieKey: process.env.TOKEN_COOKIE_KEY,
  },
  routeRules: {
    // TODO:: make it configurate able
    '/**': {
      cors: true,
      headers: { 'Access-Control-Allow-Credentials': 'true' },
    },
  },
});
