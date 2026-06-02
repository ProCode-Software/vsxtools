import { type RunContext } from '../utils/cli.ts'
import { ioPairs } from '../utils/path.ts'
import { Worker } from '../utils/worker.ts'
import type { GrammarWorkerParams } from '../workers/params.ts'

export async function run({ resolve, config, product }: RunContext) {
    const worker = new Worker<GrammarWorkerParams>('Grammar Worker', 'grammar')

    for (const [input, output] of ioPairs(product)) {
        worker.run({
            srcPath: resolve(input),
            outPath: resolve(output),
            watch: config.watch,
            indent: config.jsonIndent,
        })
    }
}
