import codiconList from '@vscode/codicons/src/template/mapping.json' with { type: 'json' }

type CodiconName = keyof typeof codiconList

export interface CodepointIcon {
    character: string
    fontId?: string
}

export type ProductIconTheme = Record<CodiconName, string | CodepointIcon>
