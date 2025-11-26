import { ExtensionConfig } from '$/vsxtools/vsxtools'
import { existsSync } from 'fs'
import { dirname, join } from 'path'
import { error } from './utils.ts'

export interface ResolvedConfig {
    config: ExtensionConfig
    resolve(path: string): string
}

export async function resolveConfig(graceful: true): Promise<ResolvedConfig | undefined>
export async function resolveConfig(graceful?: false | undefined): Promise<ResolvedConfig>
export async function resolveConfig(
    graceful?: boolean
): Promise<ResolvedConfig | undefined> {
    let currentDir = process.cwd()
    const makeResolved = async (path: string): Promise<ResolvedConfig> => {
        const { default: config = error(`Invalid configuration in '${path}'`) } =
            await import(path)
        return { config, resolve: (file: string) => join(currentDir, file) }
    }
    while (true) {
        let baseConfigPath = join(currentDir, 'vsxtools.config')
        let configPath: string
        if (
            existsSync((configPath = baseConfigPath + '.ts')) ||
            existsSync((configPath = baseConfigPath + '.js'))
        ) {
            return await makeResolved(configPath)
        }
        // Backup if not found
        const parentDir = dirname(currentDir)
        if (parentDir === currentDir) break
        currentDir = parentDir
    }
    if (graceful) return undefined
    error(
        `Couldn't find 'vsxtools.config.js' or 'vsxtools.config.ts' in the current directory or any parent directory`
    )
    process.exit(1)
}
