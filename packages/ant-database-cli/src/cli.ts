import mri from 'mri';
import { red } from 'colorette';
import type { ConsolaReporter } from 'consola';
import consola from 'consola';
import { checkEngines } from './cli/utils/engines';
import type { Command, AntDbCommand } from './cli/commands';
import { commands } from './cli/commands';
import { showHelp } from './cli/utils/help';

// TODO:: remove vue warnings and not used code
async function _main() {
  const _argv = process.argv.slice(2);
  const args = mri(_argv, {
    boolean: ['no-clear'],
  });
  // @ts-ignore
  const command = args._.shift() || 'usage';

  if (!(command in commands)) {
    console.log('\n' + red('Invalid command ' + command));

    await commands.usage().then((r) => r.invoke());
    process.exit(1);
  }

  // Check Node.js version in background
  setTimeout(() => {
    checkEngines().catch(() => {});
  }, 1000);

  // @ts-ignore
  const cmd = (await commands[command as Command]()) as AntDbCommand;

  if (args.h || args.help) {
    showHelp(cmd.meta);
  } else {
    const result = await cmd.invoke(args);
    return result;
  }
}

// Wrap all console logs with consola for better DX
consola.wrapAll();

// Filter out unwanted logs
// TODO: Use better API from consola for intercepting logs
const wrapReporter = (reporter: ConsolaReporter) =>
  <ConsolaReporter>{
    log(logObj, ctx) {
      if (!logObj.args || !logObj.args.length) {
        return;
      }
      const msg = logObj.args[0];
      if (typeof msg === 'string' && !process.env.DEBUG) {
        // Hide vue-router 404 warnings
        if (
          msg.startsWith(
            '[Vue Router warn]: No match found for location with path'
          )
        ) {
          return;
        }
        // Hide sourcemap warnings related to node_modules
        if (msg.startsWith('Sourcemap') && msg.includes('node_modules')) {
          return;
        }
      }
      return reporter.log(logObj, ctx);
    },
  };
// @ts-expect-error
consola._reporters = consola._reporters.map(wrapReporter);

process.on('unhandledRejection', (err) =>
  consola.error('[unhandledRejection]', err)
);
process.on('uncaughtException', (err) =>
  consola.error('[uncaughtException]', err)
);

export function main() {
  _main()
    .then((result) => {
      if (result === 'error') {
        process.exit(1);
      } else if (result !== 'wait') {
        process.exit(0);
      }
    })
    .catch((error) => {
      consola.error(error);
      process.exit(1);
    });
}
