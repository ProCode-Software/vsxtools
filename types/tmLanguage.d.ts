export type Expression = RegExp | string

export type RepositoryItem = string

export type Captures = Record<string | number, Pattern> | (Pattern | undefined)[]

export type Repository = Record<RepositoryItem, Pattern>
export interface Include {
    include: `#${RepositoryItem}` | '$self' | '$base' | string
}
export type BeginEndExpression =
    | {
          begin: Expression
          while: Expression
          beginCaptures?: Captures
          whileCaptures?: Captures
      }
    | {
          begin: Expression
          end: Expression
          beginCaptures?: Captures
          endCaptures?: Captures
      }

export type BeginEndPattern = BeginEndExpression & {
    begin: Expression
    end: Expression
    contentName?: string
    applyEndPatternLast?: boolean | 0 | 1
}

export type Pattern =
    | Include
    | ({
          name?: string
          disabled?: boolean | 0 | 1
          patterns?: Pattern[]
      } & PatternOtherTypes)

export type PatternOtherTypes =
    | {
          match: Expression
          captures?: Captures
      }
    | BeginEndPattern
    | {}

export type TextMateLanguage = {
    $schema?: string
    name?: string
    scopeName: string
    patterns: Pattern[]
    repository?: Repository
    injectionSelector?: string
}
