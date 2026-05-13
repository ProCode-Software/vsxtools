import { getExtensionFiles, parseExtensionManifest } from '#lib/api/vsix'
import { ManifestPackage } from '#vendor/manifest.js'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { styleText } from 'node:util'
import { bold, cyan } from './utils/cli.ts'

export async function runListFiles(dir: string | undefined) {
    const cwd = dir || process.cwd()
    const manifest = parseExtensionManifest(
        readFileSync(join(cwd, 'package.json'), 'utf-8')
    )
    const files = getExtensionFiles({ cwd, manifest: manifest as ManifestPackage })
    console.log(
        bold('Extension files in'),
        styleText(['bold', 'magenta'], cwd) + bold(':')
    )
    for (const file of files.sort()) console.log(cyan(file))
}
