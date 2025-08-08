# Text Formatting

## Truncation

```ts
truncate('Hello world', 5) // 'He…'
truncate('Hello world', 8, { keepWords: true }) // 'Hello…'
truncateMiddle('abcdefghijkl', 8) // 'abcd…jkl'
```

## Wrapping and Indentation

```ts
wordWrap('A very long line...', { width: 10 })
// 'A very\nlong line\n...'

dedent(`
  line1
    line2
  line3
`)
// 'line1\n  line2\nline3'
```

## Masking and Padding

```ts
mask('4111111111111111', { showEnd: 4 }) // '••••••••••••1111'
center('Title', 10, '-') // '---Title--'
toFixedLength('abc', 5) // 'abc  '
toFixedLength('abcdefgh', 5, { truncateDirection: 'middle' }) // 'abfgh'
```

## Lists and Ordinals

```ts
humanizeList(['apples','bananas','pears']) // 'apples, bananas and pears'
ordinal(23) // '23rd'
initials('John Ronald Reuel Tolkien') // 'JR'
```
