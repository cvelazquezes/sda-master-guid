/**
 * Organization Management Screen Styles
 * Theme-aware style factories
 */
import { StyleSheet } from 'react-native';
import { FLEX, DIMENSIONS, BORDERS, TEXT_TRANSFORM, TYPOGRAPHY } from '../../../../shared/constants';
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
    typeSelectorContainer: {
      backgroundColor: colors.backgroundPrimary,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    typeSelector: {
      flexDirection: 'row',
      padding: spacing.md,
      gap: spacing.sm,
    },
    typeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: spacing.lg,
      backgroundColor: colors.backgroundSecondary,
      gap: spacing.xs,
      borderWidth: 2,
      borderColor: 'transparent',
      minHeight: DIMENSIONS.MIN_HEIGHT.TOUCH_TARGET,
    },
    typeButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    typeButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    typeButtonTextActive: {
      color: colors.textInverse,
    },
    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
      gap: spacing.md,
      backgroundColor: colors.backgroundPrimary,
    },
    searchContainer: {
      flex: FLEX.ONE,
    },
    createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: spacing.lg,
      gap: spacing.xs,
      minHeight: DIMENSIONS.MIN_HEIGHT.TOUCH_TARGET_STANDARD,
    },
    createButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textInverse,
    },
    content: {
      flex: FLEX.ONE,
      padding: spacing.lg,
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.xl,
    },
  });

// ============================================================================
// CARD STYLES FACTORY
// ============================================================================

export const createCardStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.backgroundPrimary,
      borderRadius: radii.lg,
      padding: spacing.md,
      marginBottom: spacing.sm,
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    title: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: FLEX.ONE,
      gap: spacing.sm,
    },
    info: {
      flex: FLEX.ONE,
    },
    name: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.semibold,
      color: colors.textPrimary,
      marginBottom: spacing.xxs,
    },
    parent: {
      fontSize: typography.fontSizes.xs,
      color: colors.textTertiary,
    },
    deleteButton: {
      padding: spacing.xs,
      borderRadius: radii.md,
      minWidth: DIMENSIONS.MIN_WIDTH.ICON_BUTTON_SMALL,
      minHeight: DIMENSIONS.MIN_HEIGHT.ICON_BUTTON_SMALL,
      alignItems: 'center',
      justifyContent: 'center',
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },
    clubCount: {
      fontSize: typography.fontSizes.xs,
      color: colors.textTertiary,
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
    handle: {
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
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
    },
    closeButton: {
      padding: spacing.xs,
    },
    body: {
      maxHeight: DIMENSIONS.MAX_HEIGHT.MODAL_BODY_MEDIUM,
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
    section: {
      padding: spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    sectionTitle: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.semibold,
      color: colors.textPrimary,
    },
    resultsCount: {
      fontSize: typography.fontSizes.xs,
      color: colors.textTertiary,
      fontWeight: typography.fontWeights.medium,
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
    hierarchyInfo: {
      flex: FLEX.ONE,
    },
    hierarchyLabel: {
      fontSize: typography.fontSizes.xs,
      color: colors.textTertiary,
      fontWeight: typography.fontWeights.semibold,
      textTransform: TEXT_TRANSFORM.UPPERCASE,
      letterSpacing: TYPOGRAPHY.LETTER_SPACING.NORMAL,
      marginBottom: spacing.xxs,
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
    noResultsText: {
      fontSize: typography.fontSizes.sm,
      color: colors.textTertiary,
      textAlign: 'center',
      padding: spacing.lg,
      fontStyle: 'italic',
    },
    warningBanner: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: colors.warningAlpha20,
      padding: spacing.md,
      borderRadius: radii.md,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      gap: spacing.sm,
    },
    warningText: {
      flex: FLEX.ONE,
      fontSize: typography.fontSizes.sm,
      color: colors.textPrimary,
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
    clear: {
      flex: FLEX.ONE,
      paddingVertical: spacing.md,
      borderRadius: radii.lg,
      backgroundColor: colors.backgroundSecondary,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.xs,
      minHeight: DIMENSIONS.MIN_HEIGHT.SELECT_ITEM,
    },
    clearText: {
      fontSize: typography.fontSizes.md,
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
      gap: spacing.xs,
      minHeight: DIMENSIONS.MIN_HEIGHT.SELECT_ITEM,
    },
    applyText: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.semibold,
      color: colors.textInverse,
    },
  });
