import * as fs from 'fs';
import { join } from 'path';
import { sendStream } from 'h3';
import { validateAndGetToken } from '../../../utils/jwtUtil';

export default defineEventHandler(async (event) => {
  const token = await validateAndGetToken(event);
  const filePath = join(
    useRuntimeConfig().filesStorageDir,
    event.context.params.dir,
    event.context.params.fileName
  );

  if (guard.canRead(token, filePath)) {
    throw createError({
      statusCode: 403,
      statusMessage: `Forbidden`,
    });
  }

  // Make sure, the user can see this file.

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
