import { join } from 'path';
import { DatabaseConfiguration } from '../types';

export const getAbsoluteFixturesDir = (
  databaseConfig: DatabaseConfiguration,
  projectRootDir: string
) => {
  let fixturesDir = databaseConfig?.fixturesDir;

  if (!fixturesDir) {
    fixturesDir = `fixtures/${databaseConfig.name}`;
  }

  return join(projectRootDir, fixturesDir);
};
