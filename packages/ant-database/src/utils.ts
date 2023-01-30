import jiti from 'jiti';
import { DatabaseConfigurations } from './types';

export function tryRequire(id: string, rootDir: string = process.cwd()) {
  const _require = jiti(rootDir, { interopDefault: true, esmResolve: true });

  try {
    return _require(id);
  } catch (error: any) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      throw error;

      // console.error(`Error trying import ${id} from ${rootDir}`, error);
    }

    return {};
  }
}

export function forceRequire(id: string, rootDir: string = process.cwd()) {
  const _require = jiti(rootDir, { interopDefault: true, esmResolve: true });

  return _require(id);
}

export function loadDatabaseConfiguration(
  require: boolean = true,
  rootDir: string = process.cwd()
): DatabaseConfigurations {
  const configurations: DatabaseConfigurations = require
    ? forceRequire('./database.config', rootDir)
    : tryRequire('./database.config', rootDir);

  Object.keys(configurations).forEach((databaseName) => {
    configurations[databaseName].name = databaseName;
  });

  return configurations;
}

export const removeFileTypeExtension = (filename: string): string => {
  return filename.substring(0, filename.lastIndexOf('.'));
};
