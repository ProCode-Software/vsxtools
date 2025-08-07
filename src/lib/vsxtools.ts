import type { ExtensionConfig } from '$/vsxtools'

/**
 * Returns the config passed. The purpose of this function is to enable type-checking
 * for `vsxtools.config.js` files.
 */
export function defineConfig(config: ExtensionConfig): ExtensionConfig {
    return config
}

