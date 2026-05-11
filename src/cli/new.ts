import { confirm, input, select } from '@inquirer/prompts'
import path from 'node:path'
import { green, yellow, cyan, red, magenta } from './utils/cli.ts'

interface ExtensionInfo {
    dir: string
    name: string
    identifier: string
    type: 'colorTheme' | 'extension' | 'language' | 'productIconTheme' | 'keymap'
    addLSP?: boolean
    languageID?: string
    languageName?: string
    fileExtensions?: string[]
}

export async function runNew(dir: string | undefined) {
    const extensionInfo: ExtensionInfo = {
        dir: dir ?? process.cwd(),
        type: await select({
            message: 'Extension type',
            default: 'colorTheme',
            choices: [
                { name: yellow('🎨 Color Theme'), value: 'colorTheme' },
                { name: green('🧩 Extension'), value: 'extension' },
                { name: red('📕 Language/Grammar'), value: 'language' },
                { name: cyan('⭐ Product Icon Theme'), value: 'productIconTheme' },
                { name: magenta('⌨️ Keymap'), value: 'keymap' },
            ],
        }),
        name: await input({
            message: 'Extension name',
            default: path.basename(process.cwd()),
        }),
        identifier: '',
    }
    extensionInfo.identifier = await input({
        message: 'Extension identifier',
        default: extensionInfo.name!.toLowerCase().replace(' ', '-'),
    })
    if (extensionInfo.type == 'language') {
        extensionInfo.addLSP = await confirm({ message: 'Add LSP', default: false })
        extensionInfo.languageName = await input({ message: 'Language name' })
        extensionInfo.languageID = await input({
            message: 'Language ID',
            default: extensionInfo.languageName!.toLowerCase().replaceAll(' ', ''),
        })
    }
}
