import { cyan, magenta } from 'colorette'
import type { AntDbCommandMeta } from '../commands'

export function showHelp (meta?: Partial<AntDbCommandMeta>) {
  const sections: string[] = []

  if (meta) {
    if (meta.usage) {
      sections.push(magenta('> ') + 'Usage: ' + cyan(meta.usage))
    }

    if (meta.description) {
      sections.push(magenta('⋮ ') + meta.description)
    }
  }

  sections.push(`Use ${cyan('npx ant-db [command] --help')} to see help for each command`)

  console.log(sections.join('\n\n') + '\n')
}