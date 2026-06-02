import { type RunContext } from '../utils/cli.ts'
import { ioPairs } from '../utils/path.ts'
import { Worker } from '../utils/worker.ts'
import type { ColorThemeWorkerParams } from '../workers/params.ts'

export async function run({ resolve, config, product }: RunContext<'color-theme'>) {
    const worker = new Worker<ColorThemeWorkerParams>('Color Theme', 'colorTheme')

    for (const [input, output] of ioPairs(product)) {
        worker.run({
            srcPath: resolve(input),
            outPath: resolve(output),
            watch: config.watch,
            indent: config.jsonIndent,
            variablePrefix: product.variablePrefix,
            sortFile: product.sortFile,
            ...(product.variables && 'path' in product.variables
                ? { variablesFile: resolve(product.variables.path) }
                : { variablesKey: product.variables?.variablesKey }),
        })
    }
}
