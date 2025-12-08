/**
 * My Fees Screen Styles
 * Theme-aware style factories
 */
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ThemeContextType } from '../../../state/ThemeContext';
import { BORDERS, DIMENSIONS, FLEX } from '../../../../shared/constants';

// ============================================================================
// MAIN STYLES FACTORY
// ============================================================================

export const createStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    container: { flex: FLEX.ONE, backgroundColor: colors.background },
    balanceCardContainer: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.lg,
    },
    balanceCard: { borderRadius: radii.xl, padding: spacing.lg },
    balanceMain: {
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    balanceLabel: {
      fontSize: typography.fontSizes.sm,
      marginBottom: spacing.sm,
      color: colors.textSecondary,
    },
    balanceAmount: {
      fontSize: typography.fontSizes['5xl'],
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      marginBottom: spacing.md,
      color: colors.textPrimary,
    },
    balanceTag: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radii.full,
      gap: spacing.xs,
    },
    balanceTagText: {
      fontSize: typography.fontSizes.xs,
      fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
    },
    quickStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },
    quickStat: { alignItems: 'center' },
    quickStatValue: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.textPrimary,
    },
    quickStatLabel: {
      fontSize: typography.fontSizes.xs,
      marginTop: spacing.xs,
      color: colors.textSecondary,
    },
    quickStatDivider: {
      width: BORDERS.WIDTH.THIN,
      height: DIMENSIONS.HEIGHT.DIVIDER,
      backgroundColor: colors.borderLight,
    },
    content: { flex: FLEX.ONE, padding: spacing.lg },
    card: {
      borderRadius: radii.xl,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      backgroundColor: colors.backgroundPrimary,
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
    cardTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    cardTitle: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.textPrimary,
    },
    cardSubtitle: {
      fontSize: typography.fontSizes.sm,
      marginTop: spacing.xs,
      color: colors.textSecondary,
    },
    seeAllLink: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
      color: colors.primary,
    },
    progressContainer: { marginBottom: spacing.lg },
    progressBar: {
      height: DIMENSIONS.PROGRESS_BAR.STANDARD,
      borderRadius: radii.full,
      overflow: 'hidden',
      marginBottom: spacing.sm,
      backgroundColor: colors.backgroundSecondary,
    },
    progressFill: {
      height: '100%',
      borderRadius: radii.full,
    },
    progressText: {
      fontSize: typography.fontSizes.xs,
      textAlign: 'right',
      color: colors.textSecondary,
    },
    summaryGrid: { flexDirection: 'row', gap: spacing.md },
    summaryItem: {
      flex: FLEX.ONE,
      alignItems: 'center',
      padding: spacing.lg,
      borderRadius: radii.lg,
      backgroundColor: colors.backgroundSecondary,
    },
    summaryValue: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      marginTop: spacing.sm,
      color: colors.textPrimary,
    },
    summaryLabel: {
      fontSize: typography.fontSizes.xs,
      marginTop: spacing.xs,
      color: colors.textSecondary,
    },
    infoCard: { borderWidth: 0 },
    infoCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.lg,
    },
    infoIconContainer: {
      width: DIMENSIONS.SIZE.AVATAR_MEDIUM,
      height: DIMENSIONS.SIZE.AVATAR_MEDIUM,
      borderRadius: radii.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    infoTextContainer: { flex: FLEX.ONE },
    infoTitle: {
      fontSize: typography.fontSizes.sm,
      marginBottom: spacing.xs,
      color: colors.textSecondary,
    },
    infoAmount: {
      fontSize: typography.fontSizes['2xl'],
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.textPrimary,
    },
    infoSubtext: {
      fontSize: typography.fontSizes.xs,
      marginTop: spacing.xxs,
      color: colors.textTertiary,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: spacing['4xl'],
    },
    emptyStateTitle: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
      marginTop: spacing.lg,
      color: colors.textPrimary,
    },
    emptyStateText: {
      fontSize: typography.fontSizes.sm,
      marginTop: spacing.sm,
      textAlign: 'center',
      color: colors.textSecondary,
    },
    helpCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
      borderRadius: radii.lg,
      gap: spacing.md,
      backgroundColor: colors.infoAlpha20,
    },
    helpContent: { flex: FLEX.ONE },
    helpTitle: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
      marginBottom: spacing.xs,
      color: colors.textPrimary,
    },
    helpText: {
      fontSize: typography.fontSizes.xs,
      color: colors.textPrimary,
    },
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
    tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    tab: {
      flex: FLEX.ONE,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      gap: spacing.sm,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    tabActive: {
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
      color: colors.textSecondary,
    },
    tabTextActive: {
      color: colors.textPrimary,
    },
  });

// ============================================================================
// ITEM STYLES FACTORY
// ============================================================================

export const createItemStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    activityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    activityIcon: {
      width: DIMENSIONS.SIZE.TOUCH_TARGET,
      height: DIMENSIONS.SIZE.TOUCH_TARGET,
      borderRadius: radii.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    activityInfo: { flex: FLEX.ONE },
    activityTitle: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
      marginBottom: spacing.xs,
      color: colors.textPrimary,
    },
    activityDate: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
    },
    activityAmount: { alignItems: 'flex-end' },
    activityPrice: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      marginBottom: spacing.xs,
      color: colors.textPrimary,
    },
    activityBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radii.sm,
    },
    activityBadgeText: {
      fontSize: typography.fontSizes['2xs'],
      fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
    },
    emptyActivity: {
      alignItems: 'center',
      paddingVertical: spacing['3xl'],
    },
    emptyActivityText: {
      fontSize: typography.fontSizes.sm,
      marginTop: spacing.md,
      color: colors.textSecondary,
    },
    historyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.lg,
      gap: spacing.md,
    },
    historyIcon: {
      width: 48,
      height: 48,
      borderRadius: radii.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    historyInfo: { flex: FLEX.ONE },
    historyTitle: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
      marginBottom: spacing.xs,
      color: colors.textPrimary,
    },
    historyMeta: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
    },
    historyPaid: {
      fontSize: typography.fontSizes.xs,
      marginTop: spacing.xs,
      fontWeight: typography.fontWeights.medium as TextStyle['fontWeight'],
      color: colors.success,
    },
    historyRight: { alignItems: 'flex-end' },
    historyAmount: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      marginBottom: spacing.sm,
      color: colors.textPrimary,
    },
    historyBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radii.sm,
    },
    historyBadgeText: {
      fontSize: typography.fontSizes['2xs'],
      fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
    },
    chargeItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.lg,
      gap: spacing.md,
    },
    chargeIcon: {
      width: 48,
      height: 48,
      borderRadius: radii.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    chargeInfo: { flex: FLEX.ONE },
    chargeTitle: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
      marginBottom: spacing.xs,
      color: colors.textPrimary,
    },
    chargeMeta: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
    },
    chargeAmount: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.textPrimary,
    },
  });

// ============================================================================
// LOADING STYLES FACTORY
// ============================================================================

export const createLoadingStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
) =>
  StyleSheet.create({
    skeletonHeader: {
      alignItems: 'center',
      paddingVertical: spacing['4xl'],
    },
    skeletonContent: { padding: spacing.lg },
    skeleton: {
      borderRadius: radii.md,
      backgroundColor: colors.backgroundSecondary,
    },
    skeletonTitle: {
      width: DIMENSIONS.SKELETON.TITLE_WIDTH,
      height: DIMENSIONS.SKELETON.TITLE_HEIGHT,
      marginBottom: spacing.sm,
    },
    skeletonSubtitle: {
      width: DIMENSIONS.SKELETON.SUBTITLE_WIDTH,
      height: DIMENSIONS.SKELETON.SUBTITLE_HEIGHT,
    },
    skeletonCard: {
      height: DIMENSIONS.SIZE.ICON_CONTAINER_LARGE,
      marginBottom: spacing.lg,
      borderRadius: radii.xl,
    },
    emptyHeader: {
      alignItems: 'center',
      paddingVertical: spacing['5xl'],
    },
    emptyHeaderTitle: {
      fontSize: typography.fontSizes['2xl'],
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      marginTop: spacing.lg,
      color: colors.textPrimary,
    },
    emptyHeaderSubtitle: {
      fontSize: typography.fontSizes.md,
      marginTop: spacing.sm,
      textAlign: 'center',
      color: colors.textSecondary,
    },
  });
