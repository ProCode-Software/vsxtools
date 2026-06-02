export interface JSONWorkerParams {
    srcPath: string
    outPath: string
    watch?: boolean
    indent?: number
}

export const jsonDefaults = {
    watch: false,
    indent: 0,
} satisfies Partial<JSONWorkerParams>

export interface GrammarWorkerParams extends JSONWorkerParams {}

export const grammarDefaults = { ...jsonDefaults } satisfies Partial<GrammarWorkerParams>

export interface ColorThemeWorkerParams extends JSONWorkerParams {
    variablePrefix?: string
    sortFile?: boolean
    variablesFile?: string
    variablesKey?: string
}

export const colorThemeDefaults = {
    ...jsonDefaults,
    sortFile: false,
    variablePrefix: '--',
    variablesKey: 'variables',
} satisfies Partial<ColorThemeWorkerParams>
