import type { CodepointIcon } from '$/productIcons'

export function codepoint(codepoint: number | string, fontId?: string): CodepointIcon {
    return {
        character:
            typeof codepoint == 'string' ? codepoint : String.fromCodePoint(codepoint),
        fontId,
    }
}
