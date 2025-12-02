/**
 * Design Constants
 * Shared UI/UX constants for consistent design across all roles
 * Updated to use SDA Brand Colors
 * 
 * @deprecated Use designTokens from './designTokens' instead for new code
 * This file is maintained for backward compatibility
 */

import { sdaSemanticColors, statusColors, roleColors, hierarchyColors } from './sdaColors';
import { borderRadius } from './designTokens';
import { mobileFontSizes } from './mobileTypography';

export const DesignConstants = {
  // Card Styles
  card: {
    borderRadius: borderRadius.lg,
    padding: 16,
    marginBottom: 12,
    shadow: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  },

  // Menu/Dashboard Card Styles
  menuCard: {
    borderRadius: borderRadius.lg,
    padding: 20,
    marginBottom: 16,
  },

  // Icon Container for Menu Items
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },

  // Icon Sizes (Mobile Optimized - Minimum 14px)
  iconSizes: {
    tiny: 14,
    small: 16,
    medium: 20,
    large: 24,
    xlarge: 28,
    xxlarge: 32,
  },

  // Stat Card (for dashboards)
  statCard: {
    borderRadius: borderRadius.lg,
    padding: 16,
    minHeight: 100,
  },

  // Button Styles - Updated with SDA Colors
  button: {
    primary: {
      backgroundColor: sdaSemanticColors.primary,
      borderRadius: borderRadius.md,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    secondary: {
      backgroundColor: sdaSemanticColors.secondary,
      borderRadius: borderRadius.md,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    accent: {
      backgroundColor: sdaSemanticColors.accent,
      borderRadius: borderRadius.md,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    danger: {
      backgroundColor: sdaSemanticColors.error,
      borderRadius: borderRadius.md,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  },

  // Badge Styles
  badge: {
    borderRadius: borderRadius.lg,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  // Status Colors - Updated with SDA Colors
  status: {
    active: {
      bg: statusColors.active.light,
      color: statusColors.active.primary,
      icon: statusColors.active.icon,
    },
    inactive: {
      bg: statusColors.inactive.light,
      color: statusColors.inactive.primary,
      icon: statusColors.inactive.icon,
    },
    paused: {
      bg: statusColors.paused.light,
      color: statusColors.paused.primary,
      icon: statusColors.paused.icon,
    },
    pending: {
      bg: statusColors.pending.light,
      color: statusColors.pending.primary,
      icon: statusColors.pending.icon,
    },
    completed: {
      bg: statusColors.completed.light,
      color: statusColors.completed.primary,
      icon: statusColors.completed.icon,
    },
    scheduled: {
      bg: statusColors.scheduled.light,
      color: statusColors.scheduled.primary,
      icon: statusColors.scheduled.icon,
    },
    skipped: {
      bg: statusColors.skipped.light,
      color: statusColors.skipped.primary,
      icon: statusColors.skipped.icon,
    },
    cancelled: {
      bg: statusColors.cancelled.light,
      color: statusColors.cancelled.primary,
      icon: statusColors.cancelled.icon,
    },
  },

  // Role Colors - Updated with SDA Colors
  role: {
    admin: {
      bg: roleColors.admin.light,
      color: roleColors.admin.primary,
      icon: roleColors.admin.icon,
    },
    club_admin: {
      bg: roleColors.club_admin.light,
      color: roleColors.club_admin.primary,
      icon: roleColors.club_admin.icon,
    },
    user: {
      bg: roleColors.user.light,
      color: roleColors.user.primary,
      icon: roleColors.user.icon,
    },
  },

  // Hierarchy Colors - Updated with SDA Colors
  hierarchy: {
    bg: sdaSemanticColors.primaryLight,
    color: sdaSemanticColors.primary,
    division: {
      icon: hierarchyColors.division.icon,
      color: hierarchyColors.division.primary,
    },
    union: {
      icon: hierarchyColors.union.icon,
      color: hierarchyColors.union.primary,
    },
    association: {
      icon: hierarchyColors.association.icon,
      color: hierarchyColors.association.primary,
    },
    church: {
      icon: hierarchyColors.church.icon,
      color: hierarchyColors.church.primary,
    },
    club: {
      icon: hierarchyColors.club.icon,
      color: hierarchyColors.club.primary,
    },
  },

  // Typography - Mobile Optimized (Minimum 13px for readability)
  typography: {
    h1: {
      fontSize: mobileFontSizes['4xl'],
      fontWeight: 'bold' as const,
      color: '#333',
      lineHeight: 36,
    },
    h2: {
      fontSize: mobileFontSizes['3xl'],
      fontWeight: 'bold' as const,
      color: '#333',
      lineHeight: 32,
    },
    h3: {
      fontSize: mobileFontSizes['2xl'],
      fontWeight: '600' as const,
      color: '#333',
      lineHeight: 28,
    },
    h4: {
      fontSize: mobileFontSizes.xl,
      fontWeight: '600' as const,
      color: '#333',
      lineHeight: 26,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      color: '#666',
      lineHeight: 24,
    },
    bodyBold: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: '#333',
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 15,
      fontWeight: '400' as const,
      color: '#666',
      lineHeight: 22,
    },
    caption: {
      fontSize: mobileFontSizes.sm,
      fontWeight: '400' as const,
      color: '#666',
      lineHeight: 20,
    },
    captionBold: {
      fontSize: mobileFontSizes.sm,
      fontWeight: '600' as const,
      color: '#333',
      lineHeight: 20,
    },
    label: {
      fontSize: mobileFontSizes.xs,
      fontWeight: '500' as const,
      color: '#666',
      lineHeight: 18,
    },
    labelBold: {
      fontSize: mobileFontSizes.xs,
      fontWeight: '600' as const,
      color: '#333',
      lineHeight: 18,
    },
    small: {
      fontSize: mobileFontSizes.xs,
      fontWeight: '400' as const,
      color: '#999',
      lineHeight: 18,
    },
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },

  // Colors - Updated with SDA Brand Colors
  colors: {
    primary: sdaSemanticColors.primary,
    primaryLight: sdaSemanticColors.primaryLight,
    secondary: sdaSemanticColors.secondary,
    secondaryLight: sdaSemanticColors.secondaryLight,
    accent: sdaSemanticColors.accent,
    accentLight: sdaSemanticColors.accentLight,
    success: sdaSemanticColors.success,
    successLight: sdaSemanticColors.successLight,
    warning: sdaSemanticColors.warning,
    warningLight: sdaSemanticColors.warningLight,
    error: sdaSemanticColors.error,
    errorLight: sdaSemanticColors.errorLight,
    info: sdaSemanticColors.info,
    infoLight: sdaSemanticColors.infoLight,
    text: {
      primary: sdaSemanticColors.textPrimary,
      secondary: sdaSemanticColors.textSecondary,
      tertiary: sdaSemanticColors.textTertiary,
      quaternary: sdaSemanticColors.textQuaternary,
      disabled: sdaSemanticColors.textDisabled,
      inverse: sdaSemanticColors.textInverse,
    },
    background: {
      primary: sdaSemanticColors.backgroundPrimary,
      secondary: sdaSemanticColors.backgroundSecondary,
      tertiary: sdaSemanticColors.backgroundTertiary,
    },
    border: {
      light: sdaSemanticColors.borderLight,
      medium: sdaSemanticColors.borderMedium,
      dark: sdaSemanticColors.borderDark,
    },
  },
};

export default DesignConstants;

