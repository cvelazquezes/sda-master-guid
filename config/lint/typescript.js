/**
 * TypeScript ESLint Rules
 * Strict type safety and code quality for TypeScript
 */
module.exports = {
  rules: {
    // === TYPE SAFETY ===
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
        allowDirectConstAssertionInArrowFunctions: true,
        allowConciseArrowFunctionExpressionsStartingWithVoid: true,
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off', // covered by explicit-function-return-type

    // === CODE QUALITY ===
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-empty-interface': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    // Rules below require type-checking (parserOptions.project)
    // '@typescript-eslint/prefer-optional-chain': 'error',
    // '@typescript-eslint/prefer-nullish-coalescing': 'error',

    // === NAMING CONVENTIONS ===
    // Note: Interface 'I' prefix is NOT TypeScript best practice (it's C# convention)
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
      },
      {
        selector: 'enum',
        format: ['PascalCase'],
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE', 'PascalCase'], // Allow both for flexibility
      },
      {
        selector: 'variable',
        modifiers: ['const'],
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      },
    ],

    // === ASYNC (requires type-checking, disabled for performance) ===
    // '@typescript-eslint/no-floating-promises': 'error',
    // '@typescript-eslint/no-misused-promises': 'error',
    // '@typescript-eslint/await-thenable': 'error',
    // '@typescript-eslint/promise-function-async': 'error',
  },
};

