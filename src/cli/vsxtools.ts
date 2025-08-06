#!/usr/bin/env node
import { program } from 'commander'
import { runNew } from './new.js'
import { runAdd } from './add.js'

const vsxtoolsCommands: {
    name: string
    description: string
    action: (...args: any[]) => void
    options?: [string, string, (string | boolean | string[])?][]
}[] = [
    { name: 'new [dir]', description: 'Create a new extension', action: runNew },
    { name: 'run', description: 'Run a configuration', action: runNew },
    {
        name: 'add <item> [dir]',
        description: 'Add files or products to a project',
        action: runAdd,
        options: [['--overwrite', 'Overwrite files if they exist', false]],
    },
    { name: 'pack', description: 'Package an extension', action: runNew },
    { name: 'install', description: 'Package and install an extension', action: runNew },
]

for (const { name, description, action, options } of vsxtoolsCommands) {
    const cmd = program.command(name).description(description).action(action)
    if (options) for (const opt of options) cmd.option(...opt)
}
program.parse()
