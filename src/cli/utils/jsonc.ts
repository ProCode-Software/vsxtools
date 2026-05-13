let parseJSONC: (input: string) => any = JSON.parse
try {
    parseJSONC = (await import('bun')).JSONC.parse
} catch {
    console.warn('JSONC not available')
}
export { parseJSONC }
