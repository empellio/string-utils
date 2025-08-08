# API Reference

Grouped by topic. See source types for full signatures.

## Random
- `randomBytes(size: number): Uint8Array` — cryptographically strong when possible.
- `randomString(length: number, options?: { charset?: Preset | string }): string` — unbiased.
- `randomInt(min: number, max: number): number` — inclusive.
- `randomUUID(): string` — UUID v4.
- `randomHex(length = 32): string`
- `randomBase64Url(length = 22): string`
- `randomAlphanumeric(length = 16): string`
- `randomAlphabetic(length = 16): string`
- `randomNumeric(length = 16): string`

## Case
- `toCamelCase(str)`
- `toPascalCase(str)`
- `toSnakeCase(str)`
- `toKebabCase(str)`
- `toConstantCase(str)`
- `toSentenceCase(str)`
- `capitalize(str)` / `decapitalize(str)`
- `words(str)`
- `toTitleCase(str, options?)`

## Sanitization & Normalization
- `stripDiacritics(str)`
- `sanitizeFilename(str, options?)`
- `normalizeWhitespace(str, options?)`
- `removePunctuation(str)`

## HTML & Regex
- `escapeHtml(str)` / `unescapeHtml(str)` / `stripHtml(str)`
- `escapeRegex(str)`
- `template(str, vars, options?)`

## Formatting
- `truncate(str, maxLength, options?)`
- `truncateMiddle(str, maxLength, ellipsis?)`
- `wordWrap(str, options?)`
- `dedent(str, options?)`
- `mask(str, options?)`
- `center(str, width, padChar?)`
- `toFixedLength(str, length, options?)`
- `humanizeList(items, options?)`
- `ordinal(n)`
- `initials(str, maxLetters?)`

## Unicode
- `countGraphemes(str)`
- `reverseGraphemes(str)`

## Validation
- `isEmail(str)` / `isUUID(str)` / `isURL(str)` / `isHexColor(str)`

## Extract & Search
- `ensurePrefix(str, prefix)` / `ensureSuffix(str, suffix)`
- `startsWithAny(str, prefixes)` / `endsWithAny(str, suffixes)` / `containsAny(str, needles)`
- `replaceAllFast(str, search, replacement)`
- `levenshtein(a, b)` / `similarity(a, b)`
- `between(str, start, end, fromIndex?)` / `betweenAll(str, start, end)`
