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
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
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
     *
     * Additional restrictions for architecture compliance:
     * - designTokens: Use useTheme() hook instead of direct token imports
     * - layoutConstants: Use literal values ('row', 'center') - unnecessary abstraction
     * - mobileTypography, mobileIconSizes: Use useTheme().typography, useTheme().iconSizes
     * - MESSAGES: Use t() from i18n instead of hardcoded message constants
     *
     * NOTE: These restrictions are disabled for src/shared/components via overrides.js
     */
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react-native',
            importNames: ['Text', 'TextInput'],
            message: 'Use Text and Input from @shared/components instead of react-native.',
          },
        ],
        patterns: [
          // ===== THEME COMPLIANCE =====
          // Block direct designTokens imports in feature code
          {
            group: ['**/theme/designTokens', '**/theme/designTokens.ts', '**/designTokens'],
            message:
              '❌ THEME VIOLATION: Direct designTokens import forbidden in features.\n' +
              '✅ FIX: Use useTheme() hook instead.\n' +
              'Example: const { spacing, colors, radii, iconSizes } = useTheme();',
          },
          // Block layoutConstants - unnecessary string wrappers
          {
            group: ['**/theme/layoutConstants', '**/layoutConstants'],
            message:
              '❌ ARCHITECTURE VIOLATION: layoutConstants is unnecessary abstraction.\n' +
              "✅ FIX: Use literal values directly: 'row', 'center', 'space-between'",
          },
          // Block mobileTypography, mobileIconSizes direct imports
          {
            group: ['**/theme/mobileTypography', '**/mobileTypography'],
            message:
              '❌ THEME VIOLATION: Direct mobileTypography import forbidden in features.\n' +
              '✅ FIX: Use useTheme().typography instead.',
          },
          {
            group: ['**/theme/mobileIconSizes', '**/mobileIconSizes'],
            message:
              '❌ THEME VIOLATION: Direct mobileIconSizes import forbidden in features.\n' +
              '✅ FIX: Use useTheme().iconSizes instead.',
          },
          // Block mobileFontSizes direct imports
          {
            group: ['**/theme/mobileFontSizes', '**/mobileFontSizes'],
            message:
              '❌ THEME VIOLATION: Direct mobileFontSizes import forbidden in features.\n' +
              '✅ FIX: Use useTheme().typography.fontSizes instead.',
          },

          // ===== I18N COMPLIANCE =====
          // Block MESSAGES constants
          {
            group: ['**/constants/messages', '**/constants/messages.ts'],
            importNames: ['MESSAGES'],
            message:
              '❌ I18N VIOLATION: MESSAGES constant is deprecated.\n' +
              '✅ FIX: Use i18n t() function instead.\n' +
              'Example: t("errors.failedToLoadData")',
          },
        ],
      },
    ],
  },
};
