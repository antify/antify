import { describe, test, expect } from 'vitest';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { loadFixturesFromFilesystem } from '../file-handler';

describe('Fixtures file handler test', async () => {
  test('Should load all fixtures from fixtures directory', async () => {
    const __dirname = path.dirname(fileURLToPath(new URL(import.meta.url)));
    const folderName = 'fixtures/core';
    const dir = path.join(__dirname, folderName);
    const fileNames = ['fixture-1.ts', 'fixture-2.ts', 'fixture-3.ts'];

    fs.rmSync(dir, {
      recursive: true,
      force: true,
    });
    fs.mkdirSync(dir, { recursive: true });

    fileNames.forEach((fileName) => {
      fs.writeFileSync(
        path.join(dir, fileName),
        `import { defineFixture } from '../../../../../src';

export default defineFixture({
  async load(client) { },
});`
      );
    });

    const fixtures = loadFixturesFromFilesystem(__dirname, {
      databaseUrl: '',
      migrationDir: '', // TODO:: remove until migrationDir is optional
      fixturesDir: folderName,
    });

    expect(fixtures).toHaveLength(3);

    fixtures.forEach(async (fixture, index) => {
      expect(fixture).toHaveProperty('name');
      expect(fixture).toHaveProperty('load');
      expect(fixture.name).toBe(`fixture-${index + 1}`);
    });
  });
});
