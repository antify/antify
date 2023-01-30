import consola from 'consola';
import { defineAntDbCommand } from './index';
import { resolve } from 'pathe';
import {
  FixtureExecutionResult,
  SingleConnectionClient,
  MultiConnectionLoadFixtureCallbacks,
  MultiConnectionClient,
  loadFixtures,
  loadFixturesMulticonnection,
} from '@antify/ant-database';
import { loadDatabaseConfig } from '../utils/load-database-config';
import { bold } from 'colorette';
import { validateDatabaseName, validateHasTenantId } from '../utils/validate';

export default defineAntDbCommand({
  meta: {
    name: 'load-fixtures',
    usage: 'ant-db load-fixtures [databaseName] [--tenant]',
    description: 'Load fixtures',
  },
  async invoke(args) {
    const databaseName = args._[0]?.trim();
    let tenantId = args['tenant'] || null;

    if (args['tenantId']) {
      tenantId = `${tenantId}`.trim();
    }

    if (!validateDatabaseName(databaseName)) {
      return;
    }

    const projectRootDir = resolve(args.cwd || '.');
    const databaseConfig = loadDatabaseConfig(databaseName, projectRootDir);

    if (!databaseConfig) {
      return;
    }

    if (
      databaseConfig.isSingleConnection === false &&
      tenantId &&
      !validateHasTenantId(await databaseConfig.fetchTenants(), tenantId)
    ) {
      return;
    }

    const callbacks: MultiConnectionLoadFixtureCallbacks = {
      onLoadFixtureFinished: (executionResult: FixtureExecutionResult) => {
        if (executionResult.error) {
          return consola.error(executionResult.error.message);
        }

        if (executionResult.info) {
          return consola.info(executionResult.info);
        }

        consola.success(
          `Loaded fixture (took ${executionResult.executionTimeInMs} ms) `
        );
      },
      beforeLoadFixture: (fixtureName: string) => {
        consola.info(`Loading fixture ${fixtureName}`);
      },
      beforeLoadFixtureTenant: (tenantId, tenantName) => {
        consola.info(
          `Load fixture for tenant ${bold(tenantId)} (${tenantName})`
        );
      },
      onTenantLoadFixturesFinished() {
        consola.log('\n');
      },
    };

    /**
     * User want to load fixtures for only a specific tenant
     */
    if (databaseConfig.isSingleConnection === false && tenantId) {
      const client = await MultiConnectionClient.getInstance(
        databaseConfig
      ).connect(tenantId);

      return await loadFixtures(
        databaseConfig,
        projectRootDir,
        client,
        callbacks
      );
    }

    /**
     * User want to load fixtures for a single connection
     */
    if (databaseConfig.isSingleConnection === true) {
      const client = await SingleConnectionClient.getInstance(
        databaseConfig
      ).connect();

      return await loadFixtures(
        databaseConfig,
        projectRootDir,
        client,
        callbacks
      );
    }

    /**
     * User want to load fixtures for a multi connection
     */
    if (databaseConfig.isSingleConnection === false) {
      return await loadFixturesMulticonnection(
        databaseConfig,
        projectRootDir,
        callbacks
      );
    }

    throw new Error('Unhandled combination of parameters');
  },
});
