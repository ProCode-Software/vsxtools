import { type RunContext } from '../utils/cli.ts'
import { getOutFile } from '../utils/path.ts'
import { Worker } from '../utils/worker.ts'
import { type GrammarWorkerParams } from '../workers/params.ts'

export async function run(ctx: RunContext) {
    const worker = new Worker<GrammarWorkerParams>('Grammar Worker', 'grammarWorker')

    for (const input of ctx.product.inputs) {
        worker.run({
            srcPath: ctx.resolve(input),
            outPath: ctx.resolve(getOutFile(ctx.product, input)),
            watch: ctx.config.watch ?? false,
            indent: ctx.config.jsonIndent ?? 0,
        })
    }
}
