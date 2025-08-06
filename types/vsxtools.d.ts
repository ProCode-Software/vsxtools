export interface ExtensionConfig {
    configurations: Record<string, Product>
    manifest?: ExtensionManifest
    watch?: boolean
}

export interface ExtensionManifest {}

export type ProductType =
    | 'color-theme'
    | 'product-icons'
    | 'keymap'
    | 'language'
    | 'extension'

export type Product = {
    type: ProductType
    inputs: string[]
    outputDir?: string
    outputFile?: string
} & (ColorThemeConfig | {})

export interface ColorThemeConfig {
    type: 'color-theme'
    variables: { path: string } | { inline: boolean }
}
