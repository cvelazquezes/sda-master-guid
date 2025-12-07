/**
 * Component Constants - Component-specific configuration values
 *
 * ============================================================================
 * THIS IS THE SINGLE SOURCE OF TRUTH FOR COMPONENT CONFIGURATION
 * ============================================================================
 *
 * Contains component names, sizes, variants, and behavior settings.
 *
 * @version 1.0.0
 */
/* eslint-disable no-magic-numbers */

// =============================================================================
// COMPONENT DISPLAY NAMES
// =============================================================================

/**
 * Component Names - Used for React DevTools and error stack traces
 */
export const COMPONENT_NAMES = {
  // Card Components
  CLUB_CARD: 'ClubCard',
  MATCH_CARD: 'MatchCard',
  USER_CARD: 'UserCard',
  STAT_CARD: 'StatCard',
  // Modal Components
  CLASS_SELECTION_MODAL: 'ClassSelectionModal',
  CLUB_DETAIL_MODAL: 'ClubDetailModal',
  USER_DETAIL_MODAL: 'UserDetailModal',
} as const;

// =============================================================================
// COMPONENT SIZES
// =============================================================================

/**
 * Component Size - Generic size prop values
 */
export const COMPONENT_SIZE = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const;

/**
 * Button Size - Specific button sizes
 */
export const BUTTON_SIZE = {
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const;

/**
 * Activity Indicator Size
 */
export const ACTIVITY_INDICATOR_SIZE = {
  small: 'small',
  large: 'large',
} as const;

/**
 * Heading Levels - Semantic HTML heading levels
 */
export const HEADING_LEVEL = {
  H1: 1,
  H2: 2,
  H3: 3,
  H4: 4,
} as const;

// =============================================================================
// COMPONENT VARIANTS
// =============================================================================

/**
 * Component Variant - Style variants for components
 */
export const COMPONENT_VARIANT = {
  default: 'default',
  primary: 'primary',
  secondary: 'secondary',
  accent: 'accent',
  ghost: 'ghost',
  danger: 'danger',
  outline: 'outline',
  outlined: 'outlined',
  elevated: 'elevated',
  flat: 'flat',
  neutral: 'neutral',
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
} as const;

// =============================================================================
// COMPONENT BEHAVIOR
// =============================================================================

/**
 * Touch Opacity - activeOpacity values for TouchableOpacity
 */
export const TOUCH_OPACITY = {
  default: 0.7,
  light: 0.8,
  heavy: 0.5,
  minimal: 0.9,
} as const;

/**
 * Text Variant - Typography variants for Text component
 */
export const TEXT_VARIANT = {
  // Display variants
  DISPLAY_LARGE: 'displayLarge',
  DISPLAY_MEDIUM: 'displayMedium',
  DISPLAY_SMALL: 'displaySmall',
  // Heading variants
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  HEADING: 'heading',
  // Body variants
  BODY_LARGE: 'bodyLarge',
  BODY: 'body',
  BODY_SMALL: 'bodySmall',
  // Label variants
  LABEL_LARGE: 'labelLarge',
  LABEL: 'label',
  LABEL_SMALL: 'labelSmall',
  // Caption variants
  CAPTION: 'caption',
  CAPTION_BOLD: 'captionBold',
  // UI variants
  BUTTON: 'button',
  BUTTON_SMALL: 'buttonSmall',
  BADGE: 'badge',
  HELPER: 'helper',
} as const;

/**
 * Text Color - Semantic color tokens for Text component
 */
export const TEXT_COLOR = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
  QUATERNARY: 'quaternary',
  DISABLED: 'disabled',
  PLACEHOLDER: 'placeholder',
  INVERSE: 'inverse',
  ON_PRIMARY: 'onPrimary',
  ON_SECONDARY: 'onSecondary',
  ON_ACCENT: 'onAccent',
  LINK: 'link',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info',
  INHERIT: 'inherit',
} as const;

/**
 * Text Weight - Font weight values for Text component
 */
export const TEXT_WEIGHT = {
  LIGHT: 'light',
  REGULAR: 'regular',
  MEDIUM: 'medium',
  SEMIBOLD: 'semibold',
  BOLD: 'bold',
  EXTRABOLD: 'extrabold',
} as const;

/**
 * Text Align - Text alignment values
 */
export const TEXT_ALIGN = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  AUTO: 'auto',
} as const;

/**
 * Text Line Limits - numberOfLines prop values
 */
export const TEXT_LINES = {
  single: 1,
  double: 2,
  triple: 3,
  quad: 4,
} as const;

/**
 * Text Input Configuration
 */
export const TEXT_INPUT = {
  NUMBER_OF_LINES: {
    SINGLE: 1,
    DOUBLE: 2,
    MULTI: 4,
  },
} as const;

/**
 * Icon Position - Used for icon placement in buttons
 */
export const ICON_POSITION = {
  LEFT: 'left',
  RIGHT: 'right',
} as const;

/**
 * Orientation - Used for dividers and layouts
 */
export const ORIENTATION = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
} as const;

/**
 * List Configuration
 */
export const LIST_CONFIG = {
  ON_END_REACHED_THRESHOLD: 0.5,
  ITEM_VISIBLE_PERCENT: 50,
  MINIMUM_VIEW_TIME: 300,
} as const;

// =============================================================================
// BADGE CONFIGURATION
// =============================================================================

/**
 * Badge Display - For notification badges
 */
export const BADGE = {
  MAX_COUNT: 9,
  OVERFLOW_TEXT: '9+',
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ComponentName = (typeof COMPONENT_NAMES)[keyof typeof COMPONENT_NAMES];
export type ComponentSize = (typeof COMPONENT_SIZE)[keyof typeof COMPONENT_SIZE];
export type ButtonSize = (typeof BUTTON_SIZE)[keyof typeof BUTTON_SIZE];
export type ActivityIndicatorSize =
  (typeof ACTIVITY_INDICATOR_SIZE)[keyof typeof ACTIVITY_INDICATOR_SIZE];
export type ComponentVariant = (typeof COMPONENT_VARIANT)[keyof typeof COMPONENT_VARIANT];
export type TouchOpacity = (typeof TOUCH_OPACITY)[keyof typeof TOUCH_OPACITY];
export type TextLines = (typeof TEXT_LINES)[keyof typeof TEXT_LINES];
export type IconPosition = (typeof ICON_POSITION)[keyof typeof ICON_POSITION];
export type Orientation = (typeof ORIENTATION)[keyof typeof ORIENTATION];
export type TextVariantValue = (typeof TEXT_VARIANT)[keyof typeof TEXT_VARIANT];
export type TextColorValue = (typeof TEXT_COLOR)[keyof typeof TEXT_COLOR];
export type TextWeightValue = (typeof TEXT_WEIGHT)[keyof typeof TEXT_WEIGHT];
export type TextAlignValue = (typeof TEXT_ALIGN)[keyof typeof TEXT_ALIGN];
