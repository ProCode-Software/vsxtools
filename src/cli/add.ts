import { copyFileSync, existsSync } from 'fs'
import { join, resolve } from 'path'
import { cwd } from 'process'
import { error, success } from './utils/cli.ts'
import { __assetDir } from './utils/path.ts'

export function runAdd(
    kind: string,
    dir: string = cwd(),
    { overwrite }: { overwrite: boolean }
) {
    console.log(kind, dir)
    switch (kind.toLowerCase()) {
        case 'prettier':
        case 'prettier-config':
            addPrettier(dir, overwrite)
            break
    }
}

function checkIfExists(file: string, overwrite: boolean): boolean {
    if (existsSync(file) && !overwrite) {
        error(
            `Output file '${file}' already exists. Use '--overwrite' to replace this file.`
        )
        return false
    }
    return true
}

function addPrettier(dir: string, overwrite: boolean) {
    const prettierConfPath = join(__assetDir, 'prettierrc')
    const outFile = resolve(dir, '.prettierrc')
    if (!checkIfExists(outFile, overwrite)) return
    copyFileSync(prettierConfPath, outFile)
    success(`Added prettier config to '${outFile}'`)
}
