import type { ManifestPackage } from '#/vendor/manifest.ts'

export interface Config {
    configurations: Record<string, Product>
    manifest?: ExtensionManifest
    watch?: boolean
    /**
     * Indent size for generated JSON files. If set to `0`, files are minified.
     */
    jsonIndent?: number
}

export type ExtensionManifest = ManifestPackage

// Products
// =========

export type ProductType =
    | 'color-theme'
    | 'product-icons'
    | 'keymap'
    | 'language'
    | 'extension'

// TODO: update with more product types
export type ProductConfig = ColorThemeConfig | ProductIconThemeConfig | LanguageConfig

export type Product<T extends ProductType = ProductType> = {
    type: T
    inputs: string | string[]
    outputDir?: string
    outputFile?: string | string[]
    id?: string
    name?: string
} & Extract<ProductConfig, { type: T }>

export interface ColorThemeConfig {
    type: 'color-theme'
    /** The location of the variable declarations used by the inputs */
    variables:
        | {
              /** Path to a file that declares the variables */
              path: string
          }
        | {
              /** The variables are declared in the input JSON */
              inline: true
              /** The key in the input JSON where the variables are declared */
              variablesKey?: string
          }
    /** Whether to sort the generated file */
    sortFile?: boolean
    /** The prefix to use for variable references */
    variablePrefix?: string
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

export interface LanguageConfig {
    type: 'language'
}

// Fonts
// =========

/** Configuration for an existing font */
export type FontConfig = { id?: string; fontFile: string } & (
    | { codepointsPath?: string }
    | { codepoints?: Record<string, string> }
)

/** Configuration for a new font created from existing SVG files */
export interface SVGFontConfig {
    type: 'svg-font'
    id?: string
    svgDir: string
    outputFile: string
    outputFormat?: 'woff' | 'woff2' | 'ttf' | 'otf'
}
