import { visit } from "unist-util-visit"

const SEPARATOR_POSITION = {
	BEFORE: "before",
	AFTER: "after",
	BOTH: "both",
} as const

interface Options {
	separator_character: string
	separator_position: (typeof SEPARATOR_POSITION)[keyof typeof SEPARATOR_POSITION]
}

interface Inline_Code {
	type: "inlineCode"
	value: string
	lang?: string
	[key: string]: any
}

const default_options: Options = {
	separator_character: "_",
	separator_position: SEPARATOR_POSITION.BEFORE,
}

export default function attacher(options: Options = default_options) {
	return function transformer(tree: any) {
		visit(tree, "inlineCode", function visitor(node) {
			transform_node(node, options)
		})
	}
}

function transform_node(node: Inline_Code, options: Options) {
	const transformed_values = get_transformed_values(node, options)

	if (transformed_values) {
		node.value = transformed_values.code
		node.lang = transformed_values.language
	}

	return node
}

function get_transformed_values(node: Inline_Code, options: Options) {
	let match

	if (options.separator_position === SEPARATOR_POSITION.BEFORE) {
		match = node.value.match(
			get_separator_regex(
				options.separator_character,
				options.separator_position
			)
		)
	}

	if (options.separator_position === SEPARATOR_POSITION.AFTER) {
		match = node.value.match(
			get_separator_regex(
				options.separator_character,
				options.separator_position
			)
		)
	}

	if (options.separator_position === SEPARATOR_POSITION.BOTH) {
		match = node.value.match(
			get_separator_regex(
				options.separator_character,
				options.separator_position
			)
		)
	}

	if (match) {
		return {
			code: match[2],
			language: match[1],
		}
	}
}

function get_separator_regex(
	separator_character = default_options.separator_character,
	separator_position = default_options.separator_position
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
