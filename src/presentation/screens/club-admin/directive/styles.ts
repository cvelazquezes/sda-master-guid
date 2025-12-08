/**
 * Club Directive Screen Styles
 * Theme-aware style factories
 */
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ThemeContextType } from '../../../state/ThemeContext';
import {
  FLEX,
  BORDERS,
  SHADOW_OFFSET,
  DIMENSIONS,
  TYPOGRAPHY,
} from '../../../../shared/constants';

// Re-export shared styles for convenience
export {
  containerStyles,
  sectionStyles as sharedSectionStyles,
  footerStyles as sharedFooterStyles,
} from '../../shared/styles';

// ============================================================================
// SCREEN STYLES FACTORY
// ============================================================================

export const createScreenStyles = (colors: ThemeContextType['colors']) =>
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
// SUMMARY BANNER STYLES FACTORY
// ============================================================================

export const createSummaryStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    banner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: colors.backgroundPrimary,
      paddingVertical: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    text: {
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
    },
    bold: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.textPrimary,
    },
    separator: {
      width: BORDERS.WIDTH.THIN,
      height: DIMENSIONS.HEIGHT.DIVIDER,
      backgroundColor: colors.borderLight,
    },
  });

// ============================================================================
// SECTION STYLES FACTORY
// ============================================================================

export const createSectionStyles = (
  spacing: ThemeContextType['spacing'],
  typography: ThemeContextType['typography'],
  colors: ThemeContextType['colors']
) =>
  StyleSheet.create({
    section: {
      padding: spacing.xl,
    },
    title: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      marginBottom: spacing.lg,
      color: colors.textPrimary,
    },
  });

// ============================================================================
// POSITION CARD STYLES FACTORY
// ============================================================================

export const createPositionCardStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: colors.backgroundPrimary,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderRadius: radii.lg,
      shadowColor: colors.textPrimary,
      shadowOffset: SHADOW_OFFSET.MD,
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    icon: {
      width: DIMENSIONS.SIZE.AVATAR_MEDIUM,
      height: DIMENSIONS.SIZE.AVATAR_MEDIUM,
      borderRadius: radii['4xl'],
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    content: {
      flex: FLEX.ONE,
    },
    header: {
      marginBottom: spacing.sm,
    },
    title: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.textPrimary,
    },
    description: {
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
      marginBottom: spacing.md,
    },
  });

// ============================================================================
// MEMBER CARD STYLES FACTORY
// ============================================================================

export const createMemberCardStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.inputBackground,
      padding: spacing.md,
      borderRadius: radii.xl,
      marginTop: spacing.sm,
    },
    avatar: {
      width: DIMENSIONS.SIZE.ICON_BUTTON_SMALL,
      height: DIMENSIONS.SIZE.ICON_BUTTON_SMALL,
      borderRadius: radii['3xl'],
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    avatarText: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.textInverse,
    },
    info: {
      flex: FLEX.ONE,
    },
    name: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.textPrimary,
    },
    email: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
      marginTop: spacing.xxs,
    },
    removeButton: {
      padding: spacing.sm,
    },
  });

// ============================================================================
// ASSIGN BUTTON STYLES FACTORY
// ============================================================================

export const createAssignButtonStyles = (
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
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.primary,
      borderStyle: 'dashed',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    text: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.primary,
    },
  });

// ============================================================================
// INFO BANNER STYLES FACTORY
// ============================================================================

export const createInfoBannerStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    banner: {
      flexDirection: 'row',
      backgroundColor: colors.infoLight,
      padding: spacing.lg,
      margin: spacing.xl,
      borderRadius: radii.xl,
      gap: spacing.md,
      borderLeftWidth: BORDERS.WIDTH.MEDIUM,
      borderLeftColor: colors.info,
    },
    text: {
      fontSize: typography.fontSizes.sm,
      color: colors.info,
      flex: FLEX.ONE,
      lineHeight: TYPOGRAPHY.LINE_HEIGHT.LG,
    },
  });

// ============================================================================
// FOOTER STYLES FACTORY
// ============================================================================

export const createFooterStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    footer: {
      padding: spacing.xl,
      backgroundColor: colors.backgroundPrimary,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },
    saveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      borderRadius: radii.xl,
      gap: spacing.md,
    },
    saveButtonText: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.textInverse,
    },
  });
