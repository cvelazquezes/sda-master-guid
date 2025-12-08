/**
 * Users Management Screen Styles
 * Theme-aware style factories
 */
import { StyleSheet } from 'react-native';
import {
  FLEX,
  DIMENSIONS,
  BORDERS,
  TEXT_TRANSFORM,
  TYPOGRAPHY,
} from '../../../../shared/constants';
import { BORDER_WIDTH } from '../../../../shared/constants/numbers';
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
// PENDING STYLES FACTORY
// ============================================================================

export const createPendingStyles = (
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
      borderLeftWidth: BORDER_WIDTH.THICK,
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
    userInfo: {
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
    userName: {
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
    userEmail: {
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
      marginRight: spacing.sm,
    },
    metaText: {
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
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
// MODAL STYLES FACTORY
// ============================================================================

export const createModalStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    overlay: {
      flex: FLEX.ONE,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    overlayMobile: {
      justifyContent: 'flex-end',
      padding: spacing.none,
    },
    content: {
      backgroundColor: colors.backgroundPrimary,
      borderRadius: radii['3xl'],
      width: DIMENSIONS.WIDTH.FULL,
      maxWidth: DIMENSIONS.MAX_WIDTH.MODAL,
      maxHeight: DIMENSIONS.MAX_HEIGHT.MODAL_PERCENT,
    },
    contentMobile: {
      maxWidth: DIMENSIONS.MAX_WIDTH_PERCENT.FULL,
      borderBottomLeftRadius: BORDERS.RADIUS.NONE,
      borderBottomRightRadius: BORDERS.RADIUS.NONE,
      borderTopLeftRadius: radii['3xl'],
      borderTopRightRadius: radii['3xl'],
    },
    dragHandle: {
      width: 40,
      height: DIMENSIONS.HEIGHT.DRAG_HANDLE,
      backgroundColor: colors.borderLight,
      borderRadius: radii.full,
      alignSelf: 'center',
      marginTop: spacing.sm,
      marginBottom: spacing.xs,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    title: {
      fontSize: typography.fontSizes['2xl'],
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
    },
    closeButton: {
      padding: spacing.xs,
    },
    body: {
      maxHeight: DIMENSIONS.MAX_HEIGHT.MODAL_BODY_SMALL,
    },
    footer: {
      flexDirection: 'row',
      padding: spacing.lg,
      gap: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },
  });

// ============================================================================
// FILTER STYLES FACTORY
// ============================================================================

export const createFilterStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    infoBanner: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: colors.primaryAlpha20,
      padding: spacing.md,
      borderRadius: radii.md,
      margin: spacing.lg,
      marginBottom: spacing.none,
      gap: spacing.sm,
    },
    infoText: {
      flex: FLEX.ONE,
      fontSize: typography.fontSizes.xs,
      color: colors.textPrimary,
      lineHeight: TYPOGRAPHY.LINE_HEIGHT.MD,
    },
    section: {
      padding: spacing.lg,
    },
    sectionTitle: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    label: {
      fontSize: typography.fontSizes.xs,
      color: colors.textTertiary,
      fontWeight: typography.fontWeights.medium,
      textTransform: TEXT_TRANSFORM.UPPERCASE,
      marginBottom: spacing.xxs,
    },
    hierarchyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: radii.md,
      marginBottom: spacing.sm,
      gap: spacing.md,
    },
    hierarchyInfo: {
      flex: FLEX.ONE,
    },
    hierarchyValue: {
      fontSize: typography.fontSizes.sm,
      color: colors.textPrimary,
      fontWeight: typography.fontWeights.semibold,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.lg,
      borderRadius: radii.lg,
      marginBottom: spacing.sm,
      backgroundColor: colors.backgroundSecondary,
    },
    optionActive: {
      backgroundColor: colors.primaryAlpha20,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    optionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    optionText: {
      fontSize: typography.fontSizes.lg,
      color: colors.textSecondary,
    },
    optionTextActive: {
      color: colors.textPrimary,
      fontWeight: typography.fontWeights.semibold,
    },
    clubInactiveLabel: {
      fontSize: typography.fontSizes.xs,
      color: colors.error,
      marginLeft: spacing.sm,
      fontStyle: 'italic',
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
    clear: {
      flex: FLEX.ONE,
      paddingVertical: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: colors.backgroundSecondary,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    clearText: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      color: colors.textSecondary,
    },
    apply: {
      flex: FLEX.ONE,
      paddingVertical: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: colors.primary,
      alignItems: 'center',
    },
    applyText: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      color: colors.textInverse,
    },
  });
