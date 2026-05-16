let parseJSONC: (input: string) => any = await import('bun')
    .then(({ JSONC }) => JSONC.parse)
    .catch(() => parseFallback)

async function parseFallback(input: string): Promise<any> {
    const { default: stripComments } = await import('../../vendor/jsonc.js')
    input = stripComments(input, { trailingCommas: true, whitespace: false })
    return JSON.parse(input)
}

export { parseJSONC }
