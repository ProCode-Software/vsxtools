export function generateTextMateGrammar(input: {}, indent: number = 2): string {
    return JSON.stringify(input, replacer, indent)
}

/** JSON replacer to replace JS objects to objects compatible with TextMate grammars */
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
