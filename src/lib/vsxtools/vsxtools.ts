import type { Config } from './types.ts'

/**
 * Returns the config passed. The purpose of this function is to enable type-checking
 * for `vsxtools.config.js` files.
 */
export function defineConfig(config: Config): Config {
    return config
}

export * from './types.ts'
