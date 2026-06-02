import { green, cyan, yellow, dim, red } from '../utils/cli.ts'

export function watching(shortSrcPath: string) {
    console.log(yellow(`Watching ${cyan(shortSrcPath)} for changes...`))
}

export function buildSuccess(shortSrcPath: string, shortOutPath: string) {
    console.log(
        green(`Successfully built ${cyan(shortSrcPath)} to ${cyan(shortOutPath)}!`)
    )
}

export function updated(shortOutPath: string) {
    const date = new Date().toLocaleTimeString()
    console.clear()
    console.log(dim(date) + green(` Updated ${cyan(shortOutPath)}`))
}

export function readError(shortSrcPath: string, err: unknown) {
    const date = new Date().toLocaleTimeString()
    console.error(dim(date) + red(` Error reading ${shortSrcPath}:`))
    console.clear()
    console.error(err)
}
