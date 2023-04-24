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
	let match

	if (options.separator_position === SEPARATOR_POSITION.BEFORE) {
		match = node.value.match(
			get_separator_regex(
				options.separator_position,
				options.separator_character
			)
		)
	}

	if (options.separator_position === SEPARATOR_POSITION.AFTER) {
		match = node.value.match(
			get_separator_regex(
				options.separator_position,
				options.separator_character
			)
		)
	}

	if (options.separator_position === SEPARATOR_POSITION.BOTH) {
		match = node.value.match(
			get_separator_regex(
				options.separator_position,
				options.separator_character
			)
		)
	}

	if (match) {
		const language = match[1]
		const code = match[2]

		node.value = code
		node.lang = language
	}

	return node
}

function get_separator_regex(
	separator_position = default_options.separator_position,
	separator_character = default_options.separator_character
) {
	let regex_string = ""

	// `_py print(Hello, World!)`
	if (separator_position === SEPARATOR_POSITION.BEFORE)
		regex_string = `^\\${separator_character}([a-z]+)\\s+(.+)$` // /^_([a-z]+)\s+(.+)$/i
	// `py_ print(Hello, World!)`
	if (separator_position === SEPARATOR_POSITION.AFTER)
		regex_string = `^([a-z]+)\\${separator_character}\\s+(.+)$` // /^([a-z]+)_\s+(.+)$/i
	// `_py_ print(Hello, World!)`
	if (separator_position === SEPARATOR_POSITION.BOTH)
		regex_string = `^\\${separator_character}([a-z]+)\\${separator_character}\\s+(.+)$` // /^_([a-z]+)_\s+(.+)$/i

	const new_regex = new RegExp(regex_string, "i")
	return new_regex
}
