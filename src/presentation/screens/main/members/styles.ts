/**
 * Members Screen Styles
 *
 * Note: This screen uses a factory pattern with useTheme() for theme-aware styles.
 * This file provides the style factory functions.
 */
import { StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { FLEX, DIMENSIONS } from '../../../../shared/constants';
import type { ThemeContextType } from '../../../state/ThemeContext';

// ============================================================================
// STYLE FACTORY
// ============================================================================

type MembersStyles = {
  container: ViewStyle;
  searchContainer: ViewStyle;
  scrollView: ViewStyle;
  content: ViewStyle;
};

export const createStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing']
): MembersStyles =>
  StyleSheet.create({
    container: {
      flex: FLEX.ONE,
      backgroundColor: colors.backgroundSecondary,
    },
    searchContainer: {
      marginHorizontal: spacing.lg,
      marginTop: spacing.md,
      marginBottom: spacing.lg,
    },
    scrollView: {
      flex: FLEX.ONE,
    },
    content: {
      padding: spacing.lg,
    },
  });

// ============================================================================
// MEMBER CARD STYLES
// ============================================================================

type MemberCardStyles = {
  content: ViewStyle;
  avatar: ViewStyle;
  avatarText: TextStyle;
  name: TextStyle;
  email: TextStyle;
  whatsappBadge: ViewStyle;
  whatsappText: TextStyle;
};

export const createMemberCardStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): MemberCardStyles =>
  StyleSheet.create({
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    avatar: {
      width: DIMENSIONS.SIZE.AVATAR_MEDIUM,
      height: DIMENSIONS.SIZE.AVATAR_MEDIUM,
      borderRadius: radii['4xl'],
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: typography.fontSizes['2xl'],
      fontWeight: typography.fontWeights.bold,
      color: colors.textInverse,
    },
    name: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
      marginBottom: spacing.xxs,
    },
    email: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    whatsappBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.xs,
    },
    whatsappText: {
      fontSize: typography.fontSizes.xs,
      color: colors.success,
    },
  });
