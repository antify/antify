import consola from 'consola';
import { defineAntDbCommand } from './index';
import { resolve } from 'pathe';
import { tryRequire } from '../../utils';
import { DatabaseConfigurations, DatabaseConfiguration } from '@antify/ant-database';
import { join } from 'pathe';
import fs from 'fs';

const convertTwoDigits = (number: number): string => {
  return number < 10 ? `0${number}` : `${number}`;
};

export default defineAntDbCommand({
  meta: {
    // TODO:: "databaseName" is a confusing name
    name: 'make-migration [databaseName] [migrationName]',
    usage: 'ant-db make-migration',
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

    const projectRootDir = resolve(args.cwd || '.');
    const databaseConfig: DatabaseConfigurations =
      tryRequire('./database.config', projectRootDir) || {};

    if (databaseConfig[databaseName] === undefined) {
      return consola.error(
        `There exists no configuration for database "${databaseName}"`
      );
    }

    const absoluteOutDir = join(
      resolve(args.cwd || '.'),
      databaseConfig[databaseName].migrationDir
    );

    if (!fs.existsSync(absoluteOutDir)) {
      fs.mkdirSync(absoluteOutDir);
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
