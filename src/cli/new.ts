import { confirm, intro, isCancel, outro, select, spinner, text } from '@clack/prompts'
import path from 'node:path'
import { setTimeout } from 'node:timers/promises'
import { styleText } from 'node:util'
import { cyan, green, magenta, red, yellow } from './utils/cli.ts'
import type { ProductType } from '#lib/vsxtools/types.ts'

interface ExtensionInfo {
    dir: string
    name: string
    identifier: string
    type: ProductType
    addLSP?: boolean
    languageID?: string
    languageName?: string
    fileExtensions?: string[]
    varLocation?: 'inline' | string | undefined
    inputFile?: string
    outputFile?: string
    useJS?: boolean
    scriptExt(): string
}

const inputs: Record<
    Exclude<ProductType, 'extension'>,
    { label: string; outPath: string }
> = {
    'color-theme': { label: 'color theme', outPath: 'themes/*.color-theme.json' },
    'product-icons': {
        label: 'JSON file',
        outPath: 'producticons/*.product-icon-theme.json',
    },
    keymap: { label: 'keymap', outPath: 'keymap/*.keymap.json' }, // TODO: I don't know the default extension
    language: { label: 'TextMate grammar', outPath: 'language/*.tmLanguage.json' },
}
const jsonInputs: ProductType[] = ['color-theme', 'keymap']

export async function runNew(dir: string | undefined) {
    intro(styleText(['inverse', 'blue', 'bold'], ' New Extension '))
    const required = (s: string | undefined) => (s ? undefined : 'Please enter a value')
    let defaultName: string
    const extensionInfo: ExtensionInfo = {
        dir: dir || '',
        type: await handleCancel(
            select<ProductType>({
                message: 'Extension type',
                options: [
                    { label: yellow('🎨 Color Theme'), value: 'color-theme' },
                    { label: green('🧩 Extension'), value: 'extension' },
                    { label: red('📕 Language/Grammar'), value: 'language' },
                    { label: cyan('⭐ Product Icon Theme'), value: 'product-icons' },
                    { label: magenta('⌨️ Keymap'), value: 'keymap' },
                ],
            })
        ),
        name: await handleCancel(
            text({
                message: 'Extension name',
                defaultValue: (defaultName = path.basename(process.cwd())),
                placeholder: defaultName,
            })
        ),
        identifier: '',
        scriptExt: () => (extensionInfo.useJS ? 'js' : 'ts'),
    }
    // Identifier
    const defaultIdent = extensionInfo.name!.toLowerCase().replace(' ', '-')
    extensionInfo.identifier = await handleCancel(
        text({
            message: 'Extension identifier',
            defaultValue: defaultIdent,
            placeholder: defaultIdent,
        })
    )
    extensionInfo.dir ||= await handleCancel(
        text({
            message: 'Extension directory',
            defaultValue: process.cwd(),
            placeholder: '.',
        })
    )
    // TypeScript/JavaScript
    if (extensionInfo.type == 'extension' || !jsonInputs.includes(extensionInfo.type))
        extensionInfo.useJS = !(await handleCancel(
            confirm({ message: 'Use TypeScript?', initialValue: true })
        ))

    // Inputs
    if (extensionInfo.type != 'extension') {
        const { label, outPath } = inputs[extensionInfo.type]
        const defaultInput = path.join(
            extensionInfo.dir,
            'src',
            jsonInputs.includes(extensionInfo.type)
                ? path.basename(outPath).replace('*', extensionInfo.identifier)
                : `${extensionInfo.identifier}.${extensionInfo.scriptExt()}`
        )
        extensionInfo.inputFile = await handleCancel(
            text({
                message: `Where will your ${label} be located?`,
                defaultValue: defaultInput,
                placeholder: path.relative(extensionInfo.dir, defaultInput),
            })
        )

        // Output file automatically generated
        extensionInfo.outputFile = path.join(
            extensionInfo.dir,
            outPath.replace('*', path.parse(extensionInfo.inputFile).name)
        )
    }

    // Type-specific options
    if (extensionInfo.type == 'language') {
        let defaultLangID: string
        Object.assign(extensionInfo, {
            addLSP: await handleCancel(
                confirm({ message: 'Add LSP', initialValue: false })
            ),
            languageName: (defaultLangID = await handleCancel(
                text({ message: 'Language name', validate: required })
            )),
            languageID: await handleCancel(
                text({
                    message: 'Language ID',
                    defaultValue: (defaultLangID = defaultLangID
                        .toLowerCase()
                        .replaceAll(' ', '')),
                    placeholder: defaultLangID,
                })
            ),
        })
    } else if (extensionInfo.type == 'color-theme') {
        const varLocation = await handleCancel(
            select({
                message: 'Variable location',
                options: [
                    { label: 'Inline', value: 'inline' },
                    { label: 'In a separate file', value: 'separate' },
                    { label: 'No variables', value: 'none' },
                ],
            })
        )
        switch (varLocation) {
            case 'inline':
                extensionInfo.varLocation = 'inline'
                break
            case 'separate':
                const defaultPath = path.relative(
                    process.cwd(),
                    `${extensionInfo.dir}/themes/variables.ts`
                )
                extensionInfo.varLocation = await handleCancel(
                    text({
                        message: 'Where should the variables be stored?',
                        defaultValue: defaultPath,
                        placeholder: defaultPath,
                    })
                )
                break
            case 'none':
                extensionInfo.varLocation = undefined
                break
        }
    }

    const s = spinner()
    s.start(magenta(`Creating your project at ${cyan(extensionInfo.dir)}`))
    const configPath = await generateProject(extensionInfo)
    s.stop(styleText('greenBright', 'Project created!'))
    outro(
        yellow(
            `You can edit your config at ${cyan(path.relative(process.cwd(), configPath))}.
   Run via ${magenta('vsxtools run')}`
        )
    )
}

async function handleCancel<T>(value: Promise<T | symbol>): Promise<Awaited<T>> {
    const result = await value
    if (isCancel(result)) {
        process.exit(0)
    }
    return result
}

async function generateProject({
    dir,
    scriptExt,
    ..._info
}: ExtensionInfo): Promise<string> {
    const configPath = path.join(dir, `vsxtools.config.${scriptExt()}`)
    await setTimeout(5000)
    return configPath
}
