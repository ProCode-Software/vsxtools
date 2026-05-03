import { resolveConfig } from './config.ts'
import * as language from './runners/language.ts'
import { error } from './utils.ts'

export async function runRun(item: string = 'default') {
    const { config, resolve } = await resolveConfig()
    const product = config.configurations[item]
    if (!product) error(`Can't find configuration named '${item}'`)
    if (!product.inputs || !product.inputs.length) error(`No inputs provided`)

    switch (product.type) {
        case 'language':
            language.run(product, resolve, config)
            break
        default:
            error(`Invalid configuration type '${product.type}'`)
    }
}
