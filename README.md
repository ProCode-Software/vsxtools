# 🧩 vsxtools

A CLI and JavaScript framework for building VSCode extensions.

> [!WARNING]
> This is still a work in progress. Expect partially-implemented functionality. More features will be added in the future.

## ⭐ Features

- 📕 Write TextMate grammars and product icon themes with TypeScript
- 🎨 Define palettes and reusable variables for color themes
- ⭐ Easily generate SVG fonts suitable for product icon themes
- 🔧 Configuration-based build process
- 📦 Package extensions into `.vsix` bundles. High-performance replacement for `vsce`

## 📦 Installation

```shell
npm install vsxtools
vsxtools <command>

# Or use npx
npx vsxtools <command>
```

## 📖 Documentation

For documentation, see the [GitHub wiki](https://github.com/ProCode-Software/vsxtools/wiki).

## 🚀 Quickstart

### ⚙ Configuration

vsxtools can be configured using a `vsxtools.config.ts/js` file in your extension folder.

```typescript
import { defineConfig } from "vsxtools";

export default defineConfig({
  configurations: {
    // Create a color theme with vsxtools
    default: {
      type: "color-theme",
      inputs: ["./src/my-color-theme.json"],
      outputDir: "./themes",
      name: "My Theme",
      id: "my-theme",
    },
    // More configurations can be added here...
  },
});
```

To run a specific configuration, run:

```shell
vsxtools run <configuration-name>
```

### Packaging Extensions

vsxtools can package extensions similar to `vsce pack`, but much faster.

```shell
vsxtools pack [path]
```

You don't even need a configuration. Just run `vsxtools` in your current directory.

```shell
npx vsxtools pack
```

<!--
## Used in

vsxtools is already being used in my personal projects

- [my VSCode themes](https://github.com/ProCode-Software/vscode-themes)
-->

## 🗺 Roadmap

- [ ] Add a command to generate extension manifests
- [ ] Allow running/building products in a single command without a config file

## 🏗 Building from Source

[Bun](https://bun.sh) is required:

```bash
# Clone the repo
git clone https://github.com/ProCode-Software/vsxtools
cd vsxtools
# Install dependencies
bun install

bun vsxtools # Run the CLI
bun build # Build
bun link # Add vsxtools to PATH
```

## 📄 License

[MIT License](./LICENSE)
