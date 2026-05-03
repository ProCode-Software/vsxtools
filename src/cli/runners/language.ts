import { ExtensionConfig, Product } from '$/vsxtools/vsxtools'
import { Worker } from 'worker_threads'
import { getJSONOutFile, GrammarWorkerParams, initWorker, Resolver } from '../utils.ts'

export async function run(product: Product, resolve: Resolver, config: ExtensionConfig) {
    const workerPath = initWorker('grammarWorker')
    for (const input of product.inputs) {
        new Worker(workerPath, {
            name: 'Grammar Worker',
            workerData: {
                srcPath: resolve(input),
                outPath: resolve(getJSONOutFile(product, input)),
                watch: config.watch ?? false,
                indent: config.jsonIndent ?? 0,
            } satisfies GrammarWorkerParams,
        })
    }
}
