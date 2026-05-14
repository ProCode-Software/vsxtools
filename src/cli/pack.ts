import {
    ExtensionContext,
    getDefaultVSIXName,
    getExtensionFiles,
    parseExtensionManifest,
    writeVSIX,
} from '#lib/api/vsix.ts'
import { spawn } from 'node:child_process'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { styleText } from 'node:util'
import { bold, cyan, green } from './utils/cli.ts'

function getExtensionContext(dir?: string): ExtensionContext {
    const cwd = dir || process.cwd()
    const manifest = parseExtensionManifest(
        readFileSync(join(cwd, 'package.json'), 'utf-8')
    )
    return { cwd, manifest }
}

interface PackOptions {
    output?: string
}

export const packOptions = [
    ['-o, --output <path>', 'File or folder to write the .vsix to', undefined],
] satisfies [string, string, any][]

export async function runPack(dir: string | undefined, opts: PackOptions) {
    const ctx = getExtensionContext(dir)
    const { cwd } = ctx
    const files = getExtensionFiles(ctx)

    showFiles(cwd, files)

    const isDirOutput =
        opts.output && existsSync(opts.output) && statSync(opts.output).isDirectory()
    const vsixPath =
        !opts.output || isDirOutput
            ? join(opts.output || cwd, getDefaultVSIXName(ctx.manifest))
            : opts.output

    await writeVSIX(ctx, vsixPath, files)
    console.log(
        green('\nSuccessfully packaged extension to'),
        cyan(vsixPath) + green('!')
    )
}

const stripDot = (path: string) => path.replace(/^\.[\\/]/, '')

export async function runListFiles(dir: string | undefined, { text }: { text: boolean }) {
    const ctx = getExtensionContext(dir)
    const files = getExtensionFiles(ctx)

    // Print plain text
    if (text) {
        console.log(files.sort().map(stripDot).join('\n'))
        return
    }
    // Show a tree
    showFiles(ctx.cwd, files)
}

/**
 * Prints a tree of `files` to the console
 */
async function showFiles(cwd: string, files: string[]) {
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
