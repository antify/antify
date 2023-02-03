// TODO:: fix type errors
import { parseURL } from 'ufo';
import formidable, { Files } from 'formidable';
import { defineEventHandler } from 'h3';
import { validateAndGetToken } from '../utils/jwtUtil';
import { join } from 'path';
import * as fs from 'fs';
import guard from '../utils/guard';

export default defineEventHandler(async (event) => {
  const token = validateAndGetToken(event);
  const { pathname: dir } = parseURL(event.node.req.url);

  if (!guard.canUpload(token, dir)) {
    throw createError({
      statusCode: 403,
      statusMessage: `Forbidden`,
    });
  }

  const uploadDir = join(useRuntimeConfig().filesStorageDir, dir);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    multiples: true,
    uploadDir,
    keepExtensions: true,
    filter: function ({ name, originalFilename, mimetype }) {
      // keep only images, text files and pdf's
      // TODO:: make it configurateable
      return (
        mimetype &&
        (mimetype.includes('image') ||
          mimetype.includes('application/pdf') ||
          mimetype.includes('text/plain'))
      );
    },
  });

  const files: Files = await new Promise((resolve, reject) => {
    form.parse(event.node.req, async (err, fields, files) => {
      // TODO:: create testcase for this
      if (err) {
        reject(
          createError({
            statusCode: 500,
            statusMessage: `Upload failed: ${err}`,
          })
        );
      }

      resolve(files);
    });
  });

  return Object.values(files).map((file: File) => ({
    title: file.originalFilename,
    fileName: file.newFilename,
    fileType: file.mimetype,
  }));
});
