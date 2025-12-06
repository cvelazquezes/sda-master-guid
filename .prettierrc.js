/**
 * Prettier Configuration
 *
 * Auto-formats code on save.
 * Works with ESLint via eslint-plugin-prettier.
 */
module.exports = {
  // Line length - matches ESLint printWidth
  printWidth: 100,

  // Indentation
  tabWidth: 2,
  useTabs: false,

  // Strings
  singleQuote: true,

  // Semicolons
  semi: true,

  // Trailing commas - ES5 compatible
  trailingComma: 'es5',

  // Brackets
  bracketSpacing: true,
  bracketSameLine: false,

  // Arrow functions
  arrowParens: 'always',

  // JSX
  jsxSingleQuote: false,

  // Line endings
  endOfLine: 'lf',

  // Prose wrapping for markdown
  proseWrap: 'preserve',

  // HTML whitespace sensitivity
  htmlWhitespaceSensitivity: 'css',

  // Embedded language formatting
  embeddedLanguageFormatting: 'auto',

  // Single attribute per line in JSX
  singleAttributePerLine: false,
};
