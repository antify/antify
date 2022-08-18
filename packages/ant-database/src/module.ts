import { fileURLToPath } from 'url';
import {
  defineNuxtModule,
  addPlugin,
  addComponentsDir,
  addServerHandler,
  createResolver,
  importModule,
} from '@nuxt/kit';
import { join, dirname } from 'pathe';
import shelljs from 'shelljs';
import fs from 'fs';

export interface ModuleOptions {
  schemas: Record<string, DatabaseConfiguration>;
}

export type DatabaseConfiguration = {
  inputs: string[];
  fragments?: string[];
  output: string;
};

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'ant-database',
    configKey: 'antDatabase',
  },
  defaults: {
    schemas: {},
  },
  async setup(options, nuxt) {
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));
    const { resolve } = createResolver(import.meta.url);

    nuxt.hook('nitro:config', (nitroConfig) => {
      if (!nitroConfig.autoImport) {
        nitroConfig.autoImport = {
          imports: [],
        };
      }

      nitroConfig.autoImport.imports.push({
        name: 'useCoreClient',
        as: 'useCoreClient',
        from: join(runtimeDir, 'core', 'client'),
      });

      nitroConfig.autoImport.imports.push({
        name: 'useTenantClient',
        as: 'useTenantClient',
        from: join(runtimeDir, 'tenant', 'client'),
      });
    });

    const makeMigration = (output: string, name: string) =>
      shelljs.exec(
        `npx prisma migrate dev --schema=${output} --name ${name} --create-only`
      );
    const deploy = (output: string) =>
      shelljs.exec(`npx prisma migrate deploy --schema=${output}`);
    const migrate = (output: string) =>
      shelljs.exec(
        `npx prisma migrate deploy --preview-feature --schema=${output}`
      );
    const generate = (output: string) =>
      shelljs.exec(`npx prisma generate --schema=${output}`);
    const reinit = (output: string) => {
      shelljs.exec(`rm -rf ${resolve(dirname(output), 'migrations')}`);
      makeMigration(output, 'init');
    };

    options.schemas.core.inputs.unshift(
      resolve(runtimeDir, 'core', 'schema.prisma')
    );
    options.schemas.tenant.inputs.unshift(
      resolve(runtimeDir, 'tenant', 'schema.prisma')
    );

    await nuxt.callHook('antDatabase:before:loadSchemas', options.schemas);

    // TODO:: keep https://github.com/prisma-utils/prisma-utils/issues/22 in eye
    // fs.writeFile(
    //   // Important: this file need to stay where the command is executed
    //   './prismerge.json',
    //   JSON.stringify(options.schemas),
    //   (error) => {
    //     if (error) {
    //       throw error;
    //     }

    //     // Stitch schemas
    //     shelljs.exec(`npx prismerge`);

    //     Object.values(options.schemas).forEach(
    //       (value: DatabaseConfiguration) => {
    //         generate(value.output);
    //         // reinit(value.output);
    //         migrate(value.output);
    //       }
    //     );
    //   }
    // );
  },
});
