/**
 * Logging ESLint Rules - Enforce Use of Logger Service
 *
 * ALL CONSOLE CALLS MUST USE THE LOGGER SERVICE.
 * Direct console usage is FORBIDDEN in production code.
 *
 * This configuration enforces:
 * - No direct console.log, console.warn, console.error, etc.
 * - Use logger.info(), logger.warn(), logger.error() instead
 * - Structured logging with sanitization
 *
 * WHY?
 * 1. Sensitive data sanitization - logger redacts passwords, tokens, etc.
 * 2. Structured logging - consistent format across the app
 * 3. Production-ready - logs are sent to external services (Sentry, etc.)
 * 4. Performance tracking - logger.performance() for metrics
 * 5. Easy to disable in production builds
 *
 * USAGE:
 * ❌ BAD:  console.log('User logged in', user);
 * ✅ GOOD: logger.info('User logged in', user);
 *
 * ❌ BAD:  console.error('Failed to fetch', error);
 * ✅ GOOD: logger.error('Failed to fetch', error);
 *
 * ❌ BAD:  console.warn('Deprecated API');
 * ✅ GOOD: logger.warn('Deprecated API');
 *
 * @version 1.0.0
 */
module.exports = {
  rules: {
    // =========================================================================
    // CONSOLE USAGE - STRICT BAN
    // =========================================================================

    /**
     * NO DIRECT CONSOLE USAGE!
     *
     * All console methods are forbidden.
     * Use the logger service from @/utils/logger instead.
     *
     * The logger provides:
     * - logger.debug() - Development debugging
     * - logger.info()  - General information
     * - logger.warn()  - Warnings
     * - logger.error() - Errors with stack traces
     * - logger.performance() - Performance metrics
     */
    'no-console': 'error',

    // =========================================================================
    // LOGGING BEST PRACTICES VIA AST PATTERNS
    // =========================================================================

    /**
     * Additional checks for common logging anti-patterns
     */
    'no-restricted-properties': [
      'error',

      // -----------------------------------------------------------------------
      // Disallow window.console
      // -----------------------------------------------------------------------
      {
        object: 'window',
        property: 'console',
        message: 'Use logger from @/utils/logger instead of window.console',
      },

      // -----------------------------------------------------------------------
      // Disallow global.console (Node.js)
      // -----------------------------------------------------------------------
      {
        object: 'global',
        property: 'console',
        message: 'Use logger from @/utils/logger instead of global.console',
      },
    ],

    // =========================================================================
    // RESTRICTED GLOBALS
    // =========================================================================

    /**
     * Prevent accidental console usage via destructuring or assignment
     */
    'no-restricted-globals': [
      'error',
      {
        name: 'console',
        message:
          'Direct console usage is forbidden. Import and use logger from @/utils/logger instead.\n\nExample:\nimport { logger } from "@/utils/logger";\nlogger.info("message", data);',
      },
    ],
  },
};

