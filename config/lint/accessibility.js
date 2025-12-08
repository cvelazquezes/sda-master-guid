/**
 * Accessibility ESLint Rules
 *
 * Accessibility-focused linting rules for React Native applications.
 * These rules help ensure the app is usable by people with disabilities.
 *
 * Based on:
 * - WCAG 2.1 Guidelines
 * - React Native Accessibility Best Practices
 * - Google/Microsoft Accessibility Standards
 *
 * Categories:
 * 1. Screen Reader Support
 * 2. Touch Target Sizes
 * 3. Color Contrast (via design tokens)
 * 4. Keyboard Navigation (where applicable)
 * 5. Semantic Structure
 *
 * @version 1.0.0 - React Native accessibility standards
 */
module.exports = {
  rules: {
    // =========================================================================
    // ACCESSIBILITY VIA AST PATTERNS
    // =========================================================================

    'no-restricted-syntax': [
      'error',

      // =========================================================================
      // SCREEN READER SUPPORT
      // =========================================================================

      // -----------------------------------------------------------------------
      // Image without accessibilityLabel
      // Screen readers need alt text for images
      // -----------------------------------------------------------------------
      {
        selector:
          "JSXElement[openingElement.name.name='Image']:not(:has(JSXAttribute[name.name='accessibilityLabel'])):not(:has(JSXAttribute[name.name='accessible'][value.expression.value=false]))",
        message:
          '♿ A11Y: Image should have accessibilityLabel for screen readers.\n' +
          '✅ FIX: <Image accessibilityLabel="Description of image" ... />',
      },

      // -----------------------------------------------------------------------
      // Touchable without accessibilityRole
      // Screen readers need to know the element type
      // -----------------------------------------------------------------------
      {
        selector:
          "JSXElement[openingElement.name.name=/^(TouchableOpacity|TouchableHighlight|TouchableWithoutFeedback|Pressable)$/]:not(:has(JSXAttribute[name.name='accessibilityRole']))",
        message:
          '♿ A11Y: Touchable elements should have accessibilityRole.\n' +
          '✅ FIX: <TouchableOpacity accessibilityRole="button" ... />',
      },

      // -----------------------------------------------------------------------
      // Button without accessibilityLabel
      // Custom buttons need labels for screen readers
      // -----------------------------------------------------------------------
      {
        selector:
          "JSXElement[openingElement.name.name=/^(TouchableOpacity|TouchableHighlight|Pressable)$/]:not(:has(JSXAttribute[name.name='accessibilityLabel'])):has(JSXElement[openingElement.name.name='Icon'])",
        message:
          '♿ A11Y: Icon-only buttons MUST have accessibilityLabel.\n' +
          '✅ FIX: <TouchableOpacity accessibilityLabel="Close dialog" ... />',
      },

      // -----------------------------------------------------------------------
      // TextInput without accessibilityLabel
      // Form fields need labels for screen readers
      // -----------------------------------------------------------------------
      {
        selector:
          "JSXElement[openingElement.name.name=/Input$/]:not(:has(JSXAttribute[name.name='accessibilityLabel'])):not(:has(JSXAttribute[name.name='placeholder']))",
        message:
          '♿ A11Y: Input fields should have accessibilityLabel or placeholder.\n' +
          '✅ FIX: <TextInput accessibilityLabel="Email address" ... />',
      },

      // -----------------------------------------------------------------------
      // Switch without accessibilityLabel
      // Toggle controls need context
      // -----------------------------------------------------------------------
      {
        selector:
          "JSXElement[openingElement.name.name='Switch']:not(:has(JSXAttribute[name.name='accessibilityLabel']))",
        message:
          '♿ A11Y: Switch should have accessibilityLabel.\n' +
          '✅ FIX: <Switch accessibilityLabel="Enable notifications" ... />',
      },

      // -----------------------------------------------------------------------
      // ActivityIndicator without accessibilityLabel
      // Loading states should be announced
      // -----------------------------------------------------------------------
      {
        selector:
          "JSXElement[openingElement.name.name='ActivityIndicator']:not(:has(JSXAttribute[name.name='accessibilityLabel']))",
        message:
          '♿ A11Y: ActivityIndicator should have accessibilityLabel.\n' +
          '✅ FIX: <ActivityIndicator accessibilityLabel="Loading" ... />',
      },

      // =========================================================================
      // ACCESSIBILITY STATE MANAGEMENT
      // =========================================================================

      // -----------------------------------------------------------------------
      // accessibilityState with incorrect value type
      // Must be an object with boolean values
      // -----------------------------------------------------------------------
      {
        selector:
          "JSXAttribute[name.name='accessibilityState'] > JSXExpressionContainer > Literal",
        message:
          '♿ A11Y: accessibilityState must be an object.\n' +
          '✅ FIX: accessibilityState={{ disabled: true, selected: false }}',
      },

      // -----------------------------------------------------------------------
      // Disabled button without accessibilityState.disabled
      // Screen readers need to know disabled state
      // -----------------------------------------------------------------------
      {
        selector:
          "JSXElement[openingElement.name.name=/^(TouchableOpacity|Pressable|Button)$/]:has(JSXAttribute[name.name='disabled']):not(:has(JSXAttribute[name.name='accessibilityState']))",
        message:
          '♿ A11Y: Disabled buttons should have accessibilityState={{ disabled: true }}.\n' +
          '✅ FIX: Add accessibilityState={{ disabled: true }} for screen readers',
      },

      // =========================================================================
      // NAVIGATION & FOCUS
      // =========================================================================

      // -----------------------------------------------------------------------
      // Modal without accessibilityViewIsModal
      // Modals should trap screen reader focus
      // -----------------------------------------------------------------------
      {
        selector:
          "JSXElement[openingElement.name.name='Modal']:not(:has(JSXAttribute[name.name='accessibilityViewIsModal']))",
        message:
          '♿ A11Y: Modal should have accessibilityViewIsModal={true}.\n' +
          '✅ FIX: Helps screen readers focus within the modal',
      },

      // -----------------------------------------------------------------------
      // FlatList without accessibility considerations
      // Lists should have proper item accessibility
      // -----------------------------------------------------------------------
      {
        selector:
          "JSXElement[openingElement.name.name=/^(FlatList|SectionList|FlashList)$/]:not(:has(JSXAttribute[name.name='accessibilityRole']))",
        message:
          '⚠️ A11Y: Consider adding accessibilityRole="list" to list components.\n' +
          '✅ TIP: Ensure list items also have proper accessibility props',
      },

      // =========================================================================
      // TOUCH TARGETS
      // =========================================================================

      // -----------------------------------------------------------------------
      // Explicit small touch targets (< 44pt recommended by Apple)
      // -----------------------------------------------------------------------
      {
        selector:
          "JSXElement[openingElement.name.name=/^(TouchableOpacity|Pressable)$/] JSXAttribute[name.name=/^(width|height)$/] > JSXExpressionContainer > Literal[value<44]",
        message:
          '♿ A11Y: Touch target may be too small (< 44pt).\n' +
          '✅ FIX: Minimum 44x44pt for touch targets (Apple HIG)',
      },

      // -----------------------------------------------------------------------
      // hitSlop might indicate too-small touch target
      // -----------------------------------------------------------------------
      {
        selector:
          "JSXAttribute[name.name='hitSlop'] > JSXExpressionContainer > ObjectExpression:has(Property[value.value>20])",
        message:
          '⚠️ A11Y: Large hitSlop suggests the touch target is too small.\n' +
          '✅ TIP: Consider increasing the actual element size instead',
      },

      // =========================================================================
      // SEMANTIC STRUCTURE
      // =========================================================================

      // -----------------------------------------------------------------------
      // Heading text without accessibilityRole="header"
      // Helps screen reader users navigate by headings
      // -----------------------------------------------------------------------
      {
        selector:
          "JSXElement[openingElement.name.name='Text']:has(JSXAttribute[name.name='variant'][value.expression.value=/^h[1-4]$/]):not(:has(JSXAttribute[name.name='accessibilityRole']))",
        message:
          '♿ A11Y: Heading text should have accessibilityRole="header".\n' +
          '✅ FIX: Helps screen reader users navigate document structure',
      },

      // -----------------------------------------------------------------------
      // Link without accessibilityRole="link"
      // -----------------------------------------------------------------------
      {
        selector:
          "JSXElement[openingElement.name.name=/^(TouchableOpacity|Pressable)$/]:has(JSXAttribute[name.name='onPress']):has(JSXAttribute[name.name=/href|url/i]):not(:has(JSXAttribute[name.name='accessibilityRole'][value.expression.value='link']))",
        message:
          '♿ A11Y: Links should have accessibilityRole="link".\n' +
          '✅ FIX: Distinguishes links from buttons for screen readers',
      },

      // =========================================================================
      // LIVE REGIONS
      // =========================================================================

      // -----------------------------------------------------------------------
      // Error message without accessibilityLiveRegion
      // Dynamic error messages should be announced
      // -----------------------------------------------------------------------
      {
        selector:
          "JSXElement[openingElement.name.name='Text']:has(JSXAttribute[name.name='color'][value.expression.value='error']):not(:has(JSXAttribute[name.name='accessibilityLiveRegion']))",
        message:
          '♿ A11Y: Error messages should use accessibilityLiveRegion="polite".\n' +
          '✅ FIX: Announces error to screen reader users',
      },

      // -----------------------------------------------------------------------
      // Success message without accessibilityLiveRegion
      // -----------------------------------------------------------------------
      {
        selector:
          "JSXElement[openingElement.name.name='Text']:has(JSXAttribute[name.name='color'][value.expression.value='success']):not(:has(JSXAttribute[name.name='accessibilityLiveRegion']))",
        message:
          '♿ A11Y: Success messages should use accessibilityLiveRegion="polite".\n' +
          '✅ FIX: Announces success to screen reader users',
      },

      // =========================================================================
      // FORM ACCESSIBILITY
      // =========================================================================

      // -----------------------------------------------------------------------
      // Required field without indication
      // -----------------------------------------------------------------------
      {
        selector:
          "JSXElement[openingElement.name.name=/Input$/]:has(JSXAttribute[name.name='required']):not(:has(JSXAttribute[name.name='accessibilityHint']))",
        message:
          '♿ A11Y: Required fields should have accessibilityHint indicating required.\n' +
          '✅ FIX: accessibilityHint="Required field"',
      },

      // =========================================================================
      // ANIMATION CONSIDERATIONS
      // =========================================================================

      // -----------------------------------------------------------------------
      // Animated components should respect reduced motion
      // -----------------------------------------------------------------------
      {
        selector:
          "JSXElement[openingElement.name.name='Animated.View']:has(JSXAttribute[name.name=/duration/i][value.expression.value>300])",
        message:
          '♿ A11Y: Long animations (>300ms) should respect reduced motion preferences.\n' +
          '✅ TIP: Use AccessibilityInfo.isReduceMotionEnabled() to check',
      },
    ],

    // =========================================================================
    // RESTRICTED PROPERTIES FOR ACCESSIBILITY
    // =========================================================================

    'no-restricted-properties': [
      'error',

      // -----------------------------------------------------------------------
      // Deprecated accessible prop usage patterns
      // -----------------------------------------------------------------------
      {
        property: 'accessible',
        message:
          '⚠️ A11Y: accessible prop should be used intentionally.\n' +
          '✅ TIP: accessible={false} hides element from screen readers - use carefully',
      },
    ],
  },
};

