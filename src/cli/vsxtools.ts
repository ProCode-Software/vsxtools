#!/usr/bin/env node
import { program } from 'commander'

import { runNew } from './new.ts'
import { runAdd } from './add.ts'
import { runRun } from './run.ts'
import { runInstall, runPack, runListFiles, packOptions } from './pack.ts'

const vsxtoolsCommands: {
    name: string
    description: string
    action: (...args: any[]) => void
    options?: [string, string, (string | boolean | string[])?][]
    aliases?: string[]
}[] = [
    { name: 'new [dir]', description: 'Create a new extension', action: runNew },
    {
        name: 'run [configuration]',
        description: 'Run a configuration',
        action: runRun,
        aliases: ['r'],
    },
    {
        name: 'add <item> [dir]',
        description: 'Add files or products to a project',
        action: runAdd,
        options: [['--overwrite', 'Overwrite files if they exist', false]],
    },
    {
        name: 'pack [dir]',
        description: 'Package an extension',
        action: runPack,
        aliases: ['package'],
        options: packOptions,
    },
    {
        name: 'install',
        description: 'Package and install an extension',
        action: runInstall,
    },
    {
        name: 'list-files [dir]',
        description: 'List all files that will be included in an extension',
        action: runListFiles,
        aliases: ['ls-files', 'lsf'],
        options: [['--text', 'Print files separated by newlines', false]],
    },
]

for (const { name, description, action, options, aliases } of vsxtoolsCommands) {
    const cmd = program.command(name).description(description).action(action)
    if (options) {
        for (const opt of options) cmd.option(...opt)
    }
    if (aliases) {
        for (const alias of aliases) cmd.alias(alias)
    }
}
program.parse()
