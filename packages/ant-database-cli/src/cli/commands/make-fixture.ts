import consola from 'consola';
import { defineAntDbCommand } from './index';
import { resolve } from 'pathe';
import { getAbsoluteFixturesDir } from '@antify/ant-database';
import { join } from 'pathe';
import fs from 'fs';
import { loadDatabaseConfig } from '../utils/load-database-config';

export default defineAntDbCommand({
  meta: {
    name: 'make-fixture',
    usage: 'ant-db make-fixture [databaseName] [migrationName]',
    description: 'Generates a fixture',
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

    const absoluteOutDir = getAbsoluteFixturesDir(
      databaseConfig,
      resolve(args.cwd || '.')
    );

    if (!fs.existsSync(absoluteOutDir)) {
      fs.mkdirSync(absoluteOutDir, { recursive: true });
    }

    const fileName = `${migrationName}.ts`;

    fs.writeFileSync(
      join(absoluteOutDir, fileName),
      `import { defineFixture } from "@antify/ant-database";

export default defineFixture({
  async load(client) {
    
  },
});`
    );

    consola.info(`Created: ${fileName}`);
  },
});
