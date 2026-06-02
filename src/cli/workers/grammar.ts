import { watchFile } from 'fs'
import { writeFile } from 'fs/promises'
import { basename } from 'path'
import { workerData } from 'worker_threads'
import * as log from './log.ts'
import { grammarDefaults as defs, type GrammarWorkerParams } from './params.ts'
import { generateTextMateGrammar as generateGrammarJSON } from '#lib/api/grammar.ts'

const {
    outPath,
    srcPath,
    watch = defs.watch,
    indent = defs.indent,
}: GrammarWorkerParams = workerData
const shortSrcPath = basename(srcPath)
const shortOutPath = basename(outPath)

// First update
update()

if (watch) {
    log.watching(shortSrcPath)
    watchFile(srcPath, update)
} else log.buildSuccess(shortSrcPath, shortOutPath)

async function update() {
    try {
        // YAML/TOML files are supported if the JS runtime can import them, such as Bun.
        let { default: tmLanguage } = await import(`${srcPath}?t=${Date.now()}`)
        await writeFile(outPath, generateGrammarJSON(tmLanguage, indent))
        log.updated(shortOutPath)
    } catch (err) {
        log.readError(shortSrcPath, err)
    }
}
