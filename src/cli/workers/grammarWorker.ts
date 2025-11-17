import { workerData } from 'worker_threads'
import { cyan, dim, GrammarWorkerParams, green, red, yellow } from '../utils.ts'
import { watchFile } from 'fs'
import { writeFile } from 'fs/promises'
import { basename } from 'path'

const { outPath, srcPath, watch, indent }: GrammarWorkerParams = workerData
const shortSrcPath = basename(srcPath),
    shortOutPath = basename(outPath)

function replacer(k: string, v: any): any {
    switch (true) {
        case typeof v == 'boolean':
            return +v // Numbers in textmate grammar
        case v instanceof RegExp:
            return v.source
        // 'captures' property
        case k.toLowerCase().endsWith('captures') && Array.isArray(v):
            if (v.length > 1 && v[0] !== undefined) {
                v.unshift(undefined) // Add item at index 0 if more than 1 item
            }
            // Make array an object with numeric keys
            return Object.fromEntries(Object.entries(v))
        default:
            return v
    }
}

async function update() {
    try {
        let { default: tmLanguage } = await import(`${srcPath}?t=${Date.now()}`)
        await writeFile(outPath, JSON.stringify(tmLanguage, replacer, indent))

        const date = new Date().toLocaleTimeString()
        console.log(dim(date) + green(` Updated ${cyan(shortOutPath)}`))
    } catch (err) {
        const date = new Date().toLocaleTimeString()
        console.error(dim(date) + red(` Error reading ${shortSrcPath}:`))
        console.error(err)
    }
}
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
