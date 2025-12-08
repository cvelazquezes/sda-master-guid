/**
 * Base ESLint Rules - Code Quality & Best Practices
 *
 * PHILOSOPHY: Strict but pragmatic. Rules should prevent bugs and improve
 * maintainability WITHOUT hurting developer experience.
 *
 * MAGIC NUMBERS:
 * - Common values (-1, 0, 1, 2, 10, 100, 1000) allowed inline
 * - HTTP status codes MUST be constants
 * - Business logic thresholds MUST be constants
 * - Array indices [0], [1] allowed, [2]+ should be named
 *
 * @version 2.1.0 - Balanced enterprise standards (Google/Meta/Airbnb/Microsoft)
 *
 * Sources:
 * - Google TypeScript Style Guide
 * - Airbnb JavaScript Style Guide
 * - Microsoft TypeScript Guidelines
 * - Meta (Facebook) Internal Standards
 */
module.exports = {
  rules: {
    // =========================================================================
    // CODE QUALITY - STRICT LIMITS
    // =========================================================================

    /**
     * Maximum 100 lines per function (excluding blank lines and comments)
     * Forces breaking down into smaller, focused functions
     * Standard: Google (50-150), Meta (100-200)
     */
    'max-lines-per-function': ['error', { max: 100, skipBlankLines: true, skipComments: true }],

    /**
     * Maximum cyclomatic complexity of 10
     * Forces simplification of conditional logic
     * Standard: Google (10-15), Airbnb (11)
     */
    complexity: ['error', 10],

    /**
     * Maximum nesting depth of 3
     * Forces flattening of deeply nested code
     * Standard: Google (3-4), Meta (4)
     */
    'max-depth': ['error', 3],

    /**
     * Maximum 3 nested callbacks
     * Forces use of async/await or extraction
     * Standard: Google (3), Meta (4)
     */
    'max-nested-callbacks': ['error', 3],

    /**
     * Maximum 4 parameters per function
     * Forces use of options objects for many params
     * Standard: Airbnb (3), Google (3-5)
     */
    'max-params': ['error', 4],

    /**
     * Maximum 500 lines per file
     * Forces modular code organization
     * Standard: Microsoft
     */
    'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],

    /**
     * Single class per file
     * Enforces single responsibility principle
     * Standard: Microsoft/Google
     */
    'max-classes-per-file': ['error', 1],

    // =========================================================================
    // BEST PRACTICES - Core JavaScript
    // =========================================================================

    'prefer-const': 'error',
    'no-var': 'error',
    'no-empty-pattern': 'error',
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'error',

    // =========================================================================
    // SECURITY RULES - Google/Microsoft Standard
    // =========================================================================

    /**
     * Prevent javascript: URLs (XSS vector)
     */
    'no-script-url': 'error',

    /**
     * Deprecated __proto__ usage
     */
    'no-proto': 'error',

    /**
     * Don't modify native prototypes (prototype pollution)
     */
    'no-extend-native': 'error',

    /**
     * Deprecated __iterator__ usage
     */
    'no-iterator': 'error',

    // =========================================================================
    // CODE QUALITY - Airbnb Standard
    // =========================================================================

    /**
     * Return early instead of using else
     * Cleaner, more readable code
     */
    'no-else-return': ['error', { allowElseIf: false }],

    /**
     * Combine nested if statements
     */
    'no-lonely-if': 'error',

    /**
     * Simplify ternary expressions
     * BAD: x === true ? true : false
     * GOOD: x === true
     */
    'no-unneeded-ternary': ['error', { defaultAssignment: false }],

    /**
     * Use spread operator instead of Object.assign
     * Modern JavaScript standard
     */
    'prefer-object-spread': 'error',

    /**
     * Use template literals instead of string concatenation
     */
    'prefer-template': 'error',

    /**
     * Use ES6 object shorthand
     * BAD: { name: name }
     * GOOD: { name }
     */
    'object-shorthand': ['error', 'always'],

    /**
     * Use destructuring where possible
     */
    'prefer-destructuring': [
      'error',
      {
        array: true,
        object: true,
      },
      { enforceForRenamedProperties: false },
    ],

    // =========================================================================
    // ASYNC PATTERNS - Meta Standard
    // =========================================================================

    /**
     * Prevent async Promise executor anti-pattern
     * The Promise constructor doesn't handle async errors correctly
     */
    'no-async-promise-executor': 'error',

    /**
     * Warn about await in loops (usually should be Promise.all)
     * Can cause performance issues
     */
    'no-await-in-loop': 'warn',

    /**
     * Prevent race conditions in async code
     */
    'require-atomic-updates': 'error',

    /**
     * Promise executor should not return values
     */
    'no-promise-executor-return': 'error',

    // =========================================================================
    // ERROR HANDLING - Google Standard
    // =========================================================================

    /**
     * Don't catch errors just to rethrow them
     * Useless try-catch blocks add noise
     */
    'no-useless-catch': 'error',

    /**
     * Disallow duplicate imports
     */
    'no-duplicate-imports': 'error',

    // =========================================================================
    // DEBUG PREVENTION
    // =========================================================================

    'no-debugger': 'error',
    'no-alert': 'error',

    // =========================================================================
    // MAGIC NUMBERS - BALANCED ENFORCEMENT
    // =========================================================================

    /**
     * Magic Numbers Policy - Pragmatic approach based on real enterprise usage
     *
     * ALLOWED INLINE (common, self-documenting values):
     * - -1: Array indexOf not found, decrement
     * - 0: Array start, falsy check, initialization
     * - 1: Increment, array first element, boolean-like
     * - 2: Common divisor, pair operations
     * - 10: Radix for parseInt, common base
     * - 100: Percentage calculations
     * - 1000: Milliseconds in second (common in timers)
     *
     * MUST BE CONSTANTS:
     * - HTTP status codes (200, 201, 400, 401, 403, 404, 500, etc.)
     * - Business logic thresholds (MAX_RETRIES, TIMEOUT_MS, PAGE_SIZE)
     * - Configuration values (PORT, BATCH_SIZE, CACHE_TTL)
     * - Domain-specific values (MINIMUM_AGE, MAX_FILE_SIZE)
     *
     * WHY THIS APPROACH:
     * - Google/Meta internal guides allow common values inline
     * - Airbnb has this rule OFF entirely
     * - Balance: catch meaningful magic numbers, allow obvious ones
     */
    'no-magic-numbers': [
      'error',
      {
        ignore: [
          -1, // indexOf not found, decrement
          0, // initialization, falsy, array start
          1, // increment, first element
          2, // common pair operations, divide by 2
          10, // parseInt radix, decimal base
          100, // percentage calculations
          1000, // milliseconds in second
        ],
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
        enforceConst: true,
        detectObjects: false, // Don't flag object properties (too noisy)
      },
    ],

    // =========================================================================
    // ADDITIONAL BEST PRACTICES
    // =========================================================================

    /**
     * Require default case in switch statements
     */
    'default-case': ['error', { commentPattern: '^no default$' }],

    /**
     * Default case should be last in switch
     */
    'default-case-last': 'error',

    /**
     * Require === for null comparisons
     */
    'no-eq-null': 'error',

    /**
     * Disallow unnecessary use of .call() and .apply()
     */
    'no-useless-call': 'error',

    /**
     * Disallow redundant return statements
     */
    'no-useless-return': 'error',

    /**
     * Restricted syntax patterns
     */
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain. Use Object.keys() or Object.entries() instead.',
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are rarely needed. Consider refactoring.',
      },
      {
        selector: 'WithStatement',
        message: 'with statement is deprecated and forbidden.',
      },
    ],

    /**
     * Prefer arrow functions for callbacks
     */
    'prefer-arrow-callback': ['error', { allowNamedFunctions: false, allowUnboundThis: true }],

    /**
     * Use rest parameters instead of arguments
     */
    'prefer-rest-params': 'error',

    /**
     * Use spread operator instead of .apply()
     */
    'prefer-spread': 'error',

    /**
     * Require Symbol description
     */
    'symbol-description': 'error',

    /**
     * Require radix parameter for parseInt
     */
    radix: 'error',

    /**
     * Disallow unused expressions
     */
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],

    /**
     * Disallow unnecessary constructors
     */
    'no-useless-constructor': 'error',

    /**
     * Disallow renaming import, export, and destructured assignments to the same name
     */
    'no-useless-rename': 'error',
  },
};
