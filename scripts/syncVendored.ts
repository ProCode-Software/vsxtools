import { join } from 'path'

// Manifest declarations
const manifestURL =
    'https://raw.githubusercontent.com/microsoft/vscode-vsce/refs/heads/main/src/manifest.ts'
Bun.write(
    join(import.meta.dirname, '../assets/vendor/manifest.ts'),
    await fetch(manifestURL)
)
