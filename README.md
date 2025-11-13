# Link to Embed

A JavaScript library for parsing and generating oEmbed-compatible embedded content from URLs.

[![npm version](https://img.shields.io/npm/v/@lichi.tech/link-to-embed.svg)](https://www.npmjs.com/package/@lichi.tech/link-to-embed)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: GPL-3.0-only](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://opensource.org/licenses/gpl-3-0)

## ✨ Features

- 🚀 **Universal oEmbed support** - Works with any platform that implements the oEmbed standard
- 🔧 **Custom transformers** - Built-in support for platforms without oEmbed (e.g., Bilibili)
- 🌍 **Cross-runtime** - Works in both browser and Node.js environments
- 📦 **TypeScript ready** - Full type safety and IntelliSense support
- ⚡ **Proxy support** - Built-in proxy configuration for restricted networks

## 📦 Installation

```bash
# npm
npm install @lichi.tech/link-to-embed

# pnpm
pnpm add @lichi.tech/link-to-embed

# yarn
yarn add @lichi.tech/link-to-embed
```

## 🚀 Quick Start

Works in any JavaScript environment (browser, Node.js, React, Vue, etc.):

```typescript
import { link2Embed } from '@lichi.tech/link-to-embed'

// Basic usage
const embed = await link2Embed('https://www.youtube.com/watch?v=x2bqscVkGxk')
console.log(embed.html)
// <iframe width="200" height="113" src="https://www.youtube.com/embed/..." />

// Bilibili example (built-in fallback transformer for non-oEmbed platform)
const bilibili = await link2Embed('https://www.bilibili.com/video/BV1ys411472E')
console.log(bilibili.html)
// <iframe src="//player.bilibili.com/player.html?..." />
```

## 📚 API Reference

### `link2Embed(url, options?)`

Main function to transform a URL into embeddable content.

**Parameters:**

| Parameter | Type                 | Description            |
| --------- | -------------------- | ---------------------- |
| `url`     | `string`             | The URL to transform   |
| `options` | `LinkToEmbedOptions` | Optional configuration |

**Returns:** `Promise<EmbedData | null>`

**Example:**

```typescript
import { link2Embed } from '@lichi.tech/link-to-embed'

const data = await link2Embed('https://vimeo.com/123456789', {
	fetchOptions: {
		headers: {
			'User-Agent': 'Custom User Agent'
		}
	}
})
```

### `LinkToEmbedOptions`

| Property                 | Type            | Description                |
| ------------------------ | --------------- | -------------------------- |
| `additionalTransformers` | `Transformer[]` | Custom transformers to add |
| `oEmbedParams`           | `Params`        | oEmbed API parameters      |
| `fetchOptions`           | `FetchOptions`  | Fetch configuration        |

### `defineTransformer(config)`

Helper function to create custom transformers with full type safety.

**Example:**

```typescript
import { defineTransformer } from '@lichi.tech/link-to-embed'

const myTransformer = defineTransformer({
	key: 'my-platform',
	name: 'My Platform',
	patterns: [
		/https?:\/\/myplatform\.com\/video\/(\w+)/
	],
	transform: (url, matches) => {
		const videoId = matches[1]
		return {
			type: 'video',
			provider_name: 'My Platform',
			html: `<iframe src="https://myplatform.com/embed/${videoId}"></iframe>`
		}
	}
})
```

## 🎯 Supported Platforms

### oEmbed Platforms (auto-detected)

The library automatically detects and handles oEmbed-compatible platforms:

- ✅ YouTube
- ✅ Vimeo
- ✅ Twitter/X
- ✅ Instagram
- ✅ TikTok
- ✅ And hundreds more via the oEmbed standard

### Built-in Fallback Transformers

For platforms **without oEmbed support**, we provide built-in transformers as a fallback:

| Platform      | URL Pattern                          | Type  | Note                               |
| ------------- | ------------------------------------ | ----- | ---------------------------------- |
| Bilibili      | `bilibili.com/video/*`<br>`b23.tv/*` | Video | Grab information from Bilibili api |
| Tencent Video | `v.qq.com/x/page/*`                  | Video |                                    |

### Custom Transformers

You can define your own transformers for any platform using `additionalTransformers`:

```typescript
import { defineTransformer } from '@lichi.tech/link-to-embed'

// Example: Custom transformer for a platform without oEmbed
const customTransformer = defineTransformer({
	key: 'my-platform',
	name: 'My Platform',
	patterns: [/https?:\/\/myplatform\.com\/video\/(\w+)/],
	transform: (url, matches) => {
		// Your custom transformation logic
		return {
			type: 'video',
			html: `<iframe src="https://myplatform.com/embed/${matches[1]}"></iframe>`
		}
	}
})

// Use with additionalTransformers option
const data = await link2Embed('https://myplatform.com/video123', {
	additionalTransformers: [customTransformer]
})
```

**Priority:** Transformers are processed in order. Higher `priority` values are processed first (default is 0):

```typescript
const customTransformer = defineTransformer({
	key: 'custom',
	name: 'Custom Platform',
	patterns: [/https?:\/\/custom\.com\/(\w+)/],
	priority: 100, // Processed first
	transform: (url, matches) => {
		return {
			type: 'rich',
			html: `<div>Custom embed for ${matches[1]}</div>`
		}
	}
})
```

## 🛠️ Advanced Usage

### Custom Fetch Options

```typescript
import { link2Embed } from '@lichi.tech/link-to-embed'

const embed = await link2Embed('https://example.com/video', {
	fetchOptions: {
		headers: {
			'Authorization': 'Bearer token123',
			'X-Custom-Header': 'value'
		},
		signal: abortController.signal
	}
})
```

### Proxy Support

```typescript
import { link2Embed } from '@lichi.tech/link-to-embed'

const embed = await link2Embed('https://example.com/video', {
	fetchOptions: {
		proxy: {
			target: 'https://proxy.example.com/',
			headers: {
				'Proxy-Authorization': 'Basic xxx'
			}
		}
	}
})
```

## 📊 Return Type: EmbedData

All functions return a standardized `EmbedData` object:

```typescript
interface EmbedData {
	type: 'link' | 'photo' | 'video' | 'rich'
	version: string
	title?: string
	author_name?: string
	author_url?: string
	provider_name?: string
	provider_url?: string
	thumbnail_url?: string
	thumbnail_width?: number
	thumbnail_height?: number
	html?: string
	width?: number
	height?: number
	// ... additional oEmbed properties
}
```

## 🏗️ Architecture

The library uses a **smart fallback strategy** to maximize compatibility:

```console
link2Embed URL Processing
│
├── Step 1: Try oEmbed First
│   ├── Query platform's oEmbed endpoint
│   └── Return embed data if successful
│
└── Step 2: Fallback to Transformers (if oEmbed not available)
    ├── User-defined Transformers (via additionalTransformers)
    │   └── Processed first (higher priority)
    └── Built-in Transformers (Bilibili, etc.)
        └── For platforms without oEmbed support
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/link-to-embed.git

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm build
```

### Adding a New Built-in Transformer

This section is for contributing **built-in transformers** to the library (for platforms without oEmbed support). For custom transformers in your own application, use `additionalTransformers` instead.

**Steps:**

1. Create a new file in `src/transformers/`
2. Use `defineTransformer()` to create the transformer
3. Add patterns and transform logic
4. Export and register in `src/transformers/index.ts`
5. Add tests

**Example:**

```typescript
import type { EmbedData } from '../types'
// src/transformers/myplatform.ts
import { defineTransformer } from '../utils/transformers'

export default defineTransformer({
	key: 'myplatform',
	name: 'My Platform',
	patterns: [/https?:\/\/myplatform\.com\/(\w+)/],
	transform: (url, matches): EmbedData => {
		return {
			type: 'video',
			provider_name: 'My Platform',
			html: `<iframe src="https://myplatform.com/embed/${matches[1]}"></iframe>`
		}
	}
})
```

## 📝 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [oEmbed](http://oembed.com/) - The oEmbed specification
- [@extractus/oembed-extractor](https://github.com/extractus/oembed-extractor) - oEmbed implementation
- [image-size](https://github.com/image-size/image-size) - Image dimension detection
