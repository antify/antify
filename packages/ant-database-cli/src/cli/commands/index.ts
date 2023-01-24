import type { Argv } from 'mri';

const _rDefault = (r: any) => r.default || r;

export const commands = {
  // Migrate down
  status: () => import('./status').then(_rDefault),
  migrate: () => import('./migrate').then(_rDefault),
  make: () => import('./make').then(_rDefault),
  usage: () => import('./usage').then(_rDefault),
};

export type Command = keyof typeof commands;

export interface AntDbCommandMeta {
  name: string;
  usage: string;
  description: string;
  [key: string]: any;
}

export type CLIInvokeResult = void | 'error' | 'wait';

export interface AntDbCommand {
  invoke(args: Argv): Promise<CLIInvokeResult> | CLIInvokeResult;
  meta: AntDbCommandMeta;
}

export function defineAntDbCommand(command: AntDbCommand): AntDbCommand {
  return command;
}
