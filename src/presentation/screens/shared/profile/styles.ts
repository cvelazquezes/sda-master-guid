/**
 * Profile Screen Styles
 * Theme-aware style factories
 */
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ThemeContextType } from '../../../state/ThemeContext';
import { FLEX } from '../../../../shared/constants';
import { MATH } from '../../../../shared/constants/numbers';

// ============================================================================
// SCREEN STYLES FACTORY
// ============================================================================

export const createScreenStyles = (colors: ThemeContextType['colors']) =>
  StyleSheet.create({
    container: {
      flex: FLEX.ONE,
      backgroundColor: colors.background,
    },
  });

// ============================================================================
// PROFILE HEADER STYLES FACTORY
// ============================================================================

export const createProfileHeaderStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) => {
  const avatarSizeXxl = 96;
  const avatarSizeXl = 80;

  return StyleSheet.create({
    headerSection: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
    },
    profileCard: {
      overflow: 'hidden',
    },
    profileHeader: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing.lg,
    },
    avatarWrapper: {
      marginBottom: spacing.md,
    },
    avatarOuter: {
      width: avatarSizeXxl,
      height: avatarSizeXxl,
      borderRadius: avatarSizeXxl / MATH.HALF,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarInner: {
      width: avatarSizeXl,
      height: avatarSizeXl,
      borderRadius: avatarSizeXl / MATH.HALF,
      alignItems: 'center',
      justifyContent: 'center',
    },
    userName: {
      fontSize: typography.fontSizes['2xl'],
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.white,
      marginBottom: spacing.xs,
      textAlign: 'center',
    },
    userEmail: {
      fontSize: typography.fontSizes.md,
      color: 'rgba(255, 255, 255, 0.7)',
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    roleBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: radii.full,
      gap: spacing.xs,
    },
    roleText: {
      fontSize: typography.fontSizes.xs,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.white,
    },
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.lg,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.2)',
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    statDivider: {
      width: 1,
      height: spacing.lg,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      marginHorizontal: spacing.md,
    },
    statText: {
      fontSize: typography.fontSizes.xs,
      color: 'rgba(255, 255, 255, 0.7)',
    },
  });
};

// ============================================================================
// ACCOUNT STATUS STYLES FACTORY
// ============================================================================

export const createAccountStatusStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  typography: ThemeContextType['typography']
) => {
  const touchTargetComfortable = 48;

  return StyleSheet.create({
    section: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statusInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: FLEX.ONE,
      gap: spacing.md,
    },
    statusIconContainer: {
      width: touchTargetComfortable,
      height: touchTargetComfortable,
      borderRadius: touchTargetComfortable / MATH.HALF,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statusText: {
      flex: FLEX.ONE,
    },
    statusLabel: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      marginBottom: spacing.xxs,
      color: colors.textPrimary,
    },
    statusDescription: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
    },
  });
};

// ============================================================================
// CONTACT INFO STYLES FACTORY
// ============================================================================

export const createContactInfoStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  typography: ThemeContextType['typography']
) => {
  const touchTargetMinimum = 40;

  return StyleSheet.create({
    section: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
    },
    detailsContainer: {},
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
      gap: spacing.md,
    },
    detailIconContainer: {
      width: touchTargetMinimum,
      height: touchTargetMinimum,
      borderRadius: touchTargetMinimum / MATH.HALF,
      alignItems: 'center',
      justifyContent: 'center',
    },
    detailText: {
      flex: FLEX.ONE,
    },
    detailLabel: {
      fontSize: typography.fontSizes.xs,
      marginBottom: spacing.xxs,
      color: colors.textSecondary,
    },
    detailValue: {
      fontSize: typography.fontSizes.md,
      color: colors.textPrimary,
    },
  });
};

// ============================================================================
// PREFERENCES STYLES FACTORY
// ============================================================================

export const createPreferencesStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  typography: ThemeContextType['typography']
) => {
  const touchTargetMinimum = 40;

  return StyleSheet.create({
    section: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
    },
    settingsContainer: {},
    settingRow: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: 'transparent',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    menuIconContainer: {
      width: touchTargetMinimum,
      height: touchTargetMinimum,
      borderRadius: touchTargetMinimum / MATH.HALF,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuContent: {
      flex: FLEX.ONE,
    },
    menuLabel: {
      fontSize: typography.fontSizes.xs,
      marginBottom: spacing.xxs,
      color: colors.textSecondary,
    },
    menuValue: {
      fontSize: typography.fontSizes.md,
      color: colors.textPrimary,
    },
  });
};

// ============================================================================
// LOGOUT STYLES FACTORY
// ============================================================================

export const createLogoutStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    section: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.md,
      borderRadius: radii.lg,
      borderWidth: 2,
      borderColor: colors.error,
      gap: spacing.sm,
    },
    logoutButtonText: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.error,
    },
    versionSection: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
      paddingBottom: spacing['3xl'],
    },
    versionText: {
      fontSize: typography.fontSizes.xs,
      color: colors.textTertiary,
    },
  });
