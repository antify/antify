import * as fs from 'fs';
import { join } from 'path';
import { parseURL } from 'ufo';
import { sendStream } from 'h3';
import { validateAndGetToken } from '../utils/jwtUtil';

export default defineEventHandler(async (event) => {
  const token = validateAndGetToken(event);
  const { pathname } = parseURL(event.node.req.url);

  if (!guard.canRead(token, pathname.split('/').slice(0, -1).join('/'))) {
    throw createError({
      statusCode: 403,
      statusMessage: `Forbidden`,
    });
  }

  const filePath = join(useRuntimeConfig().filesStorageDir, pathname);

  try {
    if (fs.existsSync(filePath)) {
      return sendStream(event, fs.createReadStream(filePath));
    }
  } catch (err) {
    // TODO:: show not in production
    throw createError({
      statusCode: 500,
      statusMessage: err,
    });
  }

  throw createError({
    statusCode: 404,
    statusMessage: `File not found`,
  });
});
