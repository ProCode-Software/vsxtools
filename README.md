# vsxtools

**Note:** This is still a work in progress

A CLI and JavaScript framework for building VSCode extensions.

## Features

- 📕 Write TextMate grammars and product icon themes with TypeScript
- 🎨 Define palettes and reusable variables for color themes
- ⭐ Easily generate SVG fonts suitable for product icon themes
- 🔧 Configuration-based build process

## Used in

vsxtools is already being used in my personal projects

- [my VSCode themes](https://github.com/ProCode-Software/vscode-themes)

## Configuration

vsxtools can be configured using a `vsxtools.config.ts` or `vsxtools.config.js` file.

```typescript
import { defineConfig } from 'vsxtools'

export default defineConfig({
    configurations: {
        default: {
            type: 'color-theme',
            inputs: ['./src/my-color-theme.json'],
            outputDir: './themes',
            name: 'My Theme',
            id: 'my-theme',
        },
        // More configurations can be added here...
    },
})
```

To run a specific configuration, run:

```shell
vsxtools run <configuration-name>
```

## Roadmap

- [ ] Add a command to generate extension manifests
- [ ] Allow running/building products in a single command without a config file

## Building from Source

[Bun](https://bun.sh) is required:

```bash
bun install # Install dependencies

bun build # Build
bun link # Add vsxtools to PATH
```

## License

[MIT License](./LICENSE)
