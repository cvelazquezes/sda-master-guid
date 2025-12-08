/**
 * Clubs Management Screen Styles
 * Theme-aware style factories
 */
import { StyleSheet } from 'react-native';
import { BORDERS, DIMENSIONS, FLEX, TEXT_TRANSFORM, TYPOGRAPHY } from '../../../../shared/constants';
import type { ThemeContextType } from '../../../state/ThemeContext';

// ============================================================================
// MAIN STYLES FACTORY
// ============================================================================

export const createStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing']
) =>
  StyleSheet.create({
    container: { flex: FLEX.ONE, backgroundColor: colors.backgroundSecondary },
    content: { padding: spacing.lg },
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
    body: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
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
    closeButton: { padding: spacing.xs },
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
      marginHorizontal: spacing.lg,
      marginTop: spacing.lg,
      marginBottom: spacing.none,
      gap: spacing.sm,
    },
    infoText: {
      flex: FLEX.ONE,
      fontSize: typography.fontSizes.xs,
      color: colors.textPrimary,
      lineHeight: TYPOGRAPHY.LINE_HEIGHT.MD,
    },
    section: { padding: spacing.lg },
    sectionTitle: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    label: {
      fontSize: typography.fontSizes.xs,
      color: colors.textTertiary,
      fontWeight: typography.fontWeights.semibold,
      textTransform: TEXT_TRANSFORM.UPPERCASE,
      letterSpacing: TYPOGRAPHY.LETTER_SPACING.NORMAL,
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },
    hierarchyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: radii.md,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
      gap: spacing.md,
    },
    hierarchyInfo: { flex: FLEX.ONE },
    hierarchyValue: {
      fontSize: typography.fontSizes.sm,
      color: colors.textPrimary,
      fontWeight: typography.fontWeights.semibold,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: radii.lg,
      marginBottom: spacing.sm,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 2,
      borderColor: 'transparent',
      minHeight: DIMENSIONS.MIN_HEIGHT.FILTER_OPTION,
    },
    optionActive: {
      backgroundColor: colors.primaryAlpha20,
      borderColor: colors.primary,
    },
    optionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: FLEX.ONE,
      gap: spacing.md,
    },
    optionText: {
      fontSize: typography.fontSizes.md,
      color: colors.textSecondary,
      flex: FLEX.ONE,
    },
    optionTextActive: {
      color: colors.textPrimary,
      fontWeight: typography.fontWeights.semibold,
    },
    optionSubtitle: {
      fontSize: typography.fontSizes.xs,
      color: colors.textTertiary,
      marginTop: spacing.xxs,
    },
    noDataText: {
      fontSize: typography.fontSizes.sm,
      color: colors.textTertiary,
      fontStyle: 'italic',
      textAlign: 'center',
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: radii.md,
      marginTop: spacing.md,
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
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    applyText: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      color: colors.textInverse,
    },
  });
