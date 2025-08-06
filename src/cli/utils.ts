import ansiColors from 'ansi-colors'
import { join } from 'path'

export const __assetDir = join(import.meta.dirname, '../../assets')

export function success(text: string) {
    console.log(ansiColors.green(text))
}

export function error(text: string, exit?: boolean) {
    console.log(ansiColors.red(text))
    if (exit) process.exit(1)
}
