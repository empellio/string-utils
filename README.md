# @empellio/string-utils

Lightweight, dependency-free string utilities for Node.js and TypeScript. ESM and CJS compatible.

## Install

```bash
npm install @empellio/string-utils
```

## Usage

ESM:

```ts
import { slugify, toCamelCase } from '@empellio/string-utils'

console.log(slugify('Žluťoučký kůň skákal.')) // 'zlutoucky-kun-skakal'
console.log(toCamelCase('Hello_world nice-day')) // 'helloWorldNiceDay'
```

CJS:

```js
const { slugify, toCamelCase } = require('@empellio/string-utils')
```

## API (selection)

- `stripDiacritics(str)`
- `slugify(str, options?)`
- `toTitleCase(str, options?)`
- `sanitizeFilename(str, options?)`
- `escapeRegex(str)` / `escapeHtml(str)` / `unescapeHtml(str)` / `stripHtml(str)`
- `truncate(str, maxLength, options?)` / `truncateMiddle(str, maxLength, ellipsis?)`
- `humanizeList(items, options?)`
- `levenshtein(a, b)` / `similarity(a, b)`
- `countGraphemes(str)` / `reverseGraphemes(str)`
- `startsWithAny(str, prefixes)` / `endsWithAny(str, suffixes)` / `containsAny(str, needles)`
- `replaceAllFast(str, search, replacement)`
- `words(str)`
- `toCamelCase(str)` / `toPascalCase(str)` / `toSnakeCase(str)` / `toKebabCase(str)` / `toConstantCase(str)` / `toSentenceCase(str)`
- `capitalize(str)` / `decapitalize(str)`
- `normalizeWhitespace(str, options?)`
- `stripAnsi(str)`
- `ordinal(n)`
- `ensurePrefix(str, prefix)` / `ensureSuffix(str, suffix)`
- `wordWrap(str, options?)` / `dedent(str, options?)`
- `mask(str, options?)` / `center(str, width, padChar?)` / `toFixedLength(str, length, options?)`
- `initials(str, maxLetters?)`
- `base64Encode(str)` / `base64Decode(str)` / `base64UrlEncode(str)` / `base64UrlDecode(str)`
- Random: `randomBytes(n)` / `randomString(n, options?)` / `randomInt(min, max)` / `randomUUID()` / `randomHex(n)` / `randomBase64Url(n)` / `randomAlphanumeric(n)` / `randomAlphabetic(n)` / `randomNumeric(n)`
- Validators: `isEmail(str)` / `isUUID(str)` / `isURL(str)` / `isHexColor(str)`
- Extraction: `between(str, start, end, fromIndex?)` / `betweenAll(str, start, end)`
- `removePunctuation(str)`
- `template(str, vars, options?)`

Refer to TypeScript types and JSDoc for detailed options and behavior.

## Docs

See the full documentation in `DOCS/`:
- `DOCS/README.md` (index)

## License

MIT
