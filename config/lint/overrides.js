/**
 * ESLint Overrides
 *
 * STRICT POLICY: Only specific exceptions are allowed.
 * All production code must comply with all rules.
 */
module.exports = {
  overrides: [
    // =========================================================================
    // CONSTANT/CONFIG DEFINITION FILES - Magic numbers AND strings are allowed
    // These files DEFINE the values used throughout the app
    // =========================================================================
    {
      files: [
        // Constants
        'src/shared/constants/**/*.ts',
        // Type definitions (define enums, constants, type unions)
        'src/types/**/*.ts',
        'src/shared/types/**/*.ts',
        'src/features/**/types/**/*.ts',
        // Theme tokens (design system values)
        'src/shared/theme/**/*.ts',
        // Config files (define timeouts, retry policies, etc.)
        'src/shared/config/**/*.ts',
        'src/config/**/*.ts',
        // i18n locale files (define translation strings)
        'src/i18n/**/*.ts',
        // Logger files (define sensitive fields, log levels)
        'src/shared/utils/logger.ts',
        'src/utils/logger.ts',
        // Note: sentry.ts now uses constants
        // Note: errors.ts now uses constants
        // Validation utilities (define ValidationError name)
        'src/shared/utils/validation.ts',
        'src/utils/validation.ts',
        // Note: circuitBreaker.ts now uses constants
        // Note: secureStorage.ts, rateLimit.ts, requestBatcher.ts now use constants
        // Infrastructure services (define types and internal error handling)
        'src/shared/services/offline.ts',
        // Note: csrfProtection.ts and cursorPagination.ts now use constants
        // Component config files (define property key arrays)
        'src/components/**/config.ts',
      ],
      rules: {
        'no-magic-numbers': 'off',
        // Magic strings are allowed in definition files
        'no-restricted-syntax': 'off',
        // Console allowed for development warnings in config/theme files
        'no-console': 'off',
        'no-restricted-globals': 'off',
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
        // Allow template literals in logger calls for component debugging
        'no-restricted-syntax': [
          'error',
          // Keep all rules except template literal restrictions for loggers
          {
            selector:
              'CallExpression[callee.object.name="Alert"][callee.property.name="alert"] > Literal:first-child',
            message:
              'Use MESSAGES.TITLES.* constant for Alert title instead of string literal. Import from @/shared/constants',
          },
        ],
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
    // Template literals in logger calls allowed for dynamic logging
    // =========================================================================
    {
      files: [
        'src/shared/utils/**/*.ts',
        'src/shared/hooks/**/*.ts',
        'src/shared/services/**/*.ts',
        'src/shared/api/**/*.ts',
        'src/utils/**/*.ts',
      ],
      excludedFiles: [
        // Files in the definition files override (no-restricted-syntax: 'off')
        'src/shared/utils/logger.ts',
        'src/utils/logger.ts',
        'src/shared/utils/validation.ts',
        'src/utils/validation.ts',
        'src/shared/services/offline.ts',
      ],
      rules: {
        'max-lines-per-function': ['error', { max: 100, skipBlankLines: true, skipComments: true }],
        '@typescript-eslint/no-non-null-assertion': 'off',
        // Allow template literals in logger calls for infrastructure code
        // These are low-level utilities where dynamic logging is appropriate
        'no-restricted-syntax': [
          'error',
          // Keep all rules except template literal restrictions for loggers
          {
            selector:
              'CallExpression[callee.object.name="Alert"][callee.property.name="alert"] > Literal:first-child',
            message:
              'Use MESSAGES.TITLES.* constant for Alert title instead of string literal. Import from @/shared/constants',
          },
          {
            selector: 'ThrowStatement > NewExpression[callee.name="Error"] > Literal',
            message:
              'Use MESSAGES.ERRORS.* constant for Error message instead of string literal. Import from @/shared/constants',
          },
          {
            selector: 'NewExpression[callee.name="AuthError"] > Literal:first-child',
            message:
              'Use ERROR_MESSAGES.AUTH.* constant for AuthError instead of string literal. Import from @/shared/constants',
          },
          {
            selector: 'NewExpression[callee.name="AppError"] > Literal:first-child',
            message:
              'Use ERROR_MESSAGES.* constant for AppError message instead of string literal. Import from @/shared/constants',
          },
          {
            selector: 'NewExpression[callee.name="AppError"] > Literal:nth-child(2)',
            message:
              'Use ERROR_CODES.* constant for AppError error code instead of string literal. Import from @/shared/constants',
          },
          // Storage keys with @ prefix
          {
            selector: 'Literal[value=/^@[a-z_]+$/]',
            message:
              'Storage key with @ prefix should be a constant. Use STORAGE_KEYS.* from @/shared/constants',
          },
          // camelCase config keys
          {
            selector: 'Property > Literal[value=/^[a-z]+[A-Z][a-zA-Z]{5,}$/]',
            message:
              'camelCase string in property value should be a constant. Use FEATURE_FLAG_KEY.* or similar from @/shared/constants',
          },
          // Short strings in arrays (user groups, tags)
          {
            selector: 'ArrayExpression > Literal[value=/^[a-z]{4,12}$/]',
            message:
              'Short string in array should be a constant. Use USER_GROUP.* or similar from @/shared/constants',
          },
          // snake_case strings
          {
            selector: 'Literal[value=/^[a-z]+_[a-z_]+$/]',
            message: 'snake_case string should be a constant. Import from @/shared/constants',
          },
          // Environment name strings
          {
            selector:
              "BinaryExpression[operator='==='] > Literal[value=/^(development|production|staging|test)$/]",
            message:
              'Use isDevelopment(), isProduction(), isStaging() helpers instead of string comparison. Import from @/shared/config/environment',
          },
          // typeof comparison strings
          {
            selector:
              "BinaryExpression[operator='==='][left.operator='typeof'] > Literal[value=/^(string|number|boolean|object|function|undefined|symbol|bigint)$/]",
            message: 'Use TYPEOF.* constant for typeof comparison. Import from @/shared/constants',
          },
          // Health status strings
          {
            selector: 'Literal[value=/^(healthy|unhealthy|degraded)$/]',
            message:
              'Use HEALTH_STATUS.* constant for health status. Import from @/shared/constants',
          },
          // Query scope strings
          {
            selector: "Property[key.name='scope'] > Literal[value=/^(my|all|club)$/]",
            message: 'Use QUERY_SCOPE.* constant for query scope. Import from @/shared/constants',
          },
          // String literals in constructors (new Error, etc.)
          {
            selector: 'NewExpression > Literal[value=/^.{3,}$/]',
            message:
              'String literal in constructor should be a constant. Use ERROR_MESSAGES.* or LOG_MESSAGES.* from @/shared/constants',
          },
          // UPPER_CASE strings
          {
            selector: 'Literal[value=/^[A-Z][A-Z0-9_]{2,}$/]',
            message:
              'UPPER_CASE string should be a constant. Import from @/shared/constants or define there',
          },
          // PascalCase strings
          {
            selector: 'Literal[value=/^[A-Z][a-z]+([A-Z][a-z]+)+$/]',
            message: 'PascalCase string should be a constant. Import from @/shared/constants',
          },
        ],
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
        // Infrastructure code may use inline error messages
        'no-restricted-syntax': 'off',
      },
    },

    // =========================================================================
    // APPLICATION SERVICES - Business logic with complex APIs
    // These services handle registration, payments, clubs etc.
    // =========================================================================
    {
      files: ['src/services/**/*.ts', 'src/context/**/*.tsx', 'src/features/**/*.ts'],
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
    // LOGGER SERVICE - Console is allowed ONLY here
    // This is the ONLY file that should use console directly
    // =========================================================================
    {
      files: ['src/utils/logger.ts', 'src/shared/utils/logger.ts'],
      rules: {
        'no-console': 'off',
        'no-restricted-globals': 'off',
        'no-restricted-properties': 'off',
      },
    },

    // =========================================================================
    // PERFORMANCE UTILITIES - Console allowed for performance monitoring
    // These utilities may need direct console for performance measurements
    // =========================================================================
    {
      files: ['src/shared/utils/performance.ts'],
      rules: {
        'no-console': 'off',
        'no-restricted-globals': 'off',
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
        'e2e/**/*.{ts,tsx}',
      ],
      rules: {
        'no-magic-numbers': 'off',
        'max-lines-per-function': 'off',
        'max-nested-callbacks': 'off',
        // Magic strings allowed in tests for readability
        'no-restricted-syntax': 'off',
        // Console allowed in tests for debugging
        'no-console': 'off',
        'no-restricted-globals': 'off',
      },
    },

    // =========================================================================
    // VALIDATION SCHEMAS - Zod error messages are legitimate string literals
    // =========================================================================
    // Note: validation schemas now use constants for error messages

    // =========================================================================
    // SCREEN COMPONENTS - Allow template literals for dynamic UI content
    // =========================================================================
    {
      files: ['src/screens/**/*.tsx', 'src/screens/**/*.ts'],
      rules: {
        // Allow template literals in screens for dynamic content
        'no-restricted-syntax': [
          'error',
          // Only enforce Alert and Error rules in screens
          {
            selector:
              'CallExpression[callee.object.name="Alert"][callee.property.name="alert"] > Literal',
            message: 'Alert messages must use MESSAGES.* constants or t()',
          },
          {
            selector: 'ThrowStatement NewExpression[callee.name=/Error$/] > Literal',
            message: 'Error messages must use ERROR_MESSAGES.* constants',
          },
        ],
      },
    },

    // =========================================================================
    // MOCK DATA FILES - Development/testing fixtures
    // =========================================================================
    {
      files: ['**/mockData.ts', '**/mock*.ts', '**/*Mock*.ts', '**/fixtures/**/*.ts'],
      rules: {
        'no-magic-numbers': 'off',
        // Magic strings allowed in mock data
        'no-restricted-syntax': 'off',
      },
    },
  ],
};
