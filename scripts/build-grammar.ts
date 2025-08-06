import { resolve } from 'path'
import { watchFile, writeFileSync } from 'fs'

const env = process.env

const srcPath = resolve(env.VSXTOOLS_SRC_PATH)
const outPath = resolve(env.VSXTOOLS_OUT_PATH)

const update = async (print: any) => {
    try {
        let { default: tmLanguage } = await import(`${srcPath}?t=${Date.now()}`)
        writeFileSync(
            outPath,
            JSON.stringify(
                tmLanguage,
                (k, v) => {
                    switch (true) {
                        case typeof v == 'boolean':
                            return +v
                        case v instanceof RegExp:
                            return v.source
                        case Array.isArray(v) && k.toLowerCase().endsWith('captures'):
                            if (v.length > 1 && v[0] !== undefined) {
                                v.unshift(undefined)
                            }
                            return Object.fromEntries(Object.entries(v))
                        default:
                            return v
                    }
                },
                4
            )
        )
        delete require.cache[srcPath]
        if (print !== false)
            console.log(
                `\x1B[2m${new Date().toLocaleTimeString()}: \x1B[0;32mUpdated file\x1B[0m`
            )
    } catch (e) {
        console.error(
            `\x1B[2m${new Date().toLocaleTimeString()}: \x1B[0;31mError updating file:\x1B[0m`
        )
        console.error(e)
    }
}
update(false)

if (env.VSXTOOLS_WATCH === 'true') {
    //console.clear()
    console.log('\x1B[1;33mWatching for file changes...\x1B[0m')
    watchFile(srcPath, update)
}
