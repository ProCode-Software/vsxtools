import { watchFile } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { basename } from 'node:path'
import { workerData } from 'node:worker_threads'
import { parseJSONCFile } from '../utils/jsonc.ts'
import * as log from './log.ts'
import { colorThemeDefaults as defs, type ColorThemeWorkerParams } from './params.ts'

const {
    outPath,
    srcPath,
    variablesFile,
    watch = defs.watch,
    indent = defs.indent,
    variablePrefix = defs.variablePrefix,
    sortFile = defs.sortFile,
    variablesKey = defs.variablesKey,
}: ColorThemeWorkerParams = workerData

const shortSrcPath = basename(srcPath)
const shortOutPath = basename(outPath)

await update()

if (watch) {
    log.watching(shortSrcPath)
    watchFile(srcPath, update)
    // Also watch the variables file for changes
    variablesFile && watchFile(variablesFile, update)
} else log.buildSuccess(shortSrcPath, shortOutPath)

async function update() {
    try {
        const file: ColorThemeFile & {} = parseJSONCFile(srcPath)
        const vars: Record<string, string> = variablesFile
            ? (await import(`${variablesFile}?t=${Date.now()}`)).default
            : file[variablesKey]

        // Delete schema and variables key
        if (!variablesFile) delete file[variablesKey]
        delete file.$schema

        // Sort if enabled
        if (sortFile) sort(file)

        let replaced = JSON.stringify(file, null, indent)
        // Sort variables by name length so substitutions don't replace
        // the middle of similarly-named variables.
        const sortedVars = Object.entries(vars).sort(([a], [b]) => b.length - a.length)
        for (const [name, value] of sortedVars) {
            replaced = replaced.replaceAll(variablePrefix + name, value)
        }

        writeFile(outPath, replaced)
        log.updated(shortOutPath)
    } catch (e) {
        log.readError(shortSrcPath, e)
    }
}

function sort(file: ColorThemeFile) {
    for (const key of ['colors', 'semanticTokenColors']) {
        file[key] &&= Object.fromEntries(
            Object.entries(file[key]).sort(([a], [b]) => a.localeCompare(b))
        )
    }
    file.tokenColors &&
        file.tokenColors.sort((a, b) => {
            const aScope = Array.isArray(a.scope) ? a.scope[0] : a.scope
            const bScope = Array.isArray(b.scope) ? b.scope[0] : b.scope
            return aScope.localeCompare(bScope)
        })
}

interface ColorThemeFile {
    $schema?: string
    colors?: Record<string, string>
    semanticHighlighting?: boolean
    semanticTokenColors?: Record<string, string>
    tokenColors?: { scope: string | string[]; settings: Record<string, string> }[]
}
