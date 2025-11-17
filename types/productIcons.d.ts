import { codiconsLibrary } from '@vscode/codicons/src/template/mapping.json'

type CodiconName = keyof typeof codiconsLibrary

export interface CodepointIcon {
    character: string
    fontId?: string
}

export type ProductIconTheme = Record<CodiconName, string | CodepointIcon>
