import { visit } from "unist-util-visit"

export default function attacher(separator) {
	if (!separator) return

	return function transformer(tree) {
		visit(tree, "inlineCode", function visitor(node) {
			within_inline_code_language(node, separator)
		})
	}
}

function within_inline_code_language(node, separator) {
	const [language, code] = node.value.split(separator, 2)
	if (language && code) {
		node.value = code
		node.lang = language.trim()
	}
	return node
}
