/**
 * Design Tokens - SINGLE SOURCE OF TRUTH
 *
 * One file. One export. No confusion.
 *
 * Usage:
 *   import { designTokens } from '../shared/theme';
 *
 *   designTokens.spacing.md
 *   designTokens.iconSize.lg
 *   designTokens.colors.white
 *
 * NOTE: This file intentionally contains literal numbers as it DEFINES design tokens.
 */

import { TextStyle } from 'react-native';
import { primitiveTokens } from './tokens/primitives';
import { sdaSemanticColors, roleColors, statusColors, hierarchyColors } from './sdaColors';

// =============================================================================
// CORE SCALES
// =============================================================================

export const spacing = {
  none: primitiveTokens.spacing.none,
  xxs: primitiveTokens.spacing.xxs,
  xs: primitiveTokens.spacing.xs,
  sm: primitiveTokens.spacing.sm,
  md: primitiveTokens.spacing.md,
  lg: primitiveTokens.spacing.lg,
  xl: primitiveTokens.spacing.xl,
  xxl: primitiveTokens.spacing['2xl'],
  '3xl': primitiveTokens.spacing['3xl'],
  '4xl': primitiveTokens.spacing['4xl'],
  '5xl': primitiveTokens.spacing['5xl'],
  '6xl': primitiveTokens.spacing['6xl'],
  '7xl': primitiveTokens.spacing['7xl'],
  '8xl': primitiveTokens.spacing['8xl'],
} as const;

export const borderRadius = {
  none: primitiveTokens.radius.none, // 0
  xs: primitiveTokens.radius.xs, // 2
  sm: primitiveTokens.radius.sm, // 4
  md: primitiveTokens.radius.md, // 6
  lg: primitiveTokens.radius.lg, // 8
  xl: primitiveTokens.radius.xl, // 12
  '2xl': primitiveTokens.radius['2xl'], // 16
  '3xl': primitiveTokens.radius['3xl'], // 20
  '4xl': primitiveTokens.radius['4xl'], // 24
  '5xl': primitiveTokens.radius['5xl'], // 32
  full: primitiveTokens.radius.full, // 9999 (circular)
} as const;

export const borderWidth = {
  none: primitiveTokens.borderWidth.none,
  hairline: primitiveTokens.borderWidth.hairline,
  thin: primitiveTokens.borderWidth.thin,
  medium: primitiveTokens.borderWidth.medium,
  thick: primitiveTokens.borderWidth.thick,
  heavy: primitiveTokens.borderWidth.heavy,
} as const;

export const shadows = {
  none: primitiveTokens.shadow.none,
  xs: primitiveTokens.shadow.xs,
  sm: primitiveTokens.shadow.sm,
  md: primitiveTokens.shadow.md,
  lg: primitiveTokens.shadow.lg,
  xl: primitiveTokens.shadow.xl,
  '2xl': primitiveTokens.shadow['2xl'],
} as const;

export const zIndex = {
  base: primitiveTokens.zIndex.base,
  dropdown: primitiveTokens.zIndex.dropdown,
  sticky: primitiveTokens.zIndex.sticky,
  overlay: primitiveTokens.zIndex.overlay,
  modal: primitiveTokens.zIndex.modal,
  popover: primitiveTokens.zIndex.popover,
  toast: primitiveTokens.zIndex.toast,
  tooltip: primitiveTokens.zIndex.tooltip,
} as const;

export const opacity = {
  none: primitiveTokens.opacity.none,
  low: primitiveTokens.opacity.light,
  medium: primitiveTokens.opacity.medium,
  high: primitiveTokens.opacity.heavy,
  full: primitiveTokens.opacity.full,
  disabled: primitiveTokens.opacity.disabled,
  hover: primitiveTokens.opacity.hover,
  pressed: primitiveTokens.opacity.pressed,
} as const;

export const animation = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
} as const;

// =============================================================================
// SIZE TOKENS
// =============================================================================

export const iconSize = {
  xxs: 12,
  '2xs': 12,
  xs: primitiveTokens.size.icon.xs,
  sm: primitiveTokens.size.icon.sm,
  md: primitiveTokens.size.icon.md,
  lg: primitiveTokens.size.icon.lg,
  xl: primitiveTokens.size.icon.xl,
  xxl: primitiveTokens.size.icon['2xl'],
  '3xl': primitiveTokens.size.icon['3xl'],
  '4xl': primitiveTokens.size.icon['4xl'],
} as const;

export const avatarSize = {
  xs: primitiveTokens.size.avatar.xs,
  sm: primitiveTokens.size.avatar.sm,
  md: primitiveTokens.size.avatar.md,
  lg: primitiveTokens.size.avatar.lg,
  xl: primitiveTokens.size.avatar.xl,
  xxl: primitiveTokens.size.avatar['3xl'],
} as const;

export const touchTarget = {
  minimum: primitiveTokens.size.touchTarget.minimum,
  comfortable: primitiveTokens.size.touchTarget.comfortable,
  spacious: primitiveTokens.size.touchTarget.spacious,
} as const;

// =============================================================================
// COMPONENT SIZES
// =============================================================================

export const componentSizes = {
  checkbox: { sm: 20, md: 24, lg: 28 },
  badge: { sm: 24, md: 28, lg: 32 },
  iconContainer: {
    xs: 28,
    sm: 36,
    md: 40,
    lg: 48,
    xl: 56,
    '2xl': 64,
    '3xl': 80,
    '4xl': 96,
    '5xl': 100,
  },
  indicator: { xs: 4, sm: 8, md: 12, lg: 20 },
  handleBar: { width: 40, height: 4 },
  divider: { vertical: { width: 1, height: 30 } },
  progressBar: { height: 8 },
  skeleton: { text: { sm: 150, md: 200, lg: 250 }, block: { sm: 80, md: 120, lg: 160 } },
  inputHeight: { sm: 44, md: 48, lg: 56 },
  cardMinHeight: { sm: 72, md: 80, lg: 100 },
  tabBarIndicator: { height: 18, md: 20, lg: 24 },
} as const;

// =============================================================================
// SHADOW CONFIGURATION (Theme-aware)
// =============================================================================

export const shadowConfig = {
  light: { opacity: 0.2, elevation: 5 },
  dark: { opacity: 0.4, elevation: 8 },
  lightSubtle: { opacity: 0.12, elevation: 3 },
  darkSubtle: { opacity: 0.25, elevation: 4 },
  lightStrong: { opacity: 0.25, elevation: 6 },
  darkStrong: { opacity: 0.5, elevation: 12 },
} as const;

// =============================================================================
// LINE HEIGHTS (Pixel values for specific use cases)
// =============================================================================

export const lineHeights = {
  caption: 14,
  captionLarge: 16,
  body: 18,
  bodyLarge: 20,
  title: 22,
  heading: 24,
  display: 28,
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const fontSize = {
  '2xs': primitiveTokens.typography.fontSize['2xs'], // 11
  xs: primitiveTokens.typography.fontSize.xs, // 13
  sm: primitiveTokens.typography.fontSize.sm, // 14
  md: primitiveTokens.typography.fontSize.md, // 15
  lg: primitiveTokens.typography.fontSize.lg, // 16
  xl: primitiveTokens.typography.fontSize.xl, // 18
  '2xl': primitiveTokens.typography.fontSize['2xl'], // 20
  '3xl': primitiveTokens.typography.fontSize['3xl'], // 24
  '4xl': primitiveTokens.typography.fontSize['4xl'], // 28
  '5xl': primitiveTokens.typography.fontSize['5xl'], // 32
  '6xl': primitiveTokens.typography.fontSize['6xl'], // 36
  '7xl': primitiveTokens.typography.fontSize['7xl'], // 40
  '8xl': primitiveTokens.typography.fontSize['8xl'], // 48
} as const;

export const fontWeight = {
  regular: primitiveTokens.typography.fontWeight.regular as TextStyle['fontWeight'],
  medium: primitiveTokens.typography.fontWeight.medium as TextStyle['fontWeight'],
  semibold: primitiveTokens.typography.fontWeight.semibold as TextStyle['fontWeight'],
  bold: primitiveTokens.typography.fontWeight.bold as TextStyle['fontWeight'],
} as const;

// =============================================================================
// COLORS (Static values - use useTheme().colors for dynamic theme colors)
// =============================================================================

export const colors = {
  // Absolute colors for static use
  white: primitiveTokens.color.absolute.white,
  black: primitiveTokens.color.absolute.black,
  transparent: primitiveTokens.color.absolute.transparent,
  // Social
  social: primitiveTokens.color.social,
  // Semantic (these don't change with theme in current setup)
  ...sdaSemanticColors,
} as const;

export const overlay = {
  light: 'rgba(255, 255, 255, 0.2)',
  lightMedium: 'rgba(255, 255, 255, 0.5)',
  lightStrong: 'rgba(255, 255, 255, 0.8)',
  darkSubtle: 'rgba(0, 0, 0, 0.1)',
  darkLight: 'rgba(0, 0, 0, 0.2)',
  darkMedium: 'rgba(0, 0, 0, 0.5)',
  darkStrong: 'rgba(0, 0, 0, 0.7)',
  darkIntense: 'rgba(0, 0, 0, 0.85)',
} as const;

// =============================================================================
// COMPONENT TOKENS
// =============================================================================

export const buttonTokens = {
  sizes: {
    small: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      minHeight: 36,
      fontSize: 14,
      iconSize: 16,
    },
    medium: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      minHeight: 48,
      fontSize: 16,
      iconSize: 20,
    },
    large: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
      minHeight: 56,
      fontSize: 18,
      iconSize: 24,
    },
  },
  variants: {
    primary: {
      backgroundColor: sdaSemanticColors.primary,
      color: sdaSemanticColors.textOnPrimary,
      borderColor: 'transparent',
    },
    secondary: {
      backgroundColor: sdaSemanticColors.secondary,
      color: sdaSemanticColors.textOnSecondary,
      borderColor: 'transparent',
    },
    accent: {
      backgroundColor: sdaSemanticColors.accent,
      color: sdaSemanticColors.textOnAccent,
      borderColor: 'transparent',
    },
    outline: {
      backgroundColor: 'transparent',
      color: sdaSemanticColors.primary,
      borderColor: sdaSemanticColors.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: sdaSemanticColors.primary,
      borderColor: 'transparent',
    },
    danger: {
      backgroundColor: sdaSemanticColors.error,
      color: sdaSemanticColors.textInverse,
      borderColor: 'transparent',
    },
  },
  borderRadius: borderRadius.md,
  borderWidth: borderWidth.medium,
} as const;

export const cardTokens = {
  borderRadius: borderRadius.lg,
  padding: spacing.lg,
  gap: spacing.md,
  backgroundColor: sdaSemanticColors.surfaceDefault,
  borderColor: sdaSemanticColors.borderLight,
  borderWidth: borderWidth.none,
  shadow: shadows.md,
} as const;

export const inputTokens = {
  borderRadius: borderRadius.md,
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.md,
  minHeight: 48,
  fontSize: 16,
  iconSize: 20,
  borderWidth: borderWidth.thin,
  backgroundColor: sdaSemanticColors.surfaceDefault,
  borderColor: sdaSemanticColors.borderMedium,
  borderColorFocus: sdaSemanticColors.borderFocus,
  borderColorError: sdaSemanticColors.borderError,
  placeholderColor: sdaSemanticColors.textQuaternary,
} as const;

export const modalTokens = {
  borderRadius: borderRadius.xl,
  padding: spacing.xl,
  gap: spacing.lg,
  backgroundColor: sdaSemanticColors.backgroundModal,
  overlayColor: sdaSemanticColors.backgroundOverlay,
  shadow: shadows['2xl'],
  maxWidth: 500,
} as const;

export const badgeTokens = {
  borderRadius: borderRadius.full,
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.sm,
  fontSize: 11,
  iconSize: 12,
  fontWeight: '600' as TextStyle['fontWeight'],
  textTransform: 'uppercase' as TextStyle['textTransform'],
  letterSpacing: 0.5,
} as const;

export const avatarTokens = {
  sizes: avatarSize,
  borderRadius: borderRadius.full,
  fontSize: { xs: 10, sm: 13, md: 16, lg: 20, xl: 28, xxl: 40 },
} as const;

export const iconTokens = {
  sizes: iconSize,
} as const;

export const touchTargets = touchTarget;

export const typographyTokens = {
  fontSizes: fontSize,
  fontWeights: fontWeight,
  lineHeights: {
    tight: primitiveTokens.typography.lineHeight.tight,
    normal: primitiveTokens.typography.lineHeight.normal,
    relaxed: primitiveTokens.typography.lineHeight.relaxed,
    loose: primitiveTokens.typography.lineHeight.loose,
  },
} as const;

export const layoutTokens = {
  container: {
    maxWidth: 1200,
    paddingHorizontal: spacing.lg,
  },
  screen: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: sdaSemanticColors.backgroundSecondary,
  },
  section: {
    marginBottom: spacing.xxl,
    gap: spacing.lg,
  },
} as const;

export const listTokens = {
  gap: spacing.md,
  itemPadding: spacing.lg,
  itemBorderRadius: borderRadius.lg,
  itemMinHeight: 72,
} as const;

export const dividerTokens = {
  color: sdaSemanticColors.borderLight,
  thickness: borderWidth.thin,
  spacing: spacing.md,
} as const;

export const statusTokens = {
  active: statusColors.active,
  inactive: statusColors.inactive,
  paused: statusColors.paused,
  pending: statusColors.pending,
  completed: statusColors.completed,
  scheduled: statusColors.scheduled,
  skipped: statusColors.skipped,
  cancelled: statusColors.cancelled,
} as const;

export const roleTokens = {
  admin: roleColors.admin,
  club_admin: roleColors.club_admin,
  user: roleColors.user,
} as const;

export const hierarchyTokens = {
  division: hierarchyColors.division,
  union: hierarchyColors.union,
  association: hierarchyColors.association,
  church: hierarchyColors.church,
  club: hierarchyColors.club,
} as const;

// =============================================================================
// RESPONSIVE BREAKPOINTS
// =============================================================================

export const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1200,
} as const;

export const responsiveScale = {
  modal: {
    mobile: 0.9,
    mobileLarge: 0.85,
    tablet: 0.65,
    desktop: 0.45,
  },
  maxWidth: {
    modal: 600,
    modalSmall: 500,
    modalLarge: 700,
  },
  maxHeight: {
    modal: 0.85,
    modalLarge: 0.9,
  },
} as const;

// =============================================================================
// TYPOGRAPHY STYLING
// =============================================================================

export const letterSpacing = {
  none: 0,
  tight: 0.25,
  normal: 0.5,
  wide: 0.75,
  wider: 1,
} as const;

export const textTransform = {
  none: 'none' as const,
  uppercase: 'uppercase' as const,
  lowercase: 'lowercase' as const,
  capitalize: 'capitalize' as const,
} as const;

// =============================================================================
// UNIFIED EXPORT
// =============================================================================

export const designTokens = {
  // Core scales
  spacing,
  borderRadius,
  borderWidth,
  shadows,
  zIndex,
  opacity,
  animation,

  // Sizes (flat access)
  iconSize,
  avatarSize,
  touchTarget,
  componentSizes,

  // Typography (flat access)
  fontSize,
  fontWeight,
  lineHeights,

  // Shadow configuration (theme-aware)
  shadowConfig,

  // Colors
  colors,
  overlay,

  // Responsive
  breakpoints,
  responsiveScale,

  // Typography styling
  letterSpacing,
  textTransform,

  // Component tokens (nested)
  button: buttonTokens,
  card: cardTokens,
  input: inputTokens,
  modal: modalTokens,
  badge: badgeTokens,
  avatar: avatarTokens,
  icon: iconTokens,
  typography: typographyTokens,
  layout: layoutTokens,
  list: listTokens,
  divider: dividerTokens,
  status: statusTokens,
  role: roleTokens,
  hierarchy: hierarchyTokens,
} as const;

export default designTokens;
