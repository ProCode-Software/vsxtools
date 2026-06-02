import { readdirSync, statSync } from 'fs'
import { relative } from 'node:path'
import { join, parse } from 'path'
import * as cli from './cli.ts'
import { type Product } from '#lib/vsxtools/vsxtools.ts'

export type Resolver = (path: string) => string

export const __assetDir = join(import.meta.dirname, '../../assets')

export const shortPath = (p: string) => relative(process.cwd(), p)

/** Returns an iterator that yields the inputs and outputs in the product */
export function* ioPairs(
    { outputDir, outputFile, inputs, name }: Product,
    outputExt: string = 'json'
): Generator<[string, string]> {
    if (outputDir && outputFile) {
        cli.error(`Can't have both 'outputDir' and 'outputFile' in product ${name}`)
    }
    if (typeof inputs == 'string') inputs = [inputs] // `inputs` is a single string

    for (const [i, file] of inputs.entries()) {
        // An input may be a directory
        const files = statSync(file).isDirectory()
            ? readdirSync(file).map(f => join(file, f))
            : [file]

        for (const file of files) {
            const { name } = parse(file)
            if (outputDir) {
                yield [file, join(outputDir, `${name}.${outputExt}`)]
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
            yield [file, `${name}.${outputExt}`]
        }
    }
}
