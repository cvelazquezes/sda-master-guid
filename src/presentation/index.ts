/**
 * Presentation Layer
 *
 * Contains all UI-related code: screens, components, navigation, state, and theming.
 *
 * Note: useTheme and ThemeMode are exported from both state and theme.
 * We export from state as the canonical source and exclude from theme re-export.
 */

// State (Context providers) - canonical source for useTheme, ThemeMode
export * from './state';

// UI Components
export * from './components/primitives';
export * from './components/features';

// Theme and design system (excluding useTheme and ThemeMode which come from state)
export {
  lightTheme,
  darkTheme,
  theme,
  getTheme,
  colors,
  colorUtils,
  typography,
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  spacing,
  semanticSpacing,
  containerSpacing,
  componentSpacing,
  borderRadius,
  borderWidth,
  shadows,
  zIndex,
  opacity,
  sizes,
  iconSizes,
  mobileTypography,
  mobileFontSizes,
  mobileIconSizes,
  touchTargets,
  textStyles,
  getResponsiveFontSize,
  calculateLineHeight,
  isMobileFriendly,
  sdaColors,
  sdaBrandColors,
  sdaSemanticColors,
  roleColors,
  statusColors,
  hierarchyColors,
  sdaColorUtils,
  designTokens,
  layoutConstants,
  SIZE_PRESETS,
  BADGE_SIZE_PRESETS,
  STATUS_SIZE_PRESETS,
  BUTTON_SIZE_PRESETS,
  getSizePreset,
  getBadgeSizePreset,
  getStatusSizePreset,
  getButtonSizePreset,
  getSpacing,
  getIconSize,
  getFontSize,
  type Theme,
  type ColorName,
  type ColorShade,
} from './theme';

// Navigation
// Note: Navigation is imported directly due to its unique structure

// Hooks
export * from './hooks';

// Internationalization
// Note: i18n is initialized as a side effect, import directly when needed
