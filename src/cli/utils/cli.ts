import { styleText, type InspectColor } from 'util'
import { ResolvedConfig } from '../config.ts'
import { Product } from '#lib/vsxtools/types'

export const styled = (color: InspectColor | InspectColor[], text: string) =>
    styleText(color, text, { validateStream: false })

export const green = (text: string) => styled('green', text)
export const yellow = (text: string) => styled('yellow', text)
export const red = (text: string) => styled('red', text)
export const blue = (text: string) => styled('blue', text)
export const magenta = (text: string) => styled('magenta', text)
export const cyan = (text: string) => styled('cyan', text)
export const black = (text: string) => styled('black', text)
export const bold = (text: string) => styled('bold', text)
export const dim = (text: string) => styled('dim', text)
export const white = (text: string) => styled('white', text)

export function success(text: string) {
    console.log(green(text))
}

export function error(text: string, exit: boolean = true) {
    console.log(red(text))
    if (exit) process.exit(1)
}

export interface RunContext extends ResolvedConfig {
    product: Product
}
