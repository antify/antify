import { DatabaseConfiguration, Migration } from '../types';
import { require } from '../utils';
import { getAbsoluteMigrationDir } from './utils';
import fs from 'fs';

export const loadMigrationsFromFilesystem = (
  projectRootDir: string,
  databaseConfiguration: DatabaseConfiguration
): Migration[] => {
  const migrations: Migration[] = [];
  const absoluteMigrationDir = getAbsoluteMigrationDir(
    databaseConfiguration,
    projectRootDir
  );

  getMigrationsFilenames(absoluteMigrationDir).forEach((filename) => {
    const migration =
      require(`./${filename}`, absoluteMigrationDir) as Migration;

    migration.name = filename;
    migrations.push(migration);
  });

  return migrations;
};

export const getMigrationsFilenames = (dir: string): string[] => {
  return fs
    .readdirSync(dir)
    .map((filename) => removeFileTypeExtension(filename))
    .sort();
};

function removeFileTypeExtension(filename: string): string {
  return filename.substring(0, filename.lastIndexOf('.'));
}
