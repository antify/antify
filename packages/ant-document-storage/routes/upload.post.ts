// TODO:: fix type errors
import formidable, { Files } from 'formidable';
import { defineEventHandler } from 'h3';
import { validateAndGetToken } from '../utils/jwtUtil';
import { join } from 'path';
import * as fs from 'fs';
import guard from '../utils/guard';

const createDirIfNotExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

export default defineEventHandler(async (event) => {
  const token = await validateAndGetToken(event);
  const dir = decodeURI((getQuery(event)?.dir as string) || '/');

  if (!guard.canUpload(token, dir)) {
    throw createError({
      statusCode: 403,
      statusMessage: `Forbidden`,
    });
  }

  createDirIfNotExists(useRuntimeConfig().filesStorageDir);

  const uploadDir = join(useRuntimeConfig().filesStorageDir, dir);

  createDirIfNotExists(uploadDir);

  const form = formidable({
    multiples: true,
    uploadDir,
    keepExtensions: true,
    filter: function ({ name, originalFilename, mimetype }) {
      // keep only images, text files and pdf's
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
