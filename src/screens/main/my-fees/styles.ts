import { StyleSheet } from 'react-native';
import { mobileFontSizes, designTokens, layoutConstants } from '../../../shared/theme';
import { BORDERS, DIMENSIONS, FLEX } from '../../../shared/constants';

export const styles = StyleSheet.create({
  container: { flex: FLEX.ONE },
  headerGradient: {
    paddingTop: designTokens.spacing['6xl'],
    paddingBottom: designTokens.spacing.xxl,
    paddingHorizontal: designTokens.spacing.lg,
  },
  headerContent: {},
  headerTop: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.flexStart,
    marginBottom: designTokens.spacing.xxl,
  },
  headerClubName: { fontSize: mobileFontSizes.sm, marginBottom: designTokens.spacing.xs },
  headerTitle: { fontSize: mobileFontSizes['3xl'], fontWeight: designTokens.fontWeight.bold },
  headerAction: {
    width: DIMENSIONS.SIZE.TOUCH_TARGET,
    height: DIMENSIONS.SIZE.TOUCH_TARGET,
    borderRadius: designTokens.borderRadius['4xl'],
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  balanceCard: { borderRadius: designTokens.borderRadius.xl, padding: designTokens.spacing.lg },
  balanceMain: {
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.lg,
  },
  balanceLabel: { fontSize: mobileFontSizes.sm, marginBottom: designTokens.spacing.sm },
  balanceAmount: {
    fontSize: designTokens.fontSize['5xl'],
    fontWeight: designTokens.fontWeight.bold,
    marginBottom: designTokens.spacing.md,
  },
  balanceTag: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.full,
    gap: designTokens.spacing.xs,
  },
  balanceTagText: {
    fontSize: mobileFontSizes.xs,
    fontWeight: designTokens.fontWeight.semibold,
  },
  quickStats: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceAround,
    paddingTop: designTokens.spacing.lg,
    borderTopWidth: designTokens.borderWidth.thin,
  },
  quickStat: { alignItems: layoutConstants.alignItems.center },
  quickStatValue: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.bold,
  },
  quickStatLabel: { fontSize: mobileFontSizes.xs, marginTop: designTokens.spacing.xs },
  quickStatDivider: { width: BORDERS.WIDTH.THIN, height: DIMENSIONS.HEIGHT.DIVIDER },
  content: { flex: FLEX.ONE, padding: designTokens.spacing.lg },
  card: {
    borderRadius: designTokens.borderRadius.xl,
    padding: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.lg,
    ...designTokens.shadows.sm,
  },
  cardHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.lg,
  },
  cardTitleRow: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
  },
  cardTitle: { fontSize: mobileFontSizes.lg, fontWeight: designTokens.fontWeight.bold },
  cardSubtitle: { fontSize: mobileFontSizes.sm, marginTop: designTokens.spacing.xs },
  seeAllLink: { fontSize: mobileFontSizes.sm, fontWeight: designTokens.fontWeight.semibold },
  progressContainer: { marginBottom: designTokens.spacing.lg },
  progressBar: {
    height: DIMENSIONS.PROGRESS_BAR.STANDARD,
    borderRadius: designTokens.borderRadius.full,
    overflow: layoutConstants.overflow.hidden,
    marginBottom: designTokens.spacing.sm,
  },
  progressFill: {
    height: DIMENSIONS.MAX_HEIGHT_PERCENT.FULL,
    borderRadius: designTokens.borderRadius.full,
  },
  progressText: { fontSize: mobileFontSizes.xs, textAlign: layoutConstants.textAlign.right },
  summaryGrid: { flexDirection: layoutConstants.flexDirection.row, gap: designTokens.spacing.md },
  summaryItem: {
    flex: FLEX.ONE,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
  },
  summaryValue: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.bold,
    marginTop: designTokens.spacing.sm,
  },
  summaryLabel: { fontSize: mobileFontSizes.xs, marginTop: designTokens.spacing.xs },
  infoCard: { borderWidth: designTokens.borderWidth.none },
  infoCardContent: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.lg,
  },
  infoIconContainer: {
    width: DIMENSIONS.SIZE.AVATAR_MEDIUM,
    height: DIMENSIONS.SIZE.AVATAR_MEDIUM,
    borderRadius: designTokens.borderRadius.lg,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  infoTextContainer: { flex: FLEX.ONE },
  infoTitle: { fontSize: mobileFontSizes.sm, marginBottom: designTokens.spacing.xs },
  infoAmount: { fontSize: mobileFontSizes['2xl'], fontWeight: designTokens.fontWeight.bold },
  infoSubtext: { fontSize: mobileFontSizes.xs, marginTop: designTokens.spacing.xxs },
  emptyState: {
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing['4xl'],
  },
  emptyStateTitle: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    marginTop: designTokens.spacing.lg,
  },
  emptyStateText: {
    fontSize: mobileFontSizes.sm,
    marginTop: designTokens.spacing.sm,
    textAlign: layoutConstants.textAlign.center,
  },
  helpCard: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    gap: designTokens.spacing.md,
  },
  helpContent: { flex: FLEX.ONE },
  helpTitle: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    marginBottom: designTokens.spacing.xs,
  },
  helpText: { fontSize: mobileFontSizes.xs },
});

export const tabStyles = StyleSheet.create({
  tabContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    paddingHorizontal: designTokens.spacing.lg,
    borderBottomWidth: designTokens.borderWidth.thin,
  },
  tab: {
    flex: FLEX.ONE,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    paddingVertical: designTokens.spacing.md,
    gap: designTokens.spacing.sm,
    borderBottomWidth: designTokens.borderWidth.medium,
    borderBottomColor: BORDERS.COLOR.TRANSPARENT,
  },
  tabActive: { borderBottomWidth: designTokens.borderWidth.medium },
  tabText: { fontSize: mobileFontSizes.sm, fontWeight: designTokens.fontWeight.semibold },
});

export const itemStyles = StyleSheet.create({
  activityItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.md,
    gap: designTokens.spacing.md,
  },
  activityIcon: {
    width: DIMENSIONS.SIZE.TOUCH_TARGET,
    height: DIMENSIONS.SIZE.TOUCH_TARGET,
    borderRadius: designTokens.borderRadius.lg,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  activityInfo: { flex: FLEX.ONE },
  activityTitle: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    marginBottom: designTokens.spacing.xs,
  },
  activityDate: { fontSize: mobileFontSizes.xs },
  activityAmount: { alignItems: layoutConstants.alignItems.flexEnd },
  activityPrice: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.bold,
    marginBottom: designTokens.spacing.xs,
  },
  activityBadge: {
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.sm,
  },
  activityBadgeText: {
    fontSize: designTokens.fontSize['2xs'],
    fontWeight: designTokens.fontWeight.semibold,
  },
  emptyActivity: {
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing['3xl'],
  },
  emptyActivityText: { fontSize: mobileFontSizes.sm, marginTop: designTokens.spacing.md },
  historyItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
  },
  historyIcon: {
    width: designTokens.componentSizes.iconContainer.lg,
    height: designTokens.componentSizes.iconContainer.lg,
    borderRadius: designTokens.borderRadius.lg,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  historyInfo: { flex: FLEX.ONE },
  historyTitle: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    marginBottom: designTokens.spacing.xs,
  },
  historyMeta: { fontSize: mobileFontSizes.xs },
  historyPaid: {
    fontSize: mobileFontSizes.xs,
    marginTop: designTokens.spacing.xs,
    fontWeight: designTokens.fontWeight.medium,
  },
  historyRight: { alignItems: layoutConstants.alignItems.flexEnd },
  historyAmount: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.bold,
    marginBottom: designTokens.spacing.sm,
  },
  historyBadge: {
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.sm,
  },
  historyBadgeText: {
    fontSize: designTokens.fontSize['2xs'],
    fontWeight: designTokens.fontWeight.semibold,
  },
  chargeItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
  },
  chargeIcon: {
    width: designTokens.componentSizes.iconContainer.lg,
    height: designTokens.componentSizes.iconContainer.lg,
    borderRadius: designTokens.borderRadius.lg,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  chargeInfo: { flex: FLEX.ONE },
  chargeTitle: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    marginBottom: designTokens.spacing.xs,
  },
  chargeMeta: { fontSize: mobileFontSizes.xs },
  chargeAmount: {
    fontSize: mobileFontSizes.xl,
    fontWeight: designTokens.fontWeight.bold,
  },
});

export const loadingStyles = StyleSheet.create({
  skeletonHeader: {
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing['4xl'],
  },
  skeletonContent: { padding: designTokens.spacing.lg },
  skeleton: { borderRadius: designTokens.borderRadius.md },
  skeletonTitle: {
    width: DIMENSIONS.SKELETON.TITLE_WIDTH,
    height: DIMENSIONS.SKELETON.TITLE_HEIGHT,
    marginBottom: designTokens.spacing.sm,
  },
  skeletonSubtitle: {
    width: DIMENSIONS.SKELETON.SUBTITLE_WIDTH,
    height: DIMENSIONS.SKELETON.SUBTITLE_HEIGHT,
  },
  skeletonCard: {
    height: DIMENSIONS.SIZE.ICON_CONTAINER_LARGE,
    marginBottom: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.xl,
  },
  emptyHeader: {
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing['5xl'],
  },
  emptyHeaderTitle: {
    fontSize: mobileFontSizes['2xl'],
    fontWeight: designTokens.fontWeight.bold,
    marginTop: designTokens.spacing.lg,
  },
  emptyHeaderSubtitle: {
    fontSize: mobileFontSizes.md,
    marginTop: designTokens.spacing.sm,
    textAlign: layoutConstants.textAlign.center,
  },
});
