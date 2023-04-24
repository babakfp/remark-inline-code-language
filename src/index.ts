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
			transform_node(node, options)
		})
	}
}

function transform_node(node, options: Options) {
	const values = get_transformed_values(node, options)

	if (values) {
		node.value = values.code
		node.lang = values.language
	}

	return node
}

function get_transformed_values(node, options: Options) {
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
		return {
			code: match[2],
			language: match[1],
		}
	}

	return null
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

	return new RegExp(regex_string, "i")
}
