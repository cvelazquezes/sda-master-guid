/**
 * Club Members Screen Styles
 * Theme-aware style factories
 */
import { StyleSheet } from 'react-native';
import { FLEX, TEXT_TRANSFORM, TYPOGRAPHY, DIMENSIONS } from '../../../../shared/constants';
import type { ThemeContextType } from '../../../state/ThemeContext';

// ============================================================================
// MAIN STYLES FACTORY
// ============================================================================

export const createStyles = (
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
  });

// ============================================================================
// PENDING CARD STYLES FACTORY
// ============================================================================

export const createPendingCardStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.warningLight,
      borderRadius: radii.lg,
      marginBottom: spacing.md,
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
      minHeight: DIMENSIONS.MIN_HEIGHT.CARD_CONTENT,
      borderLeftWidth: 2,
      borderLeftColor: colors.warning,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: radii['3xl'],
      backgroundColor: colors.warningLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
      flexShrink: FLEX.SHRINK_DISABLED,
      position: 'relative',
    },
    avatarText: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold,
      color: colors.warning,
    },
    badge: {
      position: 'absolute',
      bottom: DIMENSIONS.OFFSET.BADGE_NEGATIVE,
      right: DIMENSIONS.OFFSET.BADGE_NEGATIVE,
      backgroundColor: colors.backgroundPrimary,
      borderRadius: radii.xl,
      width: DIMENSIONS.SIZE.BADGE_SMALL,
      height: DIMENSIONS.SIZE.BADGE_SMALL,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.warningLight,
    },
    info: {
      flex: FLEX.ONE,
      marginRight: spacing.md,
      minWidth: spacing.none,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xs,
      gap: spacing.sm,
    },
    name: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
      flex: FLEX.ONE,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xxs,
      backgroundColor: colors.warningLight,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xxs,
      borderRadius: radii.sm,
      flexShrink: FLEX.SHRINK_DISABLED,
    },
    statusText: {
      fontSize: typography.fontSizes.xs,
      fontWeight: typography.fontWeights.semibold,
      color: colors.warning,
      textTransform: TEXT_TRANSFORM.UPPERCASE,
      letterSpacing: TYPOGRAPHY.LETTER_SPACING.NORMAL,
    },
    email: {
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    detailsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: spacing.sm,
    },
    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      flexShrink: FLEX.SHRINK_DISABLED,
    },
    rejectButton: {
      backgroundColor: colors.error,
    },
    approveButton: {
      backgroundColor: colors.success,
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
      backgroundColor: colors.backgroundPrimary,
      borderRadius: radii.lg,
      marginBottom: spacing.md,
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
      minHeight: DIMENSIONS.MIN_HEIGHT.CARD_CONTENT,
    },
    cardInactive: {
      backgroundColor: colors.backgroundTertiary,
      opacity: 0.8,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: radii['3xl'],
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
      flexShrink: FLEX.SHRINK_DISABLED,
    },
    avatarText: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold,
      color: colors.textInverse,
    },
    avatarTextInactive: {
      color: colors.textQuaternary,
    },
    info: {
      flex: FLEX.ONE,
      marginRight: spacing.md,
      minWidth: spacing.none,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xs,
      gap: spacing.sm,
    },
    name: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
      flex: FLEX.ONE,
    },
    textInactive: {
      color: colors.textQuaternary,
    },
    roleBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xxs,
      borderRadius: radii.sm,
      backgroundColor: colors.infoLight,
      flexShrink: FLEX.SHRINK_DISABLED,
    },
    roleText: {
      fontSize: typography.fontSizes.xs,
      fontWeight: typography.fontWeights.semibold,
      color: colors.textSecondary,
      textTransform: TEXT_TRANSFORM.UPPERCASE,
      letterSpacing: TYPOGRAPHY.LETTER_SPACING.NORMAL,
    },
    roleTextInactive: {
      color: colors.textQuaternary,
    },
    email: {
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    detailsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: spacing.sm,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    metaText: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xxs,
    },
    statusText: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
      fontWeight: typography.fontWeights.medium,
    },
    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      flexShrink: FLEX.SHRINK_DISABLED,
    },
    balanceRow: {
      marginTop: spacing.sm,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },
    balanceIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radii.lg,
      alignSelf: 'flex-start',
    },
    balanceText: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.bold,
      color: colors.textInverse,
    },
    balanceLabel: {
      fontSize: typography.fontSizes.xs,
      fontWeight: typography.fontWeights.bold,
      color: colors.textInverse,
      marginLeft: spacing.xs,
      textTransform: TEXT_TRANSFORM.UPPERCASE,
      letterSpacing: TYPOGRAPHY.LETTER_SPACING.NORMAL,
    },
  });
