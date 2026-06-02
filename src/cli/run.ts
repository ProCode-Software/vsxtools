import { resolveConfig } from './config.ts'
import * as colorTheme from './runners/colorTheme.ts'
import * as language from './runners/language.ts'
import { error } from './utils/cli.ts'

interface RunFlags {
    watch?: boolean
}

export async function runRun(item: string = 'default', options: RunFlags) {
    const { watch } = options
    const { config, resolve } = await resolveConfig()
    const product = config.configurations[item]
    if (!product) {
        error(`Can't find configuration named '${item}'`)
    } else if (!product.inputs || !product.inputs.length) {
        error(`No inputs provided in configuration '${item}'`)
    }
    if (watch !== undefined) config.watch = watch

    switch (product.type) {
        case 'language':
            return await language.run({ config, resolve, product })
        case 'color-theme':
            return await colorTheme.run({ config, resolve, product })
        default:
            error(`Invalid configuration type '${product.type}'`)
    }
}
