import { visit } from "unist-util-visit"

const SEPARATOR_POSITION = {
	BEFORE: "before",
	AFTER: "after",
	BOTH: "both",
}

/**
 * @typedef Options
 * @prop {...SEPARATOR_POSITION} separator_position
 * @prop {string} separator_character
 */

/** @type {Options} */
const default_options = {
	separator_position: SEPARATOR_POSITION.BEFORE,
	separator_character: "_",
}

/**
 * @param {Options} options
 */
export default function attacher(options = default_options) {
	return function transformer(tree) {
		visit(tree, "inlineCode", function visitor(node) {
			within_inline_code_language(node, options)
		})
	}
}

function within_inline_code_language(node, options) {
	if (options.separator_position === SEPARATOR_POSITION.BEFORE) {
		const match = node.value.match(
			get_separator_position_before_regex(options.separator_character)
		)

		if (match) {
			const language = match[1]
			const code = match[2]

			node.value = code
			node.lang = language
		}
	}

	return node
}

// `_py print(Hello, World!)`
function get_separator_position_before_regex(
	separator_character = default_options.separator_character
) {
	// Example: /^_[a-z]+\s+.+$/i
	const new_regex_string = `^${separator_character}([a-z]+)\\s+(.+)$`
	const new_regex = new RegExp(new_regex_string, "i")
	return new_regex
}
