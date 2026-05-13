import {
    ExtensionContext,
    getExtensionFiles,
    parseExtensionManifest,
} from '#lib/api/vsix'
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { styleText } from 'node:util'
import { bold, cyan } from './utils/cli.ts'

function getExtensionContext(dir?: string): ExtensionContext {
    const cwd = dir || process.cwd()
    const manifest = parseExtensionManifest(
        readFileSync(join(cwd, 'package.json'), 'utf-8')
    )
    return { cwd, manifest }
}

export function runPack() {}

export function runInstall() {}

export async function runListFiles(dir: string | undefined, { text }: { text: boolean }) {
    const ctx = getExtensionContext(dir)
    const { cwd } = ctx
    const files = getExtensionFiles(ctx)
    const stripDot = (path: string) => path.replace(/^\.[\\/]/, '')

    // Print plain text
    if (text) {
        console.log(files.sort().map(stripDot).join('\n'))
        return
    }

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
