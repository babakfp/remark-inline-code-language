# remark-inline-code-language

[Remark](https://github.com/remarkjs/remark) plugin that allows passing a language to inline code. This is useful for syntax highlighting.

Note: This is not a standard markdown feature.

## Example

```
`_js console.log()`
```

## Installation

```
npm i -D remark-inline-code-language
```

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

### Options

Make sure to add in all options.

```js
.use(remarkInlineCodeLanguage, {
	// ...
})
```

#### `separator_position`

- Type: `"before" | "after" | "both"`
- Default: `"before"`

- `"before"`. Example: \``_js console.log()`\`
- `"after"`. Example: \``js_ console.log()`\`
- `"both"`. Example: \``_js_ console.log()`\`

#### `separator_character`

- Type: `string`
- Default: `"_"`

- `"_"`. Example: \``_js console.log()`\`. (`separator_position: "before"`)
- `"."`. Example: \``js. console.log()`\`. (`separator_position: "after"`)
- `"|"`. Example: \``|js| console.log()`\`. (`separator_position: "both"`)
