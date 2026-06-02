import { join, parse } from 'path'
import * as cli from './cli.ts'
import { type Product } from '#lib/vsxtools/vsxtools.ts'

export type Resolver = (path: string) => string

export const __assetDir = join(import.meta.dirname, '../../assets')

/** Returns an iterator that yields the inputs and outputs in the product */
export function* ioPairs(
    { outputDir, outputFile, inputs, name }: Product,
    outputExt: string = 'json'
): Generator<[string, string]> {
    if (outputDir && outputFile) {
        cli.error(`Can't have both 'outputDir' and 'outputFile' in product ${name}`)
    }
    // inputs is a single string
    if (typeof inputs == 'string') {
        if (outputFile) return [inputs, outputFile]
        inputs = [inputs]
    }
    for (const [i, file] of inputs.entries()) {
        const { name } = parse(file)
        if (outputDir) {
            yield [file, join(outputDir, name + '.' + outputExt)]
            continue
        }
        if (outputFile) {
            if (typeof outputFile == 'string') {
                yield [file, outputFile.replaceAll('[name]', name)]
                continue
            }
            // outputFile is an array
            if (outputFile.length != inputs.length) {
                cli.error(`'inputs' and 'outputFile' must have the same length`)
            }
            yield [file, outputFile[i]]
            continue
        }
        yield [file, name + '.' + outputExt]
    }
}
