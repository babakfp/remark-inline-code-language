import { visit } from "unist-util-visit"

const SEPARATOR_POSITION = {
	BEFORE: "before",
	AFTER: "after",
	BOTH: "both",
} as const

interface Options {
	separator_position: (typeof SEPARATOR_POSITION)[keyof typeof SEPARATOR_POSITION]
	separator_character: string
}

const default_options: Options = {
	separator_position: SEPARATOR_POSITION.BEFORE,
	separator_character: "_",
}

export default function attacher(options: Options = default_options) {
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

	if (options.separator_position === SEPARATOR_POSITION.AFTER) {
		const match = node.value.match(
			get_separator_position_after_regex(options.separator_character)
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
	// Example: /^_([a-z]+)\s+(.+)$/i
	const new_regex_string = `^${separator_character}([a-z]+)\\s+(.+)$`
	const new_regex = new RegExp(new_regex_string, "i")
	return new_regex
}

// `py_ print(Hello, World!)`
function get_separator_position_after_regex(
	separator_character = default_options.separator_character
) {
	// Example: /^([a-z]+)_\s+(.+)$/i
	const new_regex_string = `^([a-z]+)${separator_character}\\s+(.+)$`
	const new_regex = new RegExp(new_regex_string, "i")
	return new_regex
}
