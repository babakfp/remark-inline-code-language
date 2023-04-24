module.exports = {
	semi: false,
	tabWidth: 4,
	useTabs: true,
	singleQuote: false,
	printWidth: 80,
	arrowParens: "avoid",
	bracketSpacing: true,
	trailingComma: "es5",
	bracketSameLine: false,
	quoteProps: "as-needed",
	htmlWhitespaceSensitivity: "css",
	endOfLine: "auto",
	pluginSearchDirs: ["."],
	overrides: [
		{ files: "*.md", options: { tabWidth: 2 } },
	],
}