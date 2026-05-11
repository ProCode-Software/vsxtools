import type { ManifestPackage } from '$vendor/manifest.js'
import { JSONC } from 'bun'

export function parseExtensionManifest(s: string): ManifestPackage {
    return JSONC.parse(s) as ManifestPackage
    // TODO: Validate the package.json based on:
    // https://github.com/microsoft/vscode-vsce/blob/main/src/package.ts#L1313
}
