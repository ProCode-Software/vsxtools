import { Product } from '$lib/vsxtools/vsxtools'
import { error } from 'console'
import { join, parse } from 'path'
import { green } from './cli.ts'

export type Resolver = (path: string) => string

export const __assetDir = join(import.meta.dirname, '../../assets')

export function getOutFile(
    { outputDir, outputFile }: Product,
    file: string,
    ext: string = 'json'
): string {
    if (outputDir && outputFile) error(`Can't have both 'outputDir' and 'outputFile'`)
    const { name } = parse(file)
    if (outputDir) return join(outputDir, name + '.' + ext)
    if (outputFile) return outputFile.replaceAll('[name]', name)
    return name + '.' + ext
}
