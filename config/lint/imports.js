/**
 * Import/Module ESLint Rules
 *
 * Organization and best practices for imports.
 * Most of these rules are AUTO-FIXABLE.
 */
module.exports = {
  rules: {
    // =========================================================================
    // IMPORT ORDER (AUTO-FIXABLE)
    // =========================================================================

    /**
     * Imports must be at the top of the file
     */
    'import/first': 'error',

    /**
     * Newline after import block
     */
    'import/newline-after-import': ['error', { count: 1 }],

    /**
     * No duplicate imports from same module
     */
    'import/no-duplicates': 'error',

    /**
     * Import order:
     * 1. Built-in (node) modules
     * 2. External packages (npm)
     * 3. Internal modules (project)
     * 4. Parent/sibling/index imports
     */
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
        ],
        'newlines-between': 'never',
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'react-native',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react', 'react-native'],
      },
    ],

    // =========================================================================
    // IMPORT RESTRICTIONS
    // =========================================================================

    /**
     * Must use shared components instead of raw React Native Text/TextInput
     * This enforces design system compliance
     */
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react-native',
            importNames: ['Text', 'TextInput'],
            message:
              'Use Text and Input from @shared/components instead of react-native.',
          },
        ],
      },
    ],
  },
};
