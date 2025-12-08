/**
 * Club Fees Screen Styles
 * Theme-aware style factories
 */
import { StyleSheet } from 'react-native';
import { FLEX, SHADOW_OFFSET } from '../../../../shared/constants';
import { MATH } from '../../../../shared/constants/numbers';
import type { ThemeContextType } from '../../../state/ThemeContext';

// ============================================================================
// MAIN STYLES FACTORY
// ============================================================================

export const createStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    container: { flex: FLEX.ONE, backgroundColor: colors.backgroundSecondary },
    loadingContainer: {
      flex: FLEX.ONE,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
    },
    loadingText: {
      marginTop: spacing.lg,
      fontSize: typography.fontSizes.lg,
      color: colors.textSecondary,
    },
    tabContent: { flex: FLEX.ONE },
    section: { padding: spacing.lg },
  });

// ============================================================================
// TAB STYLES FACTORY
// ============================================================================

export const createTabStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    tabs: {
      flexDirection: 'row',
      backgroundColor: colors.backgroundPrimary,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
      elevation: 2,
      shadowColor: colors.textPrimary,
      shadowOffset: SHADOW_OFFSET.MD,
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    tab: {
      flex: FLEX.ONE,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.lg,
      gap: spacing.sm,
      borderBottomWidth: 3,
      borderBottomColor: 'transparent',
    },
    tabActive: { borderBottomColor: colors.primary },
    tabText: {
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
      fontWeight: typography.fontWeights.medium,
    },
    tabTextActive: {
      color: colors.textPrimary,
      fontWeight: typography.fontWeights.semibold,
    },
  });

// ============================================================================
// SETTINGS STYLES FACTORY
// ============================================================================

export const createSettingsStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    infoCard: {
      flexDirection: 'row',
      backgroundColor: colors.primaryAlpha20,
      borderRadius: radii.lg,
      padding: spacing.lg,
      marginBottom: spacing.xl,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    infoIconContainer: { marginRight: spacing.md, marginTop: spacing.xxs },
    infoTextContainer: { flex: FLEX.ONE },
    infoTitle: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.semibold,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    infoText: {
      fontSize: typography.fontSizes.xs,
      color: colors.textPrimary,
      lineHeight: spacing.lg + spacing.xxs,
    },
    settingCard: {
      backgroundColor: colors.backgroundPrimary,
      borderRadius: radii.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    settingLabelContainer: { flex: FLEX.ONE, marginRight: spacing.lg },
    settingLabel: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    settingSubtext: { fontSize: typography.fontSizes.xs, color: colors.textSecondary },
    inputCard: {
      backgroundColor: colors.backgroundPrimary,
      borderRadius: radii.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    inputLabel: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.semibold,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    inputSubtext: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
      marginBottom: spacing.md,
    },
    amountRow: { flexDirection: 'row', gap: spacing.md },
    amountInputWrapper: { flex: FLEX.ONE },
    currencyInputWrapper: { width: spacing['8xl'] + spacing.xs },
    amountInputContainer: {
      flex: FLEX.ONE,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.borderLight,
      borderRadius: radii.lg,
      paddingHorizontal: spacing.lg,
    },
    currencySymbol: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.semibold,
      color: colors.primary,
      marginRight: spacing.sm,
    },
    amountInput: {
      flex: FLEX.ONE,
      padding: spacing.md + spacing.xxs,
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      color: colors.textPrimary,
    },
    currencyInputContainer: {
      width: spacing['8xl'] + spacing.xs,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.borderLight,
      borderRadius: radii.lg,
    },
    currencyInput: {
      padding: spacing.md + spacing.xxs,
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    monthHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.lg,
    },
    monthActions: { flexDirection: 'row', gap: spacing.md },
    monthActionBtn: {
      paddingVertical: spacing.xs + spacing.xxs,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.borderLight,
      borderRadius: radii.sm,
    },
    monthActionText: {
      fontSize: typography.fontSizes.xs,
      color: colors.primary,
      fontWeight: typography.fontWeights.semibold,
    },
    monthGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm + spacing.xxs,
    },
    monthChip: {
      paddingVertical: spacing.sm + spacing.xxs,
      paddingHorizontal: spacing.lg + spacing.xxs,
      borderRadius: radii.md,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 2,
      borderColor: colors.borderLight,
      minWidth: spacing['6xl'] + spacing.xs,
      alignItems: 'center',
    },
    monthChipSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    monthChipText: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
      fontWeight: typography.fontWeights.medium,
    },
    monthChipTextSelected: {
      color: colors.white,
      fontWeight: typography.fontWeights.semibold,
    },
    actionButtonsContainer: {
      gap: spacing.md,
      marginTop: spacing.sm,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.lg,
      borderRadius: radii.lg,
      gap: spacing.sm + spacing.xxs,
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    primaryButtonText: {
      color: colors.white,
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
    },
    secondaryButton: {
      backgroundColor: colors.backgroundPrimary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.lg,
      borderRadius: radii.lg,
      gap: spacing.sm + spacing.xxs,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    secondaryButtonText: {
      color: colors.primary,
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
    },
  });

// ============================================================================
// BALANCE STYLES FACTORY
// ============================================================================

export const createBalanceStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) => {
  const touchTargetMinimum = 40;

  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.lg,
      backgroundColor: colors.backgroundPrimary,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    title: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
      marginTop: spacing.xxs,
    },
    notifyAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingVertical: spacing.sm + spacing.xxs,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.md,
      gap: spacing.sm,
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    notifyAllButtonText: {
      color: colors.white,
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.semibold,
    },
    listContainer: { padding: spacing.lg },
    card: {
      backgroundColor: colors.backgroundPrimary,
      borderRadius: radii.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    memberInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      flex: FLEX.ONE,
    },
    avatar: {
      width: touchTargetMinimum,
      height: touchTargetMinimum,
      borderRadius: touchTargetMinimum / MATH.HALF,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      color: colors.white,
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold,
    },
    memberTextInfo: { flex: FLEX.ONE },
    name: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      color: colors.textPrimary,
      marginBottom: spacing.xxs,
    },
    email: { fontSize: typography.fontSizes.xs, color: colors.textSecondary },
    notifyButton: { padding: spacing.sm },
    details: { gap: spacing.sm + spacing.xxs },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: { fontSize: typography.fontSizes.sm, color: colors.textSecondary },
    value: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.semibold,
      color: colors.textPrimary,
    },
    totalRow: {
      marginTop: spacing.sm,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },
    totalLabel: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
    },
    totalValue: { fontSize: typography.fontSizes.xl, fontWeight: typography.fontWeights.bold },
    overdueNotice: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.errorLight,
      padding: spacing.sm + spacing.xxs,
      borderRadius: radii.md,
      gap: spacing.sm,
      marginTop: spacing.sm,
      borderLeftWidth: 3,
      borderLeftColor: colors.error,
    },
    overdueText: {
      fontSize: typography.fontSizes.xs,
      color: colors.error,
      fontWeight: typography.fontWeights.semibold,
    },
  });
};

// ============================================================================
// CHARGE STYLES FACTORY
// ============================================================================

export const createChargeStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.lg,
      backgroundColor: colors.backgroundPrimary,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    title: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
      marginTop: spacing.xxs,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingVertical: spacing.sm + spacing.xxs,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.md,
      gap: spacing.xs + spacing.xxs,
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    addButtonText: {
      color: colors.white,
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.semibold,
    },
    card: {
      backgroundColor: colors.backgroundPrimary,
      borderRadius: radii.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
    },
    description: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      color: colors.textPrimary,
      flex: FLEX.ONE,
      marginRight: spacing.md,
    },
    amount: {
      fontSize: typography.fontSizes['2xl'],
      fontWeight: typography.fontWeights.bold,
      color: colors.primary,
    },
    details: { gap: spacing.sm },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    detailText: { fontSize: typography.fontSizes.sm, color: colors.textSecondary },
  });

// ============================================================================
// EMPTY STYLES FACTORY
// ============================================================================

export const createEmptyStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    container: {
      flex: FLEX.ONE,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing['6xl'],
      paddingHorizontal: spacing['4xl'],
    },
    text: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      color: colors.textTertiary,
      marginTop: spacing.lg,
      textAlign: 'center',
    },
    subtext: {
      fontSize: typography.fontSizes.sm,
      color: colors.borderLight,
      marginTop: spacing.sm,
      textAlign: 'center',
      lineHeight: spacing.xl,
    },
  });
