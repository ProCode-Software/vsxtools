import { Worker } from 'worker_threads'
import { resolveConfig } from './config.js'
import { error, getJSONOutFile, GrammarWorkerParams, initWorker, Resolver } from './utils.js'
import { Product } from '$/vsxtools'

let watch: boolean

export async function runRun(item: string = 'default') {
    const { config, resolve } = await resolveConfig()
    const product = config.configurations[item]
    if (!product) error(`Can't find configuration named '${item}'`)
    if (!product.inputs || !product.inputs.length) error(`No inputs provided`)
    watch = config.watch ?? false
    switch (product.type) {
        case 'language':
            runGrammarConfig(product, resolve)
            break
        default:
            error(`Invalid configuration type '${product.type}'`)
    }
}

async function runGrammarConfig(product: Product, resolve: Resolver) {
    const workerPath = initWorker('./grammarWorker')
    for (const input of product.inputs) {
        new Worker(workerPath, {
            name: 'Grammar Worker',
            workerData: {
                srcPath: resolve(input),
                outPath: resolve(getJSONOutFile(product, input)),
                watch,
            } satisfies GrammarWorkerParams,
        })
    }
}
