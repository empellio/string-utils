# Validation

Lightweight validators intended for common use cases.

```ts
isEmail('a@b.com') // true
isUUID('550e8400-e29b-41d4-a716-446655440000') // true
isURL('https://example.com/?q=1') // true
isHexColor('#09f') // true
```

Notes:
- Email regex is pragmatic, not RFC-perfect. For strict needs, use a dedicated validator.
- `isURL` uses the URL constructor and catches errors.
