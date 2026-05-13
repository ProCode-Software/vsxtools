import { watchFile } from 'fs'
import { writeFile } from 'fs/promises'
import { basename } from 'path'
import { workerData } from 'worker_threads'
import { cyan, dim, green, red, yellow } from '../utils/cli.ts'
import { GrammarWorkerParams } from './params.ts'
import { generateTextMateGrammar as generateGrammarJSON } from '#lib/api/grammar'

const { outPath, srcPath, watch, indent }: GrammarWorkerParams = workerData
const shortSrcPath = basename(srcPath)
const shortOutPath = basename(outPath)

// First update
update()

if (watch) {
    console.log(yellow(`Watching ${cyan(shortSrcPath)} for changes...`))
    watchFile(srcPath, update)
} else {
    console.log(
        green(`Successfully built ${cyan(shortSrcPath)} to ${cyan(shortOutPath)}!`)
    )
}

async function update() {
    try {
        // YAML/TOML files are supported if the JS runtime can import them, such as Bun.
        let { default: tmLanguage } = await import(`${srcPath}?t=${Date.now()}`)
        await writeFile(outPath, generateGrammarJSON(tmLanguage, indent))

        const date = new Date().toLocaleTimeString()
        console.log(dim(date) + green(` Updated ${cyan(shortOutPath)}`))
    } catch (err) {
        const date = new Date().toLocaleTimeString()
        console.error(dim(date) + red(` Error reading ${shortSrcPath}:`))
        console.error(err)
    }
}
