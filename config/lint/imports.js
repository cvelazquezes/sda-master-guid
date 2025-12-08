/**
 * Import/Module ESLint Rules
 *
 * Organization and best practices for imports.
 * Most of these rules are AUTO-FIXABLE.
 *
 * @version 2.0.0 - Enterprise standards with cycle detection and module hygiene
 */
module.exports = {
  rules: {
    // =========================================================================
    // IMPORT ORDER (AUTO-FIXABLE) - Google/Airbnb Standard
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
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
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
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react', 'react-native', 'type'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    // =========================================================================
    // IMPORT HYGIENE - Google Standard
    // =========================================================================

    /**
     * CRITICAL: Prevent circular dependencies
     * Circular imports cause runtime issues and are hard to debug
     * maxDepth: 3 balances thoroughness with performance
     */
    'import/no-cycle': ['error', { maxDepth: 3, ignoreExternal: true }],

    /**
     * Prevent importing self
     */
    'import/no-self-import': 'error',

    /**
     * Clean up unnecessary path segments
     * BAD: import x from './foo/../bar'
     * GOOD: import x from './bar'
     */
    'import/no-useless-path-segments': ['error', { noUselessIndex: true }],

    /**
     * Prevent relative imports to packages (monorepo safety)
     */
    'import/no-relative-packages': 'error',

    // =========================================================================
    // MODULE SYSTEM - Meta Standard
    // =========================================================================

    /**
     * Exports should be immutable
     * Prevents confusing behavior with mutable exports
     */
    'import/no-mutable-exports': 'error',

    /**
     * No AMD modules - use ES modules
     */
    'import/no-amd': 'error',

    /**
     * Prefer ES modules over CommonJS
     * Allow in config files via overrides
     */
    'import/no-commonjs': 'off', // Disabled: React Native needs CommonJS in some places

    // =========================================================================
    // DEPENDENCY MANAGEMENT - Airbnb Standard
    // =========================================================================

    /**
     * Ensure dependencies are declared in package.json
     * Prevents "works on my machine" issues
     */
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.{ts,tsx}',
          '**/*.spec.{ts,tsx}',
          '**/__tests__/**/*.{ts,tsx}',
          '**/jest.config.{js,ts}',
          '**/jest.setup.{js,ts}',
          '**/setupTests.{ts,tsx}',
          'e2e/**/*.{ts,tsx}',
          '**/testing/**/*.{ts,tsx}',
          '**/*.stories.{ts,tsx}',
          '**/storybook/**/*.{ts,tsx}',
          '.storybook/**/*.{ts,tsx,js}',
          'config/**/*.{js,ts}',
          'scripts/**/*.{js,ts}',
        ],
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],

    // =========================================================================
    // EXPORT CONSISTENCY
    // =========================================================================

    /**
     * Named exports are preferred for tree-shaking
     * Google prefers named exports
     */
    'import/prefer-default-export': 'off',

    /**
     * Disallow default exports (optional - Google preference)
     * Disabled: React components commonly use default exports
     */
    'import/no-default-export': 'off',

    /**
     * Prevent confusing default import naming
     * BAD: import { default as foo } from 'bar'
     */
    'import/no-named-default': 'error',

    /**
     * Prevent named export as default member
     * BAD: import foo from './foo'; foo.bar()
     * GOOD: import { bar } from './foo';
     */
    'import/no-named-as-default-member': 'warn',

    /**
     * Prevent importing default as named
     */
    'import/no-named-as-default': 'warn',

    // =========================================================================
    // ERROR PREVENTION
    // =========================================================================

    /**
     * Ensure imported modules can be resolved
     */
    'import/no-unresolved': [
      'error',
      {
        ignore: ['^@/', '^@shared/', '^@components/'],
      },
    ],

    /**
     * Ensure named imports correspond to named exports
     */
    'import/named': 'error',

    /**
     * Ensure default import corresponds to default export
     */
    'import/default': 'error',

    /**
     * Ensure namespace imports match exports
     */
    'import/namespace': 'error',

    /**
     * Prevent importing from deprecated/internal modules
     */
    'import/no-internal-modules': 'off', // Disabled: too restrictive for React Native

    // =========================================================================
    // WEBPACK/BUNDLER OPTIMIZATION
    // =========================================================================

    /**
     * Prevent dynamic require() calls
     * Breaks static analysis and tree-shaking
     */
    'import/no-dynamic-require': 'error',

    /**
     * Warn against import of entire libraries
     * Encourages tree-shakeable imports
     */
    'import/no-namespace': 'off', // Disabled: sometimes needed for icons, etc.

    // =========================================================================
    // ARCHITECTURE RESTRICTIONS
    // Design System and Theme Compliance
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
          // ===== THEME INDEX IMPORTS - Block specific named imports =====
          {
            name: '../shared/theme',
            importNames: ['designTokens', 'mobileFontSizes', 'mobileIconSizes', 'layoutConstants'],
            message:
              '❌ THEME VIOLATION: Direct token imports forbidden in features.\n' +
              '✅ FIX: Use useTheme() hook instead.\n' +
              'Example: const { spacing, typography, iconSizes } = useTheme();',
          },
          {
            name: '../../shared/theme',
            importNames: ['designTokens', 'mobileFontSizes', 'mobileIconSizes', 'layoutConstants'],
            message:
              '❌ THEME VIOLATION: Direct token imports forbidden in features.\n' +
              '✅ FIX: Use useTheme() hook instead.\n' +
              'Example: const { spacing, typography, iconSizes } = useTheme();',
          },
          {
            name: '../../../shared/theme',
            importNames: ['designTokens', 'mobileFontSizes', 'mobileIconSizes', 'layoutConstants'],
            message:
              '❌ THEME VIOLATION: Direct token imports forbidden in features.\n' +
              '✅ FIX: Use useTheme() hook instead.\n' +
              'Example: const { spacing, typography, iconSizes } = useTheme();',
          },
          {
            name: '../../../../shared/theme',
            importNames: ['designTokens', 'mobileFontSizes', 'mobileIconSizes', 'layoutConstants'],
            message:
              '❌ THEME VIOLATION: Direct token imports forbidden in features.\n' +
              '✅ FIX: Use useTheme() hook instead.\n' +
              'Example: const { spacing, typography, iconSizes } = useTheme();',
          },
          // ===== LODASH - Encourage specific imports =====
          {
            name: 'lodash',
            message: 'Import specific lodash functions: import debounce from "lodash/debounce"',
          },
          // ===== MOMENT - Deprecated, use date-fns =====
          {
            name: 'moment',
            message: 'moment is deprecated. Use date-fns instead.',
          },
        ],
        patterns: [
          // ===== THEME COMPLIANCE =====
          // Block direct designTokens file imports in feature code
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
