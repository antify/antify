import consola from 'consola';
import { defineAntDbCommand } from './index';
import { resolve } from 'pathe';
import { join } from 'pathe';
import fs from 'fs';
import { loadDatabaseConfig } from '../utils/load-database-config';

const convertTwoDigits = (number: number): string => {
  return number < 10 ? `0${number}` : `${number}`;
};

export default defineAntDbCommand({
  meta: {
    name: 'make-migration',
    usage: 'ant-db make-migration [databaseName] [migrationName]',
    description: 'Generates a migration',
  },
  invoke(args) {
    const databaseName = args._[0]?.trim();
    const migrationName = args._[1]?.trim();

    if (!databaseName) {
      return consola.error(`Missing required argument "databaseName"`);
    }

    if (!migrationName) {
      return consola.error(`Missing required argument "migrationName"`);
    }

    const databaseConfig = loadDatabaseConfig(
      databaseName,
      resolve(args.cwd || '.')
    );

    if (!databaseConfig) {
      return;
    }

    const absoluteOutDir = join(
      resolve(args.cwd || '.'),
      databaseConfig.migrationDir
    );

    if (!fs.existsSync(absoluteOutDir)) {
      fs.mkdirSync(absoluteOutDir, { recursive: true });
    }

    const now = new Date();
    const date = [
      now.getUTCFullYear(),
      convertTwoDigits(now.getUTCMonth() + 1),
      convertTwoDigits(now.getUTCDate()),
      convertTwoDigits(now.getUTCHours()),
      convertTwoDigits(now.getUTCMinutes()),
      convertTwoDigits(now.getUTCSeconds()),
    ];
    const fileName = `${date.join('')}-${migrationName}.ts`;

    fs.writeFileSync(
      join(absoluteOutDir, fileName),
      `import { defineMigration } from "@antify/ant-database";

export default defineMigration({
  async up(client) {
    
  },

  async down(client) {
    
  },
});`
    );

    consola.info(`Created: ${fileName}`);
  },
});
