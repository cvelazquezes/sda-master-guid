/**
 * ESLint Configuration
 *
 * This configuration enforces strict code quality standards.
 * All rules are set to 'error' to ensure code compliance.
 *
 * Configuration is modularized in config/lint/ directory:
 * - base.js: Core JavaScript rules
 * - typescript.js: TypeScript-specific rules
 * - react.js: React and React Hooks rules
 * - imports.js: Import organization rules
 * - overrides.js: File-specific rule overrides
 */

const {
  baseRules,
  typescriptRules,
  reactRules,
  importRules,
  overridesConfig,
} = require('./config/lint');

module.exports = {
  root: true,

  // === EXTENDS ===
  extends: [
    'expo',
    'plugin:@typescript-eslint/recommended',
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
  ],
};
