# Case Conversion

Utilities to transform strings between popular cases.

## Word splitting
All converters rely on robust splitting that handles `camelCase`, `PascalCase`, punctuation and separators.

## API

```ts
toCamelCase('Hello_world nice-day') // 'helloWorldNiceDay'
toPascalCase('hello world') // 'HelloWorld'
toSnakeCase('HelloWorld') // 'hello_world'
toKebabCase('HelloWorld') // 'hello-world'
toConstantCase('hello world') // 'HELLO_WORLD'
toSentenceCase('hello WORLD') // 'Hello world'
capitalize('hello') // 'Hello'
decapitalize('Hello') // 'hello'
words('Hello, world!') // ['Hello','world']
```

### Tips
- Diacritics are stripped for snake/kebab to ensure ASCII-friendly output.
- `toTitleCase` is separate and handles small-words and forces.
