import { defaultIgnore } from '#vendor/ignore.js'
import type { ManifestPackage } from '#vendor/manifest.js'
import AdmZip from 'adm-zip'
import { globSync, statSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { parseJSONC } from '../../cli/utils/jsonc.ts'
import type { Extension } from './extension.ts'

/**
 * Returns the files included in the extension, as defined by `ctx.manifest.files` and `.vscodeignore`
 */
export function getExtensionFiles(ext: Extension): string[] {
    const { cwd, manifest } = ext
    const files: Set<string> = new Set()

    // globSync.exclude doesn't support `!...` patterns.
    // Move them into their own array that is included manually.
    const include: string[] = []
    const exclude = ext.getIgnorePatterns().filter(pat => {
        let count = 0
        for (const x of pat) {
            if (x != '!') break
            count++
        }
        if (count % 2 == 1) {
            include.push(pat.slice(count))
            return false
        }
        return true
    })
    exclude.push(...defaultIgnore)

    for (const pattern of manifest.files ?? ['**']) {
        collectFiles(globSync(pattern, { cwd, exclude }))
        // In case `pattern` is a directory
        // collectFiles(globSync(pattern + '/**', { cwd, exclude }))
    }

    // Include files
    collectFiles(globSync(include, { cwd }))

    /** Adds all files that aren't directories from `results` to `files`. */
    function collectFiles(results: string[]) {
        for (const item of results) {
            if (!statSync(join(cwd, item)).isDirectory()) {
                files.add(item)
            }
        }
    }
    return Array.from(files)
}

/** Parses a VSCode extension manifest (`package.json`). JSONC is supported. */
export function parseExtensionManifest(s: string): ManifestPackage {
    return parseJSONC(s) as ManifestPackage
    // TODO: Validate the package.json based on:
    // https://github.com/microsoft/vscode-vsce/blob/main/src/package.ts#L1313
}

/** Bundles the extension's files into a .vsix package */
export async function writeVSIX(ext: Extension, outPath: string) {
    const zip = new AdmZip()
    for (const file of ext.getFiles()) {
        zip.addLocalFile(
            join(ext.cwd, file),
            join('extension', dirname(file)),
            basename(file)
        )
    }
    await zip.writeZipPromise(outPath, { overwrite: true })
}
