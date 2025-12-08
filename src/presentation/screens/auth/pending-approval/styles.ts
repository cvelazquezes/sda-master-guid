/**
 * Pending Approval Screen Styles
 * Theme-aware style factories
 */
import { StyleSheet, ViewStyle } from 'react-native';
import { FLEX, SHADOW_OFFSET, TYPOGRAPHY } from '../../../../shared/constants';
import { SPACING, BORDER_WIDTH } from '../../../../shared/constants/numbers';
import type { ThemeContextType } from '../../../state/ThemeContext';
import type { TextStyle } from 'react-native';

// ============================================================================
// SCREEN STYLES FACTORY
// ============================================================================

export const createScreenStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing']
) =>
  StyleSheet.create({
    safeArea: {
      flex: FLEX.ONE,
      backgroundColor: colors.backgroundSecondary,
    },
    container: {
      flexGrow: FLEX.GROW_ENABLED,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: FLEX.ONE,
      padding: spacing.xl,
      paddingTop: spacing['6xl'],
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: spacing.xxl,
    },
  });

// ============================================================================
// TEXT STYLES FACTORY
// ============================================================================

export const createTextStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    title: {
      fontSize: typography.fontSizes['4xl'],
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    message: {
      fontSize: typography.fontSizes.xl,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.xxl,
    },
    userName: {
      fontWeight: typography.fontWeights.bold,
      color: colors.primary,
    },
  });

// ============================================================================
// INFO CARD STYLES FACTORY
// ============================================================================

export const createInfoCardStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.backgroundPrimary,
      borderRadius: radii.lg,
      padding: spacing.lg,
      marginBottom: spacing.xl,
      shadowColor: colors.textPrimary,
      shadowOffset: SHADOW_OFFSET.MD,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      gap: spacing.md,
    },
    text: {
      fontSize: typography.fontSizes.lg,
      color: colors.textPrimary,
      flex: FLEX.ONE,
    },
  });

// ============================================================================
// STATUS CARD STYLES FACTORY
// ============================================================================

export const createStatusCardStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.backgroundPrimary,
      borderRadius: radii.lg,
      padding: spacing.xl,
      marginBottom: spacing.xl,
      shadowColor: colors.textPrimary,
      shadowOffset: SHADOW_OFFSET.MD,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xl,
      gap: spacing.md,
    },
    title: {
      fontSize: typography.fontSizes['2xl'],
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
    },
    step: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.lg,
      gap: spacing.md,
    },
    stepNumber: {
      width: SPACING.LG_PLUS,
      height: SPACING.LG_PLUS,
      borderRadius: radii['2xl'],
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    stepNumberText: {
      color: colors.textInverse,
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.bold,
    },
    stepText: {
      flex: FLEX.ONE,
      fontSize: typography.fontSizes.lg,
      color: colors.textSecondary,
      lineHeight: TYPOGRAPHY.LINE_HEIGHT.XL,
      marginTop: spacing.xxs,
    },
  });

// ============================================================================
// NOTE CARD STYLES FACTORY
// ============================================================================

export const createNoteCardStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: colors.warningLight,
      borderRadius: radii.lg,
      padding: spacing.lg,
      marginBottom: spacing.xxl,
      gap: spacing.md,
      borderLeftWidth: BORDER_WIDTH.HEAVY,
      borderLeftColor: colors.warning,
    },
    text: {
      flex: FLEX.ONE,
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
      lineHeight: TYPOGRAPHY.LINE_HEIGHT.LG,
    },
  });

// ============================================================================
// BUTTON STYLES FACTORY
// ============================================================================

export const createButtonStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    logout: {
      flexDirection: 'row',
      backgroundColor: colors.primary,
      padding: spacing.lg,
      borderRadius: radii.lg,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    logoutText: {
      color: colors.textInverse,
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold,
    },
  });
