# Unicode and Graphemes

## Grapheme Awareness

```ts
countGraphemes('👍🏼a') // 2 or 3 depending on Intl.Segmenter support; falls back safely
reverseGraphemes('👍🏼a') // 'a👍🏼'
```

## Word Parsing

```ts
words("Don't-stopBelievin'") // ['Dont','stop','Believin']
```

Note: The library prefers robust behavior with feature detection to handle diverse environments.
