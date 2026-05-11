import { resolveConfig } from './config.ts'
import * as colorTheme from './runners/colorTheme.ts'
import * as language from './runners/language.ts'
import { error, RunContext } from './utils/cli.ts'

export async function runRun(item: string = 'default') {
    const { config, resolve } = await resolveConfig()
    const product = config.configurations[item]
    if (!product) {
        error(`Can't find configuration named '${item}'`)
    } else if (!product.inputs || !product.inputs.length) {
        error(`No inputs provided`)
    }
    const ctx: RunContext = { config, resolve, product }

    switch (product.type) {
        case 'language':
            await language.run(ctx)
            break
        case 'color-theme':
            await colorTheme.run(ctx)
            break
        default:
            error(`Invalid configuration type '${product.type}'`)
    }
}
