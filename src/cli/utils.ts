import { Product } from '$/vsxtools'
import ansiColors from 'ansi-colors'
import { join, parse } from 'path'

export const __assetDir = join(import.meta.dirname, '../../assets')

export function success(text: string) {
    console.log(ansiColors.green(text))
}

export function error(text: string, exit?: boolean) {
    console.log(ansiColors.red(text))
    if (exit) process.exit(1)
}

export function initWorker(filePath: string): URL {
    return new URL(`./workers/${filePath}.json`, import.meta.url)
}

export interface GrammarWorkerParams {
    srcPath: string
    outPath: string
    watch: boolean
}

export function getJSONOutFile({ outputDir, outputFile }: Product, file: string): string {
    if (outputDir && outputFile) error(`Can't have both 'outputDir' and 'outputFile'`)
    const { name } = parse(file)
    if (outputDir) return join(outputDir, name + '.json')
    if (outputFile) return outputFile.replaceAll('[name]', name)
    return name + '.json'
}

export type Resolver = (path: string) => string
