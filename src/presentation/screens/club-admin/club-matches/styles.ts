import { StyleSheet } from 'react-native';
import { mobileTypography, designTokens, layoutConstants } from '../../../theme';
import { FLEX } from '../../../../shared/constants';

export const statsStyles = StyleSheet.create({
  container: {
    padding: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.backgroundPrimary,
    marginTop: designTokens.spacing.sm,
  },
  sectionTitle: {
    ...mobileTypography.heading3,
    marginBottom: designTokens.spacing.lg,
  },
  statsGrid: {
    flexDirection: layoutConstants.flexDirection.row,
    gap: designTokens.spacing.md,
    marginBottom: designTokens.spacing.md,
  },
  statCard: {
    flex: FLEX.ONE,
    backgroundColor: designTokens.colors.inputBackground,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    alignItems: layoutConstants.alignItems.center,
  },
  statValue: {
    ...mobileTypography.displaySmall,
    color: designTokens.colors.primary,
    marginBottom: designTokens.spacing.xs,
  },
  statLabel: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
  },
});

export const roundsStyles = StyleSheet.create({
  section: {
    padding: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.backgroundPrimary,
    marginTop: designTokens.spacing.sm,
  },
  sectionTitle: {
    ...mobileTypography.heading3,
    marginBottom: designTokens.spacing.lg,
  },
  roundCard: {
    backgroundColor: designTokens.colors.inputBackground,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
  },
  roundHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.sm,
  },
  roundTitle: {
    ...mobileTypography.bodyLargeBold,
  },
  roundDate: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.xxs,
  },
  roundStatusBadge: {
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.lg,
  },
  roundStatusText: {
    ...mobileTypography.captionBold,
  },
  roundMatches: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
  },
});

export const modalStyles = StyleSheet.create({
  modalContent: {
    padding: designTokens.spacing.xl,
  },
  modalSection: {
    marginBottom: designTokens.spacing.xxl,
  },
  modalSectionTitle: {
    ...mobileTypography.heading4,
    marginBottom: designTokens.spacing.md,
  },
  statusBadge: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    gap: designTokens.spacing.sm,
  },
  statusText: {
    ...mobileTypography.bodyLargeBold,
  },
  participantRow: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.md,
    backgroundColor: designTokens.colors.inputBackground,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.sm,
    gap: designTokens.spacing.md,
  },
  participantAvatar: {
    width: designTokens.componentSizes.iconContainer.lg,
    height: designTokens.componentSizes.iconContainer.lg,
    borderRadius: designTokens.borderRadius['3xl'],
    backgroundColor: designTokens.colors.primary,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  participantAvatarText: {
    ...mobileTypography.heading3,
    color: designTokens.colors.textInverse,
  },
  participantInfo: {
    flex: FLEX.ONE,
  },
  participantName: {
    ...mobileTypography.bodyLargeBold,
  },
  participantEmail: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.xxs,
  },
  participantPhone: {
    ...mobileTypography.caption,
    color: designTokens.colors.success,
    marginTop: designTokens.spacing.xxs,
  },
});

export const filterStyles = StyleSheet.create({
  filterContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    gap: designTokens.spacing.sm,
  },
  filterButton: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.full,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  filterButtonActive: {
    backgroundColor: designTokens.colors.primary,
  },
  filterButtonText: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
  },
  filterButtonTextActive: {
    color: designTokens.colors.textInverse,
  },
});

export const matchListStyles = StyleSheet.create({
  listContainer: {
    padding: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.sm,
  },
  matchCard: {
    backgroundColor: designTokens.colors.inputBackground,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
  },
  matchHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.sm,
  },
  matchTitle: {
    ...mobileTypography.bodyLargeBold,
    flex: FLEX.ONE,
  },
  matchBadge: {
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xxs,
    borderRadius: designTokens.borderRadius.md,
  },
  matchBadgeText: {
    ...mobileTypography.captionBold,
  },
  matchParticipants: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
  },
  emptyContainer: {
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.xxl,
  },
  emptyText: {
    ...mobileTypography.body,
    color: designTokens.colors.textTertiary,
  },
});

export const indexStyles = StyleSheet.create({
  container: {
    flex: FLEX.ONE,
  },
  scrollContent: {
    paddingBottom: designTokens.spacing.xxl,
  },
  header: {
    padding: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.backgroundPrimary,
  },
  headerTitle: {
    ...mobileTypography.heading2,
  },
  headerSubtitle: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.xxs,
  },
});
