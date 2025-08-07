export interface ExtensionConfig {
    configurations: Record<string, Product>
    manifest?: ExtensionManifest
    watch?: boolean
    /**
     * Indent size for generated JSON files. If set to `0`, files are minified.
     */
    jsonIndent?: number
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
    id?: string
    name?: string
} & (ColorThemeConfig | ProductIconThemeConfig | {})

export interface ColorThemeConfig {
    type: 'color-theme'
    variables: { path: string } | { inline: boolean }
}

/** Configuration for an existing font */
export interface FontConfig {
    id?: string
    fontFile: string
    codepointsPath?: string
    codepoints?: Record<string, string>
}

/** Configuration for a new font created from existing SVG files */
export interface SVGFontConfig {
    type: 'svg-font'
    id?: string
    svgDir: string
    outputFile: string
    outputFormat?: 'woff' | 'woff2' | 'ttf' | 'otf'
}

export interface ProductIconThemeConfig {
    type: 'product-icons'
    fonts: (string | FontConfig | SVGFontConfig)[]

    /**
     * Whether all glyphs in one of `fonts` that match the name of a codicon should be added.
     * The first font defined in the `fonts` property gets the highest priority.
     * */
    importExistingIconNames: boolean | string[]
}
