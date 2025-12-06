/**
 * Base ESLint Rules - Code Quality & Best Practices
 *
 * ALL RULES ARE STRICT - NO EXCEPTIONS.
 * If code doesn't comply, FIX IT.
 *
 * MAGIC NUMBERS: Only -1, 0, 1 allowed inline.
 * Everything else MUST be a named constant.
 */
module.exports = {
  rules: {
    // =========================================================================
    // CODE QUALITY - STRICT LIMITS
    // =========================================================================

    /**
     * Maximum 100 lines per function (excluding blank lines and comments)
     * Forces breaking down into smaller, focused functions
     */
    'max-lines-per-function': ['error', { max: 100, skipBlankLines: true, skipComments: true }],

    /**
     * Maximum cyclomatic complexity of 10
     * Forces simplification of conditional logic
     */
    complexity: ['error', 10],

    /**
     * Maximum nesting depth of 3
     * Forces flattening of deeply nested code
     */
    'max-depth': ['error', 3],

    /**
     * Maximum 3 nested callbacks
     * Forces use of async/await or extraction
     */
    'max-nested-callbacks': ['error', 3],

    /**
     * Maximum 4 parameters per function
     * Forces use of options objects for many params
     */
    'max-params': ['error', 4],

    // =========================================================================
    // BEST PRACTICES
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
    // CONSOLE & DEBUG
    // =========================================================================

    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'no-debugger': 'error',
    'no-alert': 'error',

    // =========================================================================
    // MAGIC NUMBERS - STRICT ENFORCEMENT
    // =========================================================================

    /**
     * NO MAGIC NUMBERS!
     *
     * Only -1, 0, 1 are allowed inline.
     * All other numbers MUST be named constants.
     *
     * BAD:  const timeout = 5000;
     * GOOD: const timeout = TIMING.DEFAULT_TIMEOUT;
     *
     * BAD:  if (status === 200) { ... }
     * GOOD: if (status === HTTP_STATUS.OK) { ... }
     */
    'no-magic-numbers': [
      'error',
      {
        ignore: [-1, 0, 1],
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
        enforceConst: true,
        detectObjects: true,
      },
    ],
  },
};
