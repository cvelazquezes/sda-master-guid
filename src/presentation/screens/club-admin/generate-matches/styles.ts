/**
 * Generate Matches Screen Styles
 * Theme-aware style factories
 */
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ThemeContextType } from '../../../state/ThemeContext';
import { FLEX, BORDER_WIDTH } from '../../../../shared/constants';

// Re-export shared styles for convenience
export {
  containerStyles,
  sectionStyles,
  cardStyles,
  emptyStateStyles,
} from '../../shared/styles';

// ============================================================================
// SCREEN STYLES FACTORY
// ============================================================================

export const createScreenStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing']
) =>
  StyleSheet.create({
    container: {
      flex: FLEX.ONE,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      padding: spacing.lg,
    },
    actionsContainer: {
      marginBottom: spacing.xxl,
      gap: spacing.md,
    },
  });

// ============================================================================
// SECTION STYLES FACTORY
// ============================================================================

export const createSectionStylesLocal = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    section: {
      backgroundColor: colors.backgroundPrimary,
      padding: spacing.lg,
      borderRadius: radii.lg,
    },
    title: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      marginBottom: spacing.lg,
      color: colors.textPrimary,
    },
  });

// ============================================================================
// ROUND CARD STYLES FACTORY
// ============================================================================

export const createRoundCardStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.inputBackground,
      padding: spacing.lg,
      borderRadius: radii.lg,
      marginBottom: spacing.md,
      borderLeftWidth: BORDER_WIDTH.EXTRA_THICK,
      borderLeftColor: colors.primary,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    info: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: FLEX.ONE,
    },
    details: {
      marginLeft: spacing.md,
    },
    date: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.textPrimary,
    },
    status: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    badge: {
      backgroundColor: colors.infoAlpha20,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radii.lg,
    },
    badgeText: {
      fontSize: typography.fontSizes.xs,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.textPrimary,
    },
    created: {
      fontSize: typography.fontSizes.xs,
      color: colors.textTertiary,
    },
  });

// ============================================================================
// EMPTY STATE STYLES FACTORY
// ============================================================================

export const createEmptyStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      padding: spacing['4xl'],
    },
    title: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.textSecondary,
      marginTop: spacing.lg,
    },
    subtitle: {
      fontSize: typography.fontSizes.sm,
      color: colors.textTertiary,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
  });
