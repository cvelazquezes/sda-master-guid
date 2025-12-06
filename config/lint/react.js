/**
 * React ESLint Rules
 * Best practices for React and React Native development
 */
module.exports = {
  rules: {
    // === REACT CORE ===
    'react/prop-types': 'off', // Using TypeScript for prop types
    'react/react-in-jsx-scope': 'off', // React 17+ JSX transform
    'react/display-name': 'error',
    'react/no-array-index-key': 'error',
    'react/no-danger': 'error',
    'react/no-deprecated': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-find-dom-node': 'error',
    'react/no-is-mounted': 'error',
    'react/no-string-refs': 'error',
    'react/no-unescaped-entities': 'error',
    'react/no-unknown-property': 'error',
    'react/self-closing-comp': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',

    // === REACT HOOKS ===
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',

    // === JSX BEST PRACTICES ===
    'react/jsx-boolean-value': ['error', 'never'],
    'react/jsx-curly-brace-presence': [
      'error',
      { props: 'never', children: 'never' },
    ],
    'react/jsx-fragments': ['error', 'syntax'],
    'react/jsx-no-useless-fragment': 'error',
    'react/jsx-pascal-case': 'error',
  },
};

