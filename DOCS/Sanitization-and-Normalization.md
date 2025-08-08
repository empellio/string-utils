# Sanitization and Normalization

## `stripDiacritics(str)`
Remove accents using Unicode normalization.

```ts
stripDiacritics('Žluťoučký kůň') // 'Zlutoucky kun'
```

## `sanitizeFilename(str, options?)`
Cross-platform friendly filenames.

```ts
sanitizeFilename('  report: Q1/2025*.pdf  ')
// 'report Q1-2025.pdf'
```

## `normalizeWhitespace(str, { preserveNewlines }?)`
Collapse whitespace; optionally keep single blank lines.

```ts
normalizeWhitespace(' a   b  ')
// 'a b'

normalizeWhitespace('line1\n\n\nline2', { preserveNewlines: true })
// 'line1\n\nline2'
```

## `removePunctuation(str)`
Unicode-aware punctuation removal.

```ts
removePunctuation('Hello, world!!!') // 'Hello world'
```
