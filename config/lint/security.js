/**
 * Security ESLint Rules
 *
 * Security-focused linting rules to prevent common vulnerabilities.
 * These rules are standard at Google, Microsoft, and Meta.
 *
 * Categories:
 * 1. Injection Prevention (XSS, SQL, Command)
 * 2. Cryptographic Issues
 * 3. Information Disclosure
 * 4. Insecure Configuration
 * 5. Input Validation
 *
 * @version 1.0.0 - Enterprise security standards
 */
module.exports = {
  rules: {
    // =========================================================================
    // INJECTION PREVENTION
    // =========================================================================

    /**
     * Prevent eval() and similar dynamic code execution
     * Critical XSS/RCE vector
     */
    'no-eval': 'error',

    /**
     * Prevent implied eval via setTimeout/setInterval strings
     * BAD: setTimeout("doSomething()", 1000)
     * GOOD: setTimeout(doSomething, 1000)
     */
    'no-implied-eval': 'error',

    /**
     * Prevent new Function() - same as eval
     */
    'no-new-func': 'error',

    /**
     * Prevent javascript: URLs (XSS vector)
     */
    'no-script-url': 'error',

    // =========================================================================
    // SECURITY-SENSITIVE PATTERNS via AST
    // =========================================================================

    'no-restricted-syntax': [
      'error',

      // -----------------------------------------------------------------------
      // innerHTML assignment - XSS risk
      // -----------------------------------------------------------------------
      {
        selector: "AssignmentExpression[left.property.name='innerHTML']",
        message:
          '🔴 SECURITY: innerHTML assignment is a XSS risk.\n' +
          '✅ FIX: Use textContent for text, or sanitize with DOMPurify',
      },

      // -----------------------------------------------------------------------
      // outerHTML assignment - XSS risk
      // -----------------------------------------------------------------------
      {
        selector: "AssignmentExpression[left.property.name='outerHTML']",
        message:
          '🔴 SECURITY: outerHTML assignment is a XSS risk.\n' +
          '✅ FIX: Use DOM manipulation methods instead',
      },

      // -----------------------------------------------------------------------
      // document.write - XSS risk
      // -----------------------------------------------------------------------
      {
        selector:
          "CallExpression[callee.object.name='document'][callee.property.name=/^write(ln)?$/]",
        message:
          '🔴 SECURITY: document.write is a XSS risk and blocks parsing.\n' +
          '✅ FIX: Use DOM manipulation methods instead',
      },

      // -----------------------------------------------------------------------
      // insertAdjacentHTML - XSS risk
      // -----------------------------------------------------------------------
      {
        selector: "CallExpression[callee.property.name='insertAdjacentHTML']",
        message:
          '🔴 SECURITY: insertAdjacentHTML is a XSS risk.\n' +
          '✅ FIX: Use insertAdjacentElement with created elements instead',
      },

      // -----------------------------------------------------------------------
      // Dynamic import with variable - potential RCE
      // -----------------------------------------------------------------------
      {
        selector: 'ImportExpression[source.type="Identifier"]',
        message:
          '⚠️ SECURITY: Dynamic import with variable path is risky.\n' +
          '✅ FIX: Use static import paths when possible',
      },

      // -----------------------------------------------------------------------
      // postMessage without origin check - XSS risk
      // -----------------------------------------------------------------------
      {
        selector: "CallExpression[callee.property.name='postMessage'][arguments.length=1]",
        message:
          '⚠️ SECURITY: postMessage without targetOrigin is risky.\n' +
          '✅ FIX: Always specify targetOrigin as second argument',
      },

      // -----------------------------------------------------------------------
      // location assignment from variable - Open Redirect
      // -----------------------------------------------------------------------
      {
        selector:
          "AssignmentExpression[left.object.name='location'][left.property.name='href'][right.type='Identifier']",
        message:
          '⚠️ SECURITY: Dynamic location.href assignment may cause open redirect.\n' +
          '✅ FIX: Validate URL against allowlist before navigation',
      },

      // -----------------------------------------------------------------------
      // window.open with variable - Open Redirect
      // -----------------------------------------------------------------------
      {
        selector:
          "CallExpression[callee.object.name='window'][callee.property.name='open'][arguments.0.type='Identifier']",
        message:
          '⚠️ SECURITY: Dynamic window.open may cause open redirect.\n' +
          '✅ FIX: Validate URL against allowlist before opening',
      },

      // -----------------------------------------------------------------------
      // localStorage/sessionStorage sensitive data patterns
      // -----------------------------------------------------------------------
      {
        selector:
          "CallExpression[callee.object.name='localStorage'][callee.property.name='setItem'][arguments.0.value=/token|password|secret|key|credential/i]",
        message:
          '⚠️ SECURITY: Storing sensitive data in localStorage.\n' +
          '✅ FIX: Use SecureStore for sensitive data in React Native',
      },

      // -----------------------------------------------------------------------
      // sessionStorage sensitive data
      // -----------------------------------------------------------------------
      {
        selector:
          "CallExpression[callee.object.name='sessionStorage'][callee.property.name='setItem'][arguments.0.value=/token|password|secret|key|credential/i]",
        message:
          '⚠️ SECURITY: Storing sensitive data in sessionStorage.\n' +
          '✅ FIX: Use SecureStore for sensitive data in React Native',
      },

      // -----------------------------------------------------------------------
      // Crypto Math.random() usage - weak randomness
      // -----------------------------------------------------------------------
      {
        selector:
          "CallExpression[callee.object.name='Math'][callee.property.name='random']:has(Identifier[name=/id|token|key|secret|nonce|salt/i])",
        message:
          '🔴 SECURITY: Math.random() is not cryptographically secure.\n' +
          '✅ FIX: Use crypto.getRandomValues() or expo-crypto',
      },

      // -----------------------------------------------------------------------
      // Hardcoded localhost/127.0.0.1 in production code
      // -----------------------------------------------------------------------
      {
        selector: 'Literal[value=/localhost|127\\.0\\.0\\.1|0\\.0\\.0\\.0/]',
        message:
          '⚠️ SECURITY: Hardcoded localhost address detected.\n' +
          '✅ FIX: Use environment configuration for URLs',
      },

      // -----------------------------------------------------------------------
      // HTTP URLs (should be HTTPS)
      // -----------------------------------------------------------------------
      {
        selector: 'Literal[value=/^http:\\/\\/(?!localhost|127\\.0\\.0\\.1)/]',
        message:
          '⚠️ SECURITY: HTTP URL detected, consider using HTTPS.\n' +
          '✅ FIX: Use HTTPS for all external URLs',
      },

      // -----------------------------------------------------------------------
      // Disabled SSL verification patterns
      // -----------------------------------------------------------------------
      {
        selector: "Property[key.name='rejectUnauthorized'][value.value=false]",
        message:
          '🔴 SECURITY: SSL certificate verification disabled!\n' +
          '✅ FIX: Enable certificate verification in production',
      },

      // -----------------------------------------------------------------------
      // SQL-like string concatenation patterns
      // -----------------------------------------------------------------------
      {
        selector:
          'BinaryExpression[operator="+"][left.value=/SELECT|INSERT|UPDATE|DELETE|DROP|CREATE/i]',
        message:
          '🔴 SECURITY: Potential SQL injection via string concatenation.\n' +
          '✅ FIX: Use parameterized queries',
      },

      // -----------------------------------------------------------------------
      // Template literal SQL patterns
      // -----------------------------------------------------------------------
      {
        selector:
          'TemplateLiteral[quasis.0.value.raw=/SELECT|INSERT|UPDATE|DELETE|DROP|CREATE/i]',
        message:
          '🔴 SECURITY: Potential SQL injection via template literal.\n' +
          '✅ FIX: Use parameterized queries',
      },
    ],

    // =========================================================================
    // RESTRICTED IMPORTS
    // =========================================================================

    'no-restricted-imports': [
      'error',
      {
        paths: [
          // -----------------------------------------------------------------------
          // Unsafe crypto packages
          // -----------------------------------------------------------------------
          {
            name: 'crypto-js',
            message:
              '⚠️ SECURITY: crypto-js has known vulnerabilities.\n' +
              '✅ FIX: Use expo-crypto or react-native-crypto instead',
          },
          {
            name: 'md5',
            message:
              '🔴 SECURITY: MD5 is cryptographically broken.\n' +
              '✅ FIX: Use SHA-256 or stronger via expo-crypto',
          },
          {
            name: 'sha1',
            message:
              '🔴 SECURITY: SHA-1 is cryptographically weak.\n' +
              '✅ FIX: Use SHA-256 or stronger via expo-crypto',
          },

          // -----------------------------------------------------------------------
          // Packages with security issues
          // -----------------------------------------------------------------------
          {
            name: 'request',
            message:
              '⚠️ DEPRECATED: request package is deprecated.\n' +
              '✅ FIX: Use axios or fetch instead',
          },
        ],
      },
    ],

    // =========================================================================
    // PROTOTYPE POLLUTION PREVENTION
    // =========================================================================

    /**
     * Prevent __proto__ usage
     */
    'no-proto': 'error',

    /**
     * Prevent extending native prototypes
     */
    'no-extend-native': 'error',

    /**
     * Prevent __iterator__ usage
     */
    'no-iterator': 'error',

    // =========================================================================
    // RESTRICTED PROPERTIES
    // =========================================================================

    'no-restricted-properties': [
      'error',

      // -----------------------------------------------------------------------
      // Dangerous Object methods
      // -----------------------------------------------------------------------
      {
        object: 'Object',
        property: '__defineGetter__',
        message: 'Use Object.defineProperty instead.',
      },
      {
        object: 'Object',
        property: '__defineSetter__',
        message: 'Use Object.defineProperty instead.',
      },
      {
        object: 'Object',
        property: '__lookupGetter__',
        message: 'Use Object.getOwnPropertyDescriptor instead.',
      },
      {
        object: 'Object',
        property: '__lookupSetter__',
        message: 'Use Object.getOwnPropertyDescriptor instead.',
      },
    ],
  },
};

