# Getting Started

## Installation

```bash
npm install @empellio/string-utils
```

## Importing

- ESM:
```ts
import { slugify, toCamelCase } from '@empellio/string-utils'
```

- CommonJS:
```js
const { slugify, toCamelCase } = require('@empellio/string-utils')
```

- TypeScript types are bundled and auto-resolved by editors and the compiler.

## Quick Examples

```ts
import { stripDiacritics, slugify, toTitleCase } from '@empellio/string-utils'

stripDiacritics('Žluťoučký kůň') // 'Zlutoucky kun'
slugify('Žluťoučký kůň skákal!') // 'zlutoucky-kun-skakal'
toTitleCase('the lord of the rings') // 'The Lord of the Rings'
```

## Runtime compatibility

- Works in Node.js (>=16) and modern browsers. The build exports ESM and CJS.
- Some functions feature-detect Web APIs (e.g., `Intl.Segmenter`, `Intl.ListFormat`) and gracefully fall back when unavailable.
- Random utilities prefer Web Crypto when present; otherwise they fall back to `Math.random()` only for non-security-critical generation.
