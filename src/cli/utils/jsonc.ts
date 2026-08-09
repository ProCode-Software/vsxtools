import { readFileSync } from 'node:fs'
import stripComments from '../../vendor/jsonc.js'

let parseJSONC: (input: string) => any = await import('bun')
    .then(({ JSONC }) => JSONC.parse)
    .catch(() => parseFallback)

function parseFallback(input: string): any {
    input = stripComments(input, { trailingCommas: true, whitespace: false })
    return JSON.parse(input)
}

export { parseJSONC }

export async function parseJSONCFile(path: string) {
    return await parseJSONC(readFileSync(path, 'utf-8'))
}
