import { Worker } from 'worker_threads'
import { resolveConfig } from './config.ts'
import {
    error,
    getJSONOutFile,
    GrammarWorkerParams,
    initWorker,
    Resolver,
} from './utils.ts'
import { ExtensionConfig, Product } from '$/vsxtools/vsxtools'

let config: ExtensionConfig

export async function runRun(item: string = 'default') {
    const { config: c, resolve } = await resolveConfig()
    config = c
    const product = c.configurations[item]
    if (!product) error(`Can't find configuration named '${item}'`)
    if (!product.inputs || !product.inputs.length) error(`No inputs provided`)

    switch (product.type) {
        case 'language':
            runGrammarConfig(product, resolve)
            break
        default:
            error(`Invalid configuration type '${product.type}'`)
    }
}

async function runGrammarConfig(product: Product, resolve: Resolver) {
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
