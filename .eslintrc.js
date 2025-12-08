/**
 * ESLint Configuration
 *
 * This configuration enforces strict code quality standards.
 * All rules are set to 'error' to ensure code compliance.
 *
 * @version 2.0.0 - Enterprise standards with type-checking
 *
 * Configuration is modularized in config/lint/ directory:
 * - base.js: Core JavaScript rules (code quality, async, security basics)
 * - typescript.js: TypeScript-specific rules (type safety, naming, async)
 * - react.js: React and React Native rules (hooks, performance, jsx)
 * - imports.js: Import organization and architecture rules
 * - strings.js: High-value string literal rules
 * - logging.js: Logger service enforcement
 * - security.js: Security-focused rules (injection, crypto, disclosure)
 * - accessibility.js: React Native accessibility rules
 * - overrides.js: File-specific rule exceptions
 */

const {
  baseRules,
  typescriptRules,
  reactRules,
  importRules,
  stringsRules,
  loggingRules,
  securityRules,
  accessibilityRules,
  overridesConfig,
} = require('./config/lint');

module.exports = {
  root: true,

  // === EXTENDS ===
  extends: [
    'expo',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:prettier/recommended', // Must be last
  ],

  // === PARSER ===
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    // Enable type-aware rules
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },

  // === PLUGINS ===
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import', 'prettier'],

  // === SETTINGS ===
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },

  // === RULES ===
  rules: {
    // Prettier integration
    'prettier/prettier': 'error',

    // Merge all modular rules
    ...baseRules.rules,
    ...typescriptRules.rules,
    ...reactRules.rules,
    ...importRules.rules,
    ...stringsRules.rules,
    ...loggingRules.rules,
    ...securityRules.rules,
    ...accessibilityRules.rules,
  },

  // === OVERRIDES ===
  ...overridesConfig,

  // === IGNORED PATTERNS ===
  ignorePatterns: [
    'node_modules/',
    'android/',
    'ios/',
    '.expo/',
    'coverage/',
    'dist/',
    '*.config.js',
    'babel.config.js',
    'metro.config.js',
    '.eslintrc.js',
    'config/lint/*.js',
  ],
};
