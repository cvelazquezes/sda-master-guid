/**
 * Notifications Screen Styles
 * Theme-aware style factories
 */
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { BORDERS, DIMENSIONS, FLEX, SHADOW_OFFSET } from '../../../../shared/constants';
import type { ThemeContextType } from '../../../state/ThemeContext';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type ScreenStyles = {
  container: ViewStyle;
  content: ViewStyle;
};

type HeaderStyles = {
  markAllButton: ViewStyle;
  markAllText: TextStyle;
};

type BannerStyles = {
  unreadBanner: ViewStyle;
  unreadText: TextStyle;
};

type NotificationCardStyles = {
  card: ViewStyle;
  cardUnread: ViewStyle;
  unreadDot: ViewStyle;
  iconContainer: ViewStyle;
  content: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  time: TextStyle;
  message: TextStyle;
};

type EmptyStyles = {
  container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
};

// ============================================================================
// SCREEN STYLES FACTORY
// ============================================================================

export const createScreenStyles = (colors: ThemeContextType['colors']): ScreenStyles =>
  StyleSheet.create({
    container: {
      flex: FLEX.ONE,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: FLEX.ONE,
    },
  });

// ============================================================================
// HEADER STYLES FACTORY
// ============================================================================

export const createHeaderStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  typography: ThemeContextType['typography']
): HeaderStyles =>
  StyleSheet.create({
    markAllButton: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
    },
    markAllText: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.primary,
    },
  });

// ============================================================================
// BANNER STYLES FACTORY
// ============================================================================

export const createBannerStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  typography: ThemeContextType['typography']
): BannerStyles =>
  StyleSheet.create({
    unreadBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primaryAlpha20,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    unreadText: {
      fontSize: typography.fontSizes.sm,
      color: colors.textPrimary,
      fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
    },
  });

// ============================================================================
// NOTIFICATION CARD STYLES FACTORY
// ============================================================================

export const createNotificationCardStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): NotificationCardStyles =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      padding: spacing.lg,
      marginHorizontal: spacing.lg,
      marginTop: spacing.md,
      borderRadius: radii.lg,
      shadowColor: colors.textPrimary,
      shadowOffset: SHADOW_OFFSET.MD,
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
      position: 'relative',
    },
    cardUnread: {
      backgroundColor: colors.primaryAlpha10,
      borderLeftWidth: BORDERS.WIDTH.MEDIUM,
      borderLeftColor: colors.primary,
    },
    unreadDot: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      width: DIMENSIONS.PROGRESS_BAR.STANDARD,
      height: DIMENSIONS.PROGRESS_BAR.STANDARD,
      borderRadius: radii.xs,
      backgroundColor: colors.primary,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: radii['3xl'],
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    content: {
      flex: FLEX.ONE,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
      gap: spacing.sm,
    },
    title: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      flex: FLEX.ONE,
      color: colors.textPrimary,
    },
    time: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
    },
    message: {
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
    },
  });

// ============================================================================
// EMPTY STATE STYLES FACTORY
// ============================================================================

export const createEmptyStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  typography: ThemeContextType['typography']
): EmptyStyles =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing['7xl'],
      paddingHorizontal: spacing['4xl'],
    },
    title: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.textPrimary,
      marginTop: spacing.lg,
    },
    subtitle: {
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
  });
