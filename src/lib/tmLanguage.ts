import type { Expression, Include } from '$/tmLanguage'

/**
 * Adds a `match`-`name` pattern.
 * ```js
 * match(/\b(for|if|while|do)\b/, 'keyword.control.js')
 * ```
 * This is a shorthand for:
 * ```js
 * {
 *     match: /\b(for|if|while|do)\b/,
 *     name: 'keyword.control.js'
 * }
 * ```
 */
export const match = (match: Expression, name: string) => ({ match, name })

/**
 * Merges multiple regular expressions into a single expression.
 * ```js
 * const IDENTIFIER = /[A-Za-z][A-Za-z0-9]{0,}/
 * const pattern = {
 *     match: merge('const\s+', IDENTIFIER, /\s*=/, /\s*(.*)/),
 * }
 * ```
 * gets merged into:
 * ```js
 * const pattern = {
 *     match: /const\s+[A-Za-z][A-Za-z0-9]{0,}\s*=\s*(.*)/
 * }
 * ```
 */
export function merge(...expressions: Expression[]): Expression {
    const joined = expressions.map(e => (e instanceof RegExp ? e.source : e)).join('')
    try {
        return new RegExp(joined)
    } catch {
        return joined
    }
}

/**
 * Returns an include reference.
 * ```js
 * include('comment')
 * ```
 * This is a shorthand for:
 * ```js
 * {
 *     include: '#comment'
 * }
 * ```
 */
export function include(path: Include['include']): Include {
    if (/^\$(base|self)$|^#|\./.test(path) === false) path = `#${path}`
    return { include: path }
}
