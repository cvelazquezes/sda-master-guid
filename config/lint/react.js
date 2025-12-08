/**
 * React ESLint Rules
 * Best practices for React and React Native development
 *
 * @version 2.0.0 - Enterprise standards (Meta/Airbnb/Google)
 *
 * Includes:
 * - Core React rules
 * - Hooks rules (created by Meta)
 * - Performance optimization rules
 * - Accessibility considerations
 * - JSX best practices
 */
module.exports = {
  rules: {
    // =========================================================================
    // REACT CORE - Essential Rules
    // =========================================================================

    /**
     * Disable prop-types - Using TypeScript for prop types
     */
    'react/prop-types': 'off',

    /**
     * React 17+ JSX transform doesn't require React in scope
     */
    'react/react-in-jsx-scope': 'off',

    /**
     * Require display name for debugging
     * Helps with React DevTools
     */
    'react/display-name': 'error',

    /**
     * CRITICAL: Prevent array index as key
     * Causes issues with reconciliation and state
     * Standard: Meta/Airbnb REQUIRE this
     */
    'react/no-array-index-key': 'error',

    /**
     * Prevent dangerouslySetInnerHTML (XSS risk)
     */
    'react/no-danger': 'error',

    /**
     * Catch deprecated React APIs
     */
    'react/no-deprecated': 'error',

    /**
     * Prevent direct state mutation
     * Use setState() instead
     */
    'react/no-direct-mutation-state': 'error',

    /**
     * Deprecated: Use refs instead
     */
    'react/no-find-dom-node': 'error',

    /**
     * Deprecated: isMounted is an anti-pattern
     */
    'react/no-is-mounted': 'error',

    /**
     * Use callback refs instead of string refs
     */
    'react/no-string-refs': 'error',

    /**
     * Escape entities in JSX
     */
    'react/no-unescaped-entities': 'error',

    /**
     * Catch typos in DOM properties
     */
    'react/no-unknown-property': ['error', { ignore: ['css'] }],

    /**
     * Use self-closing tags when no children
     * <Component /> instead of <Component></Component>
     */
    'react/self-closing-comp': 'error',

    /**
     * Prevent duplicate props
     */
    'react/jsx-no-duplicate-props': 'error',

    /**
     * Catch undefined variables in JSX
     */
    'react/jsx-no-undef': 'error',

    /**
     * Mark React variables as used (for older ESLint)
     */
    'react/jsx-uses-react': 'error',

    /**
     * Mark JSX variables as used
     */
    'react/jsx-uses-vars': 'error',

    // =========================================================================
    // REACT HOOKS - Meta Standard
    // These rules were created by Meta and are essential
    // =========================================================================

    /**
     * CRITICAL: Enforce Rules of Hooks
     * - Only call hooks at the top level
     * - Only call hooks from React functions
     */
    'react-hooks/rules-of-hooks': 'error',

    /**
     * CRITICAL: Verify dependency arrays
     * Prevents stale closure bugs
     */
    'react-hooks/exhaustive-deps': 'error',

    // =========================================================================
    // PERFORMANCE RULES - Meta/Airbnb Standard
    // =========================================================================

    /**
     * CRITICAL: Prevent context value recreation on every render
     * BAD: <Context.Provider value={{ user }}>
     * GOOD: useMemo for context value
     */
    'react/jsx-no-constructed-context-values': 'error',

    /**
     * CRITICAL: Prevent unstable components inside render
     * Causes component remounting on every render
     */
    'react/no-unstable-nested-components': ['error', { allowAsProps: true }],

    /**
     * Prevent object/array default props (reference equality issues)
     */
    'react/no-object-type-as-default-prop': 'error',

    // =========================================================================
    // ACCESSIBILITY RULES - Google/Microsoft Standard
    // =========================================================================

    /**
     * Explicit button type prevents accidental form submission
     */
    'react/button-has-type': 'error',

    /**
     * Security: Require sandbox attribute on iframes
     */
    'react/iframe-missing-sandbox': 'error',

    // =========================================================================
    // CODE QUALITY - Airbnb Standard
    // =========================================================================

    /**
     * Don't access state in setState callback
     * Use the callback form of setState instead
     */
    'react/no-access-state-in-setstate': 'error',

    /**
     * Prevent redundant shouldComponentUpdate with PureComponent
     */
    'react/no-redundant-should-component-update': 'error',

    /**
     * No 'this' in stateless functional components
     */
    'react/no-this-in-sfc': 'error',

    /**
     * Catch typos in lifecycle methods
     */
    'react/no-typos': 'error',

    /**
     * Detect unused state variables
     */
    'react/no-unused-state': 'error',

    /**
     * Prefer functional components
     * Hooks make class components unnecessary
     */
    'react/prefer-stateless-function': 'warn',

    /**
     * Void DOM elements (img, br, input) should not have children
     */
    'react/void-dom-elements-no-children': 'error',

    // =========================================================================
    // JSX BEST PRACTICES - All Big Tech
    // =========================================================================

    /**
     * Omit boolean value when true
     * <Component disabled /> instead of <Component disabled={true} />
     */
    'react/jsx-boolean-value': ['error', 'never'],

    /**
     * Remove unnecessary curly braces
     * <Component name="value" /> instead of <Component name={'value'} />
     */
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],

    /**
     * Use fragment shorthand
     * <></> instead of <React.Fragment></React.Fragment>
     */
    'react/jsx-fragments': ['error', 'syntax'],

    /**
     * Remove useless fragments
     * {value} instead of <>{value}</>
     */
    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],

    /**
     * Components must be PascalCase
     */
    'react/jsx-pascal-case': ['error', { allowAllCaps: true }],

    /**
     * CRITICAL: Require key prop in iterators
     * With additional checks for fragments and spread
     */
    'react/jsx-key': [
      'error',
      {
        checkFragmentShorthand: true,
        checkKeyMustBeforeSpread: true,
        warnOnDuplicates: true,
      },
    ],

    /**
     * Prevent comments as text nodes
     * Comments in JSX need curly braces
     */
    'react/jsx-no-comment-textnodes': 'error',

    /**
     * Security: Prevent target="_blank" without rel="noopener"
     */
    'react/jsx-no-target-blank': [
      'error',
      {
        enforceDynamicLinks: 'always',
        warnOnSpreadAttributes: true,
      },
    ],

    /**
     * Prevent usage of javascript: URLs
     */
    'react/jsx-no-script-url': 'error',

    /**
     * Disallow unnecessary JSX expressions
     */
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],

    // =========================================================================
    // HOOKS ADDITIONAL RULES
    // =========================================================================

    /**
     * Enforce useState naming convention
     * const [value, setValue] = useState()
     */
    'react/hook-use-state': 'error',

    // =========================================================================
    // COMPONENT STRUCTURE (Optional but recommended)
    // =========================================================================

    /**
     * Sort props for consistency (warning only)
     * Callbacks last, shorthand first
     */
    'react/jsx-sort-props': [
      'warn',
      {
        callbacksLast: true,
        shorthandFirst: true,
        shorthandLast: false,
        ignoreCase: true,
        noSortAlphabetically: true,
        reservedFirst: ['key', 'ref'],
      },
    ],

    /**
     * Prevent missing props validation
     * (Disabled because we use TypeScript)
     */
    'react/require-default-props': 'off',

    /**
     * Enforce defaultProps declarations alphabetical sorting
     */
    'react/sort-default-props': 'off',

    /**
     * Prevent missing React when using JSX
     * (Disabled for React 17+)
     */
    'react/jsx-uses-react': 'off',

    // =========================================================================
    // STYLE AND FORMATTING
    // =========================================================================

    /**
     * Enforce consistent JSX closing bracket location
     */
    'react/jsx-closing-bracket-location': ['error', 'line-aligned'],

    /**
     * Enforce consistent JSX closing tag location
     */
    'react/jsx-closing-tag-location': 'error',

    /**
     * Enforce maximum JSX depth
     * Encourages component extraction
     */
    'react/jsx-max-depth': ['warn', { max: 6 }],

    /**
     * Prevent extra closing tags for components without children
     */
    'react/self-closing-comp': ['error', { component: true, html: true }],
  },
};
