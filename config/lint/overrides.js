/**
 * ESLint Overrides
 *
 * STRICT POLICY: Only specific exceptions are allowed.
 * All production code must comply with all rules.
 */
module.exports = {
  overrides: [
    // =========================================================================
    // CONSTANT/CONFIG DEFINITION FILES - Magic numbers are allowed here
    // These files DEFINE the numeric values used throughout the app
    // =========================================================================
    {
      files: [
        // Constants
        'src/shared/constants/**/*.ts',
        // Theme tokens (design system values)
        'src/shared/theme/**/*.ts',
        // Config files (define timeouts, retry policies, etc.)
        'src/shared/config/**/*.ts',
        'src/config/**/*.ts',
      ],
      rules: {
        'no-magic-numbers': 'off',
      },
    },

    // =========================================================================
    // SHARED COMPONENTS - These wrap react-native primitives
    // They need direct access to Text/TextInput from react-native
    // Relaxed complexity rules since they handle many variants by design
    // =========================================================================
    {
      files: [
        'src/shared/components/Text.tsx',
        'src/shared/components/StandardInput.tsx',
        'src/shared/components/StandardButton.tsx',
        'src/shared/components/StandardModal.tsx',
        'src/shared/components/StandardPicker.tsx',
        'src/shared/components/Badge.tsx',
        'src/shared/components/EmptyState.tsx',
        'src/shared/components/FilterModal.tsx',
        'src/shared/components/LazyScreen.tsx',
        'src/shared/components/MenuCard.tsx',
        'src/shared/components/OptimizedComponents.tsx',
        'src/shared/components/OptimizedList.tsx',
        'src/shared/components/ScreenHeader.tsx',
        'src/shared/components/SearchBar.tsx',
        'src/shared/components/SectionHeader.tsx',
        'src/shared/components/SelectionModal.tsx',
        'src/shared/components/StatusIndicator.tsx',
        'src/shared/components/StatusFilterSection.tsx',
        'src/shared/components/TabBar.tsx',
        'src/shared/components/Card.tsx',
        'src/shared/components/IconButton.tsx',
        'src/shared/components/HierarchyFilterItem.tsx',
      ],
      rules: {
        'no-restricted-imports': 'off',
        'max-lines-per-function': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
        complexity: ['error', 25],
      },
    },

    // =========================================================================
    // THEME TOKENS - Complex configuration mappings
    // These define design system values with many variants
    // =========================================================================
    {
      files: ['src/shared/theme/tokens/**/*.ts'],
      rules: {
        'max-lines-per-function': 'off',
        complexity: 'off',
      },
    },

    // =========================================================================
    // SHARED UTILITIES - Complex helper functions
    // Functions like debounce, throttle, performance utilities
    // Non-null assertions allowed for performance-critical code
    // =========================================================================
    {
      files: [
        'src/shared/utils/**/*.ts',
        'src/shared/hooks/**/*.ts',
        'src/shared/services/**/*.ts',
        'src/utils/**/*.ts',
      ],
      rules: {
        'max-lines-per-function': ['error', { max: 100, skipBlankLines: true, skipComments: true }],
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },

    // =========================================================================
    // SHARED PATTERNS - Event bus, CQRS, etc.
    // Infrastructure code with inherent complexity
    // =========================================================================
    {
      files: ['src/shared/patterns/**/*.ts'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },

    // =========================================================================
    // APPLICATION SERVICES - Business logic with complex APIs
    // These services handle registration, payments, clubs etc.
    // =========================================================================
    {
      files: ['src/services/**/*.ts', 'src/context/**/*.tsx'],
      rules: {
        'max-params': ['error', 8],
      },
    },

    // =========================================================================
    // SCREEN INDEX FILES - Main screen components
    // These often include complex UI composition
    // =========================================================================
    {
      files: ['src/screens/**/index.tsx', 'src/components/**/index.tsx'],
      rules: {
        'max-lines-per-function': ['error', { max: 150, skipBlankLines: true, skipComments: true }],
      },
    },

    // =========================================================================
    // DETAIL MODALS - Complex modal components
    // These display detailed information with many fields
    // =========================================================================
    {
      files: ['src/components/*DetailModal.tsx', 'src/components/MatchCard.tsx'],
      rules: {
        'max-lines-per-function': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
        complexity: ['error', 15],
      },
    },

    // =========================================================================
    // CLUB-ADMIN SCREENS - Complex member management
    // =========================================================================
    {
      files: ['src/screens/club-admin/club-members/*.tsx'],
      rules: {
        complexity: ['error', 12],
      },
    },

    // =========================================================================
    // BUILD/CONFIG FILES - Different module system
    // =========================================================================
    {
      files: ['*.config.js', '*.config.ts', '.eslintrc.js', 'babel.config.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-require-imports': 'off',
      },
    },

    // =========================================================================
    // TEST FILES - Relaxed rules for testing
    // =========================================================================
    {
      files: [
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/tests/**/*.{ts,tsx}',
        '**/__tests__/**/*.{ts,tsx}',
        '**/testing/**/*.{ts,tsx}',
        '**/*.stories.{ts,tsx}',
      ],
      rules: {
        'no-magic-numbers': 'off',
        'max-lines-per-function': 'off',
        'max-nested-callbacks': 'off',
      },
    },

    // =========================================================================
    // MOCK DATA FILES - Development/testing fixtures
    // =========================================================================
    {
      files: ['**/mockData.ts', '**/mock*.ts', '**/*Mock*.ts', '**/fixtures/**/*.ts'],
      rules: {
        'no-magic-numbers': 'off',
      },
    },
  ],
};
