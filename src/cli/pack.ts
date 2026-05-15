import { Extension } from '#lib/api/extension.ts'
import { getExtensionFiles } from '#lib/api/vsix.ts'
import { spawn } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { styleText } from 'node:util'
import { bold, cyan, green } from './utils/cli.ts'

interface PackOptions {
    output?: string
}

export const packOptions = [
    ['-o, --output <path>', 'File or folder to write the .vsix to', undefined],
] satisfies [string, string, any][]

export async function runPack(dir: string | undefined, opts: PackOptions) {
    const ext = Extension.fromCwd(dir)
    const { cwd } = ext

    showFiles(ext)

    const isDirOutput =
        opts.output && existsSync(opts.output) && statSync(opts.output).isDirectory()
    const vsixPath =
        !opts.output || isDirOutput
            ? join(opts.output || cwd, ext.getDefaultVSIXName())
            : opts.output

    await ext.writeVSIX(vsixPath)

    console.log(
        green('\nSuccessfully packaged extension to'),
        cyan(vsixPath) + green('!')
    )
}

const stripDot = (path: string) => path.replace(/^\.[\\/]/, '')

export async function runListFiles(dir: string | undefined, { text }: { text: boolean }) {
    const ext = Extension.fromCwd(dir)
    const files = getExtensionFiles(ext)

    // Print plain text
    if (text) {
        console.log(files.sort().map(stripDot).join('\n'))
        return
    }
    // Show a tree
    showFiles(ext)
}

/**
 * Prints a tree of `files` to the console
 */
async function showFiles(ext: Extension) {
    const { cwd } = ext
    const files = ext.getFiles()

    console.log(
        bold('Extension files in'),
        styleText(['bold', 'magenta'], cwd) + bold(':')
    )
    await new Promise<void>((resolve, reject) => {
        // Print tree using builtin `tree` command, if found
        const cmd = spawn(
            'tree',
            ['--noreport', '--filelimit', '60', '-L', '10', '--fromfile'],
            { stdio: ['pipe', 'inherit', 'inherit'], cwd }
        )
        cmd.on('error', reject)
        cmd.on('close', code => (code === 0 ? resolve() : reject()))
        for (const file of files) {
            cmd.stdin.write(stripDot(file) + '\n')
        }
        cmd.stdin.end()
    }).catch(e => {
        if ((e as { code?: string }).code != 'ENOENT') throw e
        // Fallback to plain file listing
        for (const file of files.sort()) {
            console.log(cyan(stripDot(file)))
        }
    })
}

export function runInstall() {}
