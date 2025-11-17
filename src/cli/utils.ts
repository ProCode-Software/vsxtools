import { Product } from '$/vsxtools'
import { join, parse } from 'path'
import { styleText } from 'util'

export const __assetDir = join(import.meta.dirname, '../../assets')

export function success(text: string) {
    console.log(green(text))
}

export function error(text: string, exit: boolean = true) {
    console.log(red(text))
    if (exit) process.exit(1)
}

export function initWorker(filePath: string): URL {
    return new URL(`./workers/${filePath}.js`, import.meta.url)
}

export interface GrammarWorkerParams {
    srcPath: string
    outPath: string
    watch: boolean
    indent: number
}

export function getJSONOutFile({ outputDir, outputFile }: Product, file: string): string {
    if (outputDir && outputFile) error(`Can't have both 'outputDir' and 'outputFile'`)
    const { name } = parse(file)
    if (outputDir) return join(outputDir, name + '.json')
    if (outputFile) return outputFile.replaceAll('[name]', name)
    return name + '.json'
}

export type Resolver = (path: string) => string

const styled = (color: any, text: string) =>
    styleText(color, text, { validateStream: false })

export const green = (text: string) => styled('green', text)
export const yellow = (text: string) => styled('yellow', text)
export const red = (text: string) => styled('red', text)
export const blue = (text: string) => styled('blue', text)
export const magenta = (text: string) => styled('magenta', text)
export const cyan = (text: string) => styled('cyan', text)
export const black = (text: string) => styled('black', text)
export const bold = (text: string) => styled('bold', text)
export const dim = (text: string) => styled('dim', text)
export const white = (text: string) => styled('white', text)
