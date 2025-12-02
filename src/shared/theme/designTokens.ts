/**
 * Design Tokens
 * Centralized design system tokens for SDA Master Guide app
 * Following design system best practices from major tech companies
 */

import { ViewStyle, TextStyle } from 'react-native';
import { sdaSemanticColors, roleColors, statusColors, hierarchyColors } from './sdaColors';

/**
 * Spacing Scale
 * Based on 4px grid system
 */
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

/**
 * Border Radius Scale
 */
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  '3xl': 24,
  full: 9999,
} as const;

/**
 * Border Width Scale
 */
export const borderWidth = {
  none: 0,
  thin: 1,
  medium: 2,
  thick: 3,
  heavy: 4,
} as const;

/**
 * Shadow Definitions
 */
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: sdaSemanticColors.shadowLight,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: sdaSemanticColors.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: sdaSemanticColors.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: sdaSemanticColors.shadowHeavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  xl: {
    shadowColor: sdaSemanticColors.shadowHeavy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  '2xl': {
    shadowColor: sdaSemanticColors.shadowXL,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

/**
 * Z-Index Scale
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
  tooltip: 1600,
} as const;

/**
 * Opacity Scale
 */
export const opacity = {
  none: 0,
  low: 0.1,
  medium: 0.5,
  high: 0.8,
  full: 1,
  disabled: 0.4,
  hover: 0.9,
  pressed: 0.7,
} as const;

/**
 * Animation Duration
 */
export const animation = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
} as const;

/**
 * Component-specific Design Tokens
 */

// Button Tokens
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

// Card Tokens
export const cardTokens = {
  borderRadius: borderRadius.lg,
  padding: spacing.lg,
  gap: spacing.md,
  backgroundColor: sdaSemanticColors.surfaceDefault,
  borderColor: sdaSemanticColors.borderLight,
  borderWidth: borderWidth.none,
  shadow: shadows.md,
} as const;

// Input Tokens
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

// Modal Tokens
export const modalTokens = {
  borderRadius: borderRadius.xl,
  padding: spacing.xl,
  gap: spacing.lg,
  backgroundColor: sdaSemanticColors.backgroundModal,
  overlayColor: sdaSemanticColors.backgroundOverlay,
  shadow: shadows['2xl'],
  maxWidth: 500,
} as const;

// Badge Tokens
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

// Avatar Tokens
export const avatarTokens = {
  sizes: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    xxl: 96,
  },
  borderRadius: borderRadius.full,
  fontSize: {
    xs: 10,
    sm: 13,
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 40,
  },
} as const;

// Icon Tokens
export const iconTokens = {
  sizes: {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    xxl: 32,
    '3xl': 40,
    '4xl': 48,
  },
} as const;

// Touch Target Tokens
export const touchTargets = {
  minimum: 44,
  comfortable: 48,
  spacious: 56,
} as const;

// Typography Tokens (referencing mobileTypography)
export const typographyTokens = {
  fontSizes: {
    xs: 13,
    sm: 14,
    md: 15,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 36,
  },
  fontWeights: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
} as const;

/**
 * Layout Tokens
 */
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

/**
 * List Tokens
 */
export const listTokens = {
  gap: spacing.md,
  itemPadding: spacing.lg,
  itemBorderRadius: borderRadius.lg,
  itemMinHeight: 72,
} as const;

/**
 * Divider Tokens
 */
export const dividerTokens = {
  color: sdaSemanticColors.borderLight,
  thickness: borderWidth.thin,
  spacing: spacing.md,
} as const;

/**
 * Status-specific tokens
 */
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

/**
 * Role-specific tokens
 */
export const roleTokens = {
  admin: roleColors.admin,
  club_admin: roleColors.club_admin,
  user: roleColors.user,
} as const;

/**
 * Hierarchy tokens
 */
export const hierarchyTokens = {
  division: hierarchyColors.division,
  union: hierarchyColors.union,
  association: hierarchyColors.association,
  church: hierarchyColors.church,
  club: hierarchyColors.club,
} as const;

/**
 * Complete Design Tokens Export
 */
export const designTokens = {
  spacing,
  borderRadius,
  borderWidth,
  shadows,
  zIndex,
  opacity,
  animation,
  colors: sdaSemanticColors,
  button: buttonTokens,
  card: cardTokens,
  input: inputTokens,
  modal: modalTokens,
  badge: badgeTokens,
  avatar: avatarTokens,
  icon: iconTokens,
  touchTarget: touchTargets,
  typography: typographyTokens,
  layout: layoutTokens,
  list: listTokens,
  divider: dividerTokens,
  status: statusTokens,
  role: roleTokens,
  hierarchy: hierarchyTokens,
} as const;

export default designTokens;

