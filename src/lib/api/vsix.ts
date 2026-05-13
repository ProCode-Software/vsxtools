import type { ManifestPackage } from '#vendor/manifest.js'
// import { JSONC } from 'bun'
const JSONC = JSON
import { existsSync, globSync, readFileSync, stat, statSync } from 'node:fs'
import { join } from 'node:path'

export interface ExtensionContext {
    manifest: ManifestPackage
    cwd: string
}

export function getExtensionFiles(ctx: ExtensionContext): string[] {
    const { cwd, manifest } = ctx
    const files: Set<string> = new Set()

    // globSync.exclude doesn't support `!...` patterns
    const include: string[] = []
    const exclude = getIgnoredFiles(ctx).filter(pat => {
        let count = 0
        for (const x of pat) {
            if (x != '!') break
            count++
        }
        if (count > 0) {
            include.push(pat.slice(count))
            return false
        }
        return true
    })

    for (const pattern of manifest.files ?? ['./**']) {
        collectFiles(globSync(pattern, { cwd, exclude }))
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

function getIgnoredFiles({ cwd, manifest }: ExtensionContext): string[] {
    const ignored: string[] = []
    // Read .vscodeignore
    const vscodeIgnorePath = join(cwd, '.vscodeignore')
    if (existsSync(vscodeIgnorePath)) {
        for (const line of readFileSync(vscodeIgnorePath, 'utf-8').split(/\r?\n/g)) {
            if (line.trim()) ignored.push(line)
        }
    }
    // Exclude dev dependencies: https://code.visualstudio.com/api/working-with-extensions/publishing-extension#using-.vscodeignore
    ignored.push(
        ...Object.keys(manifest.devDependencies ?? {}).map(dep => `node_modules/${dep}/`)
    )
    return ignored
}

export function parseExtensionManifest(s: string): ManifestPackage {
    return JSONC.parse(s) as ManifestPackage
    // TODO: Validate the package.json based on:
    // https://github.com/microsoft/vscode-vsce/blob/main/src/package.ts#L1313
}
