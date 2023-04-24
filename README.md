# remark-inline-code-language

A [Remark](https://github.com/remarkjs/remark) plugin that allows passing a language to inline code. This is useful for syntax highlighting.

Note: This is not a standard markdown feature.

## Example

```
`_js console.log()`
```

## Installation

```
npm i -D remark-inline-code-language
```

<!-- prettier-ignore -->
```js
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkInlineCodeLanguage from "remark-inline-code-language"

const mdast = await unified()
	.use(remarkParse)
	.parse("`_js console.log()`")

const result = unified()
	.use(remarkInlineCodeLanguage)
	.runSync(mdast)

console.log(JSON.stringify(result.children[0].children[0], null, 4))
```

```json
{
	"type": "inlineCode",
	"value": "console.log()",
	"lang": "js"
}
```

## Options

You can customize the syntax!

If you are going to only change 1 option, sadly you need to add in all other options too.

```js
.use(remarkInlineCodeLanguage, {
	// ...
})
```

### `separator_character`

This is the character(s) that separates the language name from the code content itself.

- Type: `string`
- Default: `"_"`

#### Examples

- `"_"` => `_js console.log()`
- `"+"` => `+js console.log()`
- `"="` => `=js console.log()`

### `separator_position`

- Type: `"before" | "after" | "both"`
- Default: `"before"`

#### Examples

- `"before"` => `_js console.log()`
- `"after"` => `js_ console.log()`
- `"both"` => `_js_ console.log()`
