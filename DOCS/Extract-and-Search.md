# Extraction and Search

## Prefix/Suffix helpers

```ts
ensurePrefix('file.txt', '/') // '/file.txt'
ensureSuffix('path', '/') // 'path/'
```

## Contains, Starts, Ends

```ts
startsWithAny('abcdef', ['x','ab']) // true
endsWithAny('abcdef', ['zz','ef']) // true
containsAny('abcdef', ['cd','zz']) // true
```

## Replace

```ts
replaceAllFast('a-b-a', '-', ':') // 'a:b:a'
```

## Similarity

```ts
levenshtein('kitten','sitting') // 3
similarity('kitten','sitting') // ~0.57
```

## Between markers

```ts
between('a [x] b', '[', ']') // 'x'
betweenAll('x{1}y{2}z{3}', '{', '}') // ['1','2','3']
```
