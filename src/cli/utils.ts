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

export const green = (text: string) => styleText('green', text)
export const yellow = (text: string) => styleText('yellow', text)
export const red = (text: string) => styleText('red', text)
export const blue = (text: string) => styleText('blue', text)
export const magenta = (text: string) => styleText('magenta', text)
export const cyan = (text: string) => styleText('cyan', text)
export const black = (text: string) => styleText('black', text)
export const bold = (text: string) => styleText('bold', text)
export const dim = (text: string) => styleText('dim', text)
export const white = (text: string) => styleText('white', text)
