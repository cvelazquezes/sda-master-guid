/**
 * Account Screen Styles
 * Theme-aware style factories
 */
import { StyleSheet } from 'react-native';
import { FLEX, BORDERS } from '../../../../shared/constants';
import type { ThemeContextType } from '../../../state/ThemeContext';

// ============================================================================
// MAIN STYLES FACTORY
// ============================================================================

export const createStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) => {
  const avatarSizeXxl = 96;
  const avatarSizeMd = 40;

  return StyleSheet.create({
    container: {
      flex: FLEX.ONE,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: FLEX.ONE,
    },
    section: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
    },
    profileCard: {
      marginBottom: spacing.none,
    },
    profileHeader: {
      alignItems: 'center',
      paddingVertical: spacing.md,
    },
    avatarContainer: {
      width: avatarSizeXxl,
      height: avatarSizeXxl,
      borderRadius: radii.full,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    profileName: {
      fontSize: typography.fontSizes['2xl'],
      fontWeight: typography.fontWeights.bold,
      marginBottom: spacing.xs,
      textAlign: 'center',
      color: colors.textPrimary,
    },
    profileEmail: {
      fontSize: typography.fontSizes.md,
      marginBottom: spacing.sm,
      textAlign: 'center',
      color: colors.textSecondary,
    },
    roleBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: radii.full,
      gap: spacing.xs,
    },
    roleText: {
      fontSize: typography.fontSizes.xs,
      fontWeight: typography.fontWeights.bold,
    },
    settingRow: {
      borderBottomWidth: 1,
      borderBottomColor: 'transparent',
    },
    detailsContainer: {},
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: 'transparent',
      gap: spacing.md,
    },
    detailIconContainer: {
      width: avatarSizeMd,
      height: avatarSizeMd,
      borderRadius: radii.full,
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
    classesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
      marginTop: spacing.xs,
    },
    classBadge: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: radii.md,
    },
    classBadgeText: {
      fontSize: typography.fontSizes.xs,
      fontWeight: typography.fontWeights.semibold,
    },
    bottomSpacer: {
      height: spacing['3xl'],
    },
  });
};

// ============================================================================
// STATUS STYLES FACTORY
// ============================================================================

export const createStatusStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) => {
  const touchTargetComfortable = 48;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    info: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: FLEX.ONE,
      gap: spacing.md,
    },
    iconContainer: {
      width: touchTargetComfortable,
      height: touchTargetComfortable,
      borderRadius: radii.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      flex: FLEX.ONE,
    },
    label: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      marginBottom: spacing.xxs,
      color: colors.textPrimary,
    },
    description: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
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
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.md,
      borderRadius: radii.lg,
      borderWidth: 2,
      borderColor: colors.error,
      gap: spacing.sm,
    },
    buttonText: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      color: colors.error,
    },
  });
