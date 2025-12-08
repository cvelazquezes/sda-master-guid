/**
 * TypeScript ESLint Rules
 * Strict type safety and code quality for TypeScript
 *
 * @version 2.0.0 - Enterprise standards with type-aware rules
 *
 * NOTE: Type-aware rules require parserOptions.project in .eslintrc.js
 * These rules are THE most important TypeScript rules used by big tech.
 */
module.exports = {
  rules: {
    // =========================================================================
    // TYPE SAFETY - Core Rules
    // =========================================================================

    /**
     * Disallow explicit any type
     * Forces proper typing throughout the codebase
     */
    '@typescript-eslint/no-explicit-any': 'error',

    /**
     * Require explicit return types on functions
     * Improves code documentation and catches errors
     */
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

    /**
     * Module boundary types covered by explicit-function-return-type
     */
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // =========================================================================
    // TYPE SAFETY - Type-Aware Rules (Require parserOptions.project)
    // These are CRITICAL rules used by Google, Meta, Microsoft
    // =========================================================================

    /**
     * CRITICAL: Catch unhandled promises
     * Prevents silent failures in async code
     * Standard: Google/Meta REQUIRE this
     */
    '@typescript-eslint/no-floating-promises': 'error',

    /**
     * CRITICAL: Correct promise usage in conditions
     * Catches: if (promise) { ... } - always truthy!
     * Standard: Google/Meta REQUIRE this
     */
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: {
          arguments: false, // Allow void-returning callbacks
        },
      },
    ],

    /**
     * Only await promises/thenables
     * Catches: await nonPromiseValue
     */
    '@typescript-eslint/await-thenable': 'error',

    /**
     * Async functions must have await
     * Catches: async function that doesn't await anything
     */
    '@typescript-eslint/require-await': 'error',

    /**
     * Return await in try/catch for proper stack traces
     */
    '@typescript-eslint/return-await': ['error', 'in-try-catch'],

    // =========================================================================
    // TYPE SAFETY - Strict Rules (Microsoft Standard)
    // =========================================================================

    /**
     * Prevent any type propagation
     * Catches assigning any to typed variables
     */
    '@typescript-eslint/no-unsafe-assignment': 'error',

    /**
     * Prevent member access on any
     */
    '@typescript-eslint/no-unsafe-member-access': 'error',

    /**
     * Prevent calling any as function
     */
    '@typescript-eslint/no-unsafe-call': 'error',

    /**
     * Prevent returning any from functions
     */
    '@typescript-eslint/no-unsafe-return': 'error',

    /**
     * Prevent using any as argument
     */
    '@typescript-eslint/no-unsafe-argument': 'error',

    // =========================================================================
    // CODE QUALITY
    // =========================================================================

    /**
     * Disallow unused variables
     * Allow underscore prefix for intentionally unused
     */
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],

    /**
     * Disallow empty functions
     */
    '@typescript-eslint/no-empty-function': [
      'error',
      {
        allow: ['arrowFunctions', 'decoratedFunctions'],
      },
    ],

    /**
     * Disallow empty interfaces
     */
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: true,
      },
    ],

    /**
     * Disallow non-null assertions (!)
     * Forces proper null handling
     */
    '@typescript-eslint/no-non-null-assertion': 'error',

    /**
     * Disallow unnecessary type assertions
     */
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',

    /**
     * Detect conditions that are always truthy/falsy
     */
    '@typescript-eslint/no-unnecessary-condition': [
      'error',
      {
        allowConstantLoopConditions: true,
      },
    ],

    // =========================================================================
    // MODERN TYPESCRIPT - All Big Tech
    // =========================================================================

    /**
     * Use optional chaining (?.)
     * Modern: obj?.prop instead of obj && obj.prop
     */
    '@typescript-eslint/prefer-optional-chain': 'error',

    /**
     * Use nullish coalescing (??)
     * Modern: value ?? default instead of value || default
     */
    '@typescript-eslint/prefer-nullish-coalescing': [
      'error',
      {
        ignoreConditionalTests: true,
        ignoreMixedLogicalExpressions: true,
      },
    ],

    /**
     * Use readonly for properties that are never reassigned
     */
    '@typescript-eslint/prefer-readonly': 'error',

    /**
     * Use includes() instead of indexOf() !== -1
     */
    '@typescript-eslint/prefer-includes': 'error',

    /**
     * Use String.startsWith() and String.endsWith()
     */
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',

    /**
     * Use Array.find() instead of filter()[0]
     */
    '@typescript-eslint/prefer-find': 'error',

    /**
     * Use for-of loops where possible
     */
    '@typescript-eslint/prefer-for-of': 'error',

    /**
     * Prefer function types over interfaces with call signatures
     */
    '@typescript-eslint/prefer-function-type': 'error',

    // =========================================================================
    // CONSISTENCY - Airbnb/Google Standard
    // =========================================================================

    /**
     * Consistent type imports
     * import type { Foo } from 'bar' for type-only imports
     */
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: true,
        fixStyle: 'separate-type-imports',
      },
    ],

    /**
     * Consistent type exports
     */
    '@typescript-eslint/consistent-type-exports': [
      'error',
      {
        fixMixedExportsWithInlineTypeSpecifier: true,
      },
    ],

    /**
     * Consistent array type syntax
     * Use T[] for simple types, Array<T> for complex
     */
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],

    /**
     * Use Record<K, V> instead of { [key: K]: V }
     */
    '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],

    /**
     * Use type instead of interface for object types (consistency)
     */
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

    /**
     * Require type annotations in certain places
     */
    '@typescript-eslint/typedef': [
      'error',
      {
        memberVariableDeclaration: true,
        parameter: false, // Allow inference for parameters
        propertyDeclaration: true,
      },
    ],

    // =========================================================================
    // NAMING CONVENTIONS
    // =========================================================================

    /**
     * Comprehensive naming conventions
     * Note: Interface 'I' prefix is NOT TypeScript best practice (it's C# convention)
     */
    '@typescript-eslint/naming-convention': [
      'error',
      // Interfaces - PascalCase, no I prefix
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: false,
        },
      },
      // Type aliases - PascalCase
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
      },
      // Enums - PascalCase
      {
        selector: 'enum',
        format: ['PascalCase'],
      },
      // Enum members - UPPER_CASE or PascalCase
      {
        selector: 'enumMember',
        format: ['UPPER_CASE', 'PascalCase'],
      },
      // Constants - camelCase, UPPER_CASE, or PascalCase
      {
        selector: 'variable',
        modifiers: ['const'],
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      },
      // Functions - camelCase or PascalCase (for React components)
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
      },
      // Parameters - camelCase with optional leading underscore
      {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      },
      // Private members - camelCase with leading underscore
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
      },
      // Type parameters (generics) - PascalCase, single uppercase letter allowed
      {
        selector: 'typeParameter',
        format: ['PascalCase'],
        custom: {
          regex: '^(T|K|V|E|R|U|S|P)$|^[A-Z][a-zA-Z]+$',
          match: true,
        },
      },
    ],

    // =========================================================================
    // PROMISE HANDLING
    // =========================================================================

    /**
     * Disallow async functions which have no await expression
     */
    '@typescript-eslint/require-await': 'error',

    /**
     * Enforce consistent use of type assertions
     */
    '@typescript-eslint/consistent-type-assertions': [
      'error',
      {
        assertionStyle: 'as',
        objectLiteralTypeAssertions: 'never',
      },
    ],

    // =========================================================================
    // ADDITIONAL STRICTNESS
    // =========================================================================

    /**
     * Disallow @ts-ignore comments
     * Use @ts-expect-error with explanation instead
     */
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': true,
        'ts-nocheck': true,
        'ts-check': false,
        minimumDescriptionLength: 10,
      },
    ],

    /**
     * Disallow certain types
     */
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          Object: {
            message: 'Use object or a specific type instead',
            fixWith: 'object',
          },
          Function: {
            message: 'Use a specific function type instead',
          },
          Boolean: {
            message: 'Use boolean instead',
            fixWith: 'boolean',
          },
          Number: {
            message: 'Use number instead',
            fixWith: 'number',
          },
          String: {
            message: 'Use string instead',
            fixWith: 'string',
          },
          Symbol: {
            message: 'Use symbol instead',
            fixWith: 'symbol',
          },
          '{}': {
            message: 'Use object or Record<string, unknown> instead',
          },
        },
        extendDefaults: false,
      },
    ],

    /**
     * Disallow void type outside of generic or return types
     */
    '@typescript-eslint/no-invalid-void-type': 'error',

    /**
     * Disallow the void operator except when used to discard a value
     */
    'no-void': ['error', { allowAsStatement: true }],

    /**
     * Disallow require statements except in import statements
     */
    '@typescript-eslint/no-require-imports': 'error',

    /**
     * Disallow unnecessary namespace qualifiers
     */
    '@typescript-eslint/no-unnecessary-qualifier': 'error',

    /**
     * Prefer using concise optional chain expressions instead of chained logical ands
     */
    '@typescript-eslint/prefer-optional-chain': 'error',

    /**
     * Enforce using the nullish coalescing operator instead of logical chaining
     */
    '@typescript-eslint/prefer-nullish-coalescing': 'error',

    /**
     * Require Array#sort calls to always provide a compare function
     */
    '@typescript-eslint/require-array-sort-compare': ['error', { ignoreStringArrays: true }],

    /**
     * Disallow comparing an enum value with a non-enum value
     */
    '@typescript-eslint/no-unsafe-enum-comparison': 'error',
  },
};
