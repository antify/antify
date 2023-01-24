import consola from 'consola';
import {
  DatabaseConfigurations,
  MultiConnectionDatabaseConfiguration,
  SingleConnectionDatabaseConfiguration,
} from '@antify/ant-database';
import { tryRequire } from '../../utils';

export const loadDatabaseConfig = (
  databaseName: string,
  projectRootDir: string
):
  | SingleConnectionDatabaseConfiguration
  | MultiConnectionDatabaseConfiguration
  | null => {
  let databaseConfig: DatabaseConfigurations;

  try {
    databaseConfig = tryRequire('./database.config', projectRootDir) || {};
  } catch (e) {
    consola.error(e.message);
    return null;
  }

  if (databaseConfig[databaseName] === undefined) {
    consola.error(
      `There exists no configuration for database "${databaseName}"`
    );
    return null;
  }

  return databaseConfig[databaseName];
};
