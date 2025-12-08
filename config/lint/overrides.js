/**
 * ESLint Overrides
 *
 * STRICT POLICY: Only specific exceptions are allowed.
 * All production code must comply with all rules.
 *
 * @version 2.0.0 - Simplified for better DX, aligned with enterprise standards
 */
module.exports = {
  overrides: [
    // =========================================================================
    // CONSTANTS FILES - All string/number rules disabled
    // This is the ONLY place where magic values are allowed
    // =========================================================================
    {
      files: ['src/shared/constants/**/*.ts', 'src/constants/**/*.ts'],
      rules: {
        'no-magic-numbers': 'off',
        'no-restricted-syntax': 'off',
        'no-console': 'off',
        'no-restricted-globals': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
      },
    },

    // =========================================================================
    // CONFIG/DEFINITION FILES - Magic strings and numbers allowed
    // These files define values but maintain type safety
    // =========================================================================
    {
      files: [
        // Type definitions
        'src/types/**/*.ts',
        'src/shared/types/**/*.ts',
        'src/features/**/types/**/*.ts',
        // Theme tokens (design system values)
        'src/shared/theme/**/*.ts',
        'src/presentation/theme/**/*.ts',
        // Config files
        'src/shared/config/**/*.ts',
        'src/config/**/*.ts',
        'src/infrastructure/config/**/*.ts',
        // i18n locale files
        'src/i18n/**/*.ts',
        'src/presentation/i18n/**/*.ts',
        // Validation schemas
        'src/shared/validation/**/*.ts',
      ],
      rules: {
        'no-magic-numbers': 'off',
        'no-restricted-imports': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
      },
    },

    // =========================================================================
    // SHARED COMPONENTS - Wrap react-native primitives
    // They need direct access to Text/TextInput from react-native
    // Relaxed complexity since they handle many variants by design
    // =========================================================================
    {
      files: [
        'src/shared/components/**/*.tsx',
        'src/presentation/components/primitives/**/*.tsx',
      ],
      rules: {
        'no-restricted-imports': 'off',
        'max-lines-per-function': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
        complexity: ['error', 20],
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        // Accessibility rules are enforced at usage, not definition
        'no-restricted-syntax': 'off',
      },
    },

    // =========================================================================
    // THEME TOKENS - Complex configuration mappings
    // These define design system values with many variants
    // =========================================================================
    {
      files: ['src/shared/theme/tokens/**/*.ts', 'src/presentation/theme/tokens/**/*.ts'],
      rules: {
        'max-lines-per-function': 'off',
        complexity: 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },

    // =========================================================================
    // SHARED UTILITIES - Complex helper functions
    // Non-null assertions allowed for performance-critical code
    // =========================================================================
    {
      files: [
        'src/shared/utils/**/*.ts',
        'src/shared/hooks/**/*.ts',
        'src/shared/services/**/*.ts',
        'src/shared/api/**/*.ts',
        'src/utils/**/*.ts',
        'src/infrastructure/**/*.ts',
        'src/presentation/hooks/**/*.ts',
      ],
      rules: {
        'max-lines-per-function': ['error', { max: 100, skipBlankLines: true, skipComments: true }],
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-unsafe-return': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
      },
    },

    // =========================================================================
    // APPLICATION SERVICES - Business logic with complex APIs
    // =========================================================================
    {
      files: [
        'src/services/**/*.ts',
        'src/context/**/*.tsx',
        'src/features/**/*.ts',
        'src/infrastructure/repositories/**/*.ts',
      ],
      rules: {
        'max-params': ['error', 6],
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
      },
    },

    // =========================================================================
    // SCREEN COMPONENTS - Main UI composition
    // Relaxed complexity and line limits
    // =========================================================================
    {
      files: [
        'src/screens/**/index.tsx',
        'src/screens/**/*.tsx',
        'src/presentation/screens/**/*.tsx',
        'src/components/**/index.tsx',
      ],
      rules: {
        'max-lines-per-function': ['error', { max: 150, skipBlankLines: true, skipComments: true }],
        complexity: ['error', 15],
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
      },
    },

    // =========================================================================
    // NAVIGATION - Complex navigation setup
    // =========================================================================
    {
      files: ['src/navigation/**/*.tsx', 'src/presentation/navigation/**/*.tsx'],
      rules: {
        'max-lines-per-function': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
        complexity: ['error', 20],
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },

    // =========================================================================
    // LOGGER SERVICE - Console is allowed ONLY here
    // =========================================================================
    {
      files: ['src/utils/logger.ts', 'src/shared/utils/logger.ts', 'src/infrastructure/logging/**/*.ts'],
      rules: {
        'no-console': 'off',
        'no-restricted-globals': 'off',
        'no-restricted-properties': 'off',
        'no-restricted-syntax': 'off',
      },
    },

    // =========================================================================
    // PERFORMANCE UTILITIES - Console allowed for performance monitoring
    // =========================================================================
    {
      files: ['src/shared/utils/performance.ts', 'src/utils/performance.ts'],
      rules: {
        'no-console': 'off',
        'no-restricted-globals': 'off',
      },
    },

    // =========================================================================
    // CONTEXT PROVIDERS - State management with complex logic
    // =========================================================================
    {
      files: [
        'src/contexts/**/*.tsx',
        'src/presentation/state/**/*.tsx',
        'src/state/**/*.tsx',
      ],
      rules: {
        'max-lines-per-function': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
        complexity: ['error', 15],
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },

    // =========================================================================
    // BUILD/CONFIG FILES - Different module system
    // =========================================================================
    {
      files: ['*.config.js', '*.config.ts', '.eslintrc.js', 'babel.config.js', 'metro.config.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        'no-restricted-syntax': 'off',
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
        'e2e/**/*.{ts,tsx}',
        '**/jest.setup.{ts,tsx}',
        '**/setupTests.{ts,tsx}',
      ],
      rules: {
        'no-magic-numbers': 'off',
        'max-lines-per-function': 'off',
        'max-nested-callbacks': 'off',
        'no-restricted-syntax': 'off',
        'no-console': 'off',
        'no-restricted-globals': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/require-await': 'off',
      },
    },

    // =========================================================================
    // MOCK DATA FILES - Development/testing fixtures
    // =========================================================================
    {
      files: ['**/mockData.ts', '**/mock*.ts', '**/*Mock*.ts', '**/fixtures/**/*.ts'],
      rules: {
        'no-magic-numbers': 'off',
        'no-restricted-syntax': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },

    // =========================================================================
    // SCRIPTS - Build and utility scripts
    // =========================================================================
    {
      files: ['scripts/**/*.{js,ts}'],
      rules: {
        'no-console': 'off',
        'no-restricted-globals': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-require-imports': 'off',
      },
    },

    // =========================================================================
    // STORYBOOK - Component documentation
    // =========================================================================
    {
      files: ['.storybook/**/*.{ts,tsx,js}', '**/*.stories.{ts,tsx}'],
      rules: {
        'no-magic-numbers': 'off',
        'no-restricted-syntax': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        'import/no-default-export': 'off',
      },
    },

    // =========================================================================
    // TYPE DECLARATION FILES
    // =========================================================================
    {
      files: ['**/*.d.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-restricted-syntax': 'off',
      },
    },

    // =========================================================================
    // INDEX/BARREL FILES - Re-exports only
    // =========================================================================
    {
      files: ['**/index.ts'],
      rules: {
        'max-lines': 'off',
      },
    },
  ],
};
