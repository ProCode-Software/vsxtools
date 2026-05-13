import type { ManifestPackage } from '#vendor/manifest.js'
import { existsSync, globSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { parseJSONC } from '../../cli/utils/jsonc.ts'

export interface ExtensionContext {
    manifest: ManifestPackage
    cwd: string
}

/**
 * Returns the files included in the extension, as defined by `ctx.manifest.files` and `.vscodeignore`
 */
export function getExtensionFiles(ctx: ExtensionContext): string[] {
    const { cwd, manifest } = ctx
    const files: Set<string> = new Set()

    // globSync.exclude doesn't support `!...` patterns.
    // Move them into their own array that is included manually.
    const include: string[] = []
    const exclude = getIgnoredFiles(ctx).filter(pat => {
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

    for (const pattern of manifest.files ?? ['./**']) {
        collectFiles(globSync(pattern, { cwd, exclude }))
        // In case `pattern` is a directory
        collectFiles(globSync(pattern + '/**', { cwd, exclude }))
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

/**
 * Returns the patterns of ignored files as defined by `.vscodeignore`
 * and the manifest's `devDependencies`
 * @see https://code.visualstudio.com/api/working-with-extensions/publishing-extension#using-.vscodeignore
 */
export function getIgnoredFiles({ cwd, manifest }: ExtensionContext): string[] {
    const ignored: string[] = []
    // Read .vscodeignore
    const ignoreFile = join(cwd, '.vscodeignore')
    if (existsSync(ignoreFile)) {
        for (const line of readFileSync(ignoreFile, 'utf-8').split(/\r?\n/g)) {
            if (line.trim()) ignored.push(line)
        }
    }
    // Exclude dev dependencies: https://code.visualstudio.com/api/working-with-extensions/publishing-extension#using-.vscodeignore
    for (const dep in manifest.devDependencies) {
        ignored.push(`node_modules/${dep}/**`)
    }
    return ignored
}

/** Parses a VSCode extension manifest (`package.json`). JSONC is supported. */
export function parseExtensionManifest(s: string): ManifestPackage {
    return parseJSONC(s) as ManifestPackage
    // TODO: Validate the package.json based on:
    // https://github.com/microsoft/vscode-vsce/blob/main/src/package.ts#L1313
}
