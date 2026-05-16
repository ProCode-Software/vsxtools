import type { ManifestPackage } from '#/vendor/manifest.ts'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getExtensionFiles, parseExtensionManifest, writeVSIX } from './vsix.ts'

export class Extension {
    public cwd: string
    public manifest: ManifestPackage
    #files: string[] | undefined // Cached files

    public constructor(cwd: string) {
        this.cwd = cwd
        this.manifest = parseExtensionManifest(
            readFileSync(join(cwd, 'package.json'), 'utf-8')
        )
    }

    /**
     * Returns an `Extension` for the `dir` parameter or the current working directory.
     */
    public static fromCwd(dir?: string): Extension {
        return new Extension(dir || process.cwd())
    }

    // VSIX
    // ==========

    /**
     * Returns the files included in the extension, as defined by
     * `devDependencies` and `files` in the extension's manifest
     * and a `.vscodeignore` file if found.
     */
    public getFiles(): string[] {
        return (this.#files ??= getExtensionFiles(this))
    }

    /**
     * Returns the patterns of files to not be included in the bundle
     * as defined by `.vscodeignore` and the manifest's `devDependencies`
     * @see https://code.visualstudio.com/api/working-with-extensions/publishing-extension#using-.vscodeignore
     */
    public getIgnorePatterns(): string[] {
        const ignored: string[] = []
        // Read .vscodeignore
        const ignoreFile = join(this.cwd, '.vscodeignore')
        if (existsSync(ignoreFile)) {
            for (let line of readFileSync(ignoreFile, 'utf-8').split(/\r?\n/g)) {
                if ((line = line.trim())) ignored.push(line)
            }
        }
        // Exclude dev dependencies: https://code.visualstudio.com/api/working-with-extensions/publishing-extension#using-.vscodeignore
        for (const dep in this.manifest.devDependencies) {
            ignored.push(`node_modules/${dep}/**`)
        }
        return ignored
    }

    /** Returns the default name of the extension's .vsix file */
    public getDefaultVSIXName(): string {
        return `${this.manifest.name}-${this.manifest.version}.vsix`
    }

    /** Bundles the extension's files into a .vsix package */
    public writeVSIX(outPath: string) {
        return writeVSIX(this, outPath)
    }
}
