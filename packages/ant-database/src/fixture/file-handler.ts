import { forceRequire, removeFileTypeExtension } from '../utils';
import { DatabaseConfiguration, Fixture } from '../types';
import { getAbsoluteFixturesDir } from './utils';
import fs from 'fs';

export const loadFixturesFromFilesystem = (
  projectRootDir: string,
  databaseConfiguration: DatabaseConfiguration
): Fixture[] => {
  const fixtures: Fixture[] = [];
  const absoluteFixturesDir = getAbsoluteFixturesDir(
    databaseConfiguration,
    projectRootDir
  );

  getFixturesFilenames(absoluteFixturesDir).forEach((filename) => {
    const fixture = forceRequire(
      `./${filename}`,
      absoluteFixturesDir
    ) as Fixture;

    fixture.name = filename;
    fixtures.push(fixture);
  });

  return fixtures;
};

const getFixturesFilenames = (dir: string): string[] => {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .map((filename) => removeFileTypeExtension(filename))
    .sort();
};
