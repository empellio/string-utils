# Random Utilities

Cryptographically strong generation when possible. Functions feature-detect Web Crypto and fall back to `Math.random()` only when necessary (non-secure).

## `randomBytes(size: number): Uint8Array`
- Returns a buffer of random bytes.
- Uses Web Crypto if available; otherwise falls back.

```ts
const bytes = randomBytes(16) // Uint8Array(16)
```

## `randomString(length: number, options?: { charset?: ... })`
- Unbiased sampling via rejection to avoid modulo bias.
- Preset charsets: `'alphanumeric' | 'alphabetic' | 'numeric' | 'hex' | 'base64url' | 'ascii-printable'` or provide a custom string.

```ts
randomString(12) // default alphanumeric
randomString(8, { charset: 'hex' }) // e.g. '3f7a1b9c'
randomString(10, { charset: 'base64url' }) // URL-safe
randomString(6, { charset: 'ABCDEF' }) // custom charset
```

## `randomInt(min: number, max: number): number`
- Inclusive range. Uses rejection sampling on 32-bit values.

```ts
randomInt(1, 6) // fair dice
```

## `randomUUID(): string`
- UUID v4. Uses `crypto.randomUUID` if present; otherwise manual.

```ts
randomUUID() // 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
```

## `randomHex(length = 32): string`
- Hex string of exact length.

```ts
randomHex(64)
```

## `randomBase64Url(length = 22): string`
- Base64url string of exact length (URL-safe `-` and `_`).

```ts
randomBase64Url(16)
```

## Convenience

```ts
randomAlphanumeric(16)
randomAlphabetic(10)
randomNumeric(6)
```

## Security Notes
- For tokens/secrets, prefer `randomBytes` or `randomString` with a large length and high-entropy charset (e.g., base64url).
- Avoid exposing raw randomness directly; mask or hash if needed when logging.
