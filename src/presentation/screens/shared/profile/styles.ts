import { StyleSheet } from 'react-native';
import { designTokens, layoutConstants, mobileTypography } from '../../../theme';
import { FLEX } from '../../../../shared/constants';
import { MATH } from '../../../../shared/constants/numbers';

export const profileHeaderStyles = StyleSheet.create({
  headerSection: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.lg,
  },
  profileCard: {
    overflow: layoutConstants.overflow.hidden,
  },
  profileHeader: {
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.xl,
    paddingHorizontal: designTokens.spacing.lg,
  },
  avatarWrapper: {
    marginBottom: designTokens.spacing.md,
  },
  avatarOuter: {
    width: designTokens.avatarSize.xxl,
    height: designTokens.avatarSize.xxl,
    borderRadius: designTokens.avatarSize.xxl / MATH.HALF,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
  },
  avatarInner: {
    width: designTokens.avatarSize.xl,
    height: designTokens.avatarSize.xl,
    borderRadius: designTokens.avatarSize.xl / MATH.HALF,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
  },
  userName: {
    ...mobileTypography.heading2,
    color: designTokens.colors.white,
    marginBottom: designTokens.spacing.xs,
    textAlign: layoutConstants.textAlign.center,
  },
  userEmail: {
    ...mobileTypography.body,
    color: designTokens.overlay.lightStrong,
    marginBottom: designTokens.spacing.md,
    textAlign: layoutConstants.textAlign.center,
  },
  roleBadge: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.overlay.light,
    paddingVertical: designTokens.spacing.xs,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.full,
    gap: designTokens.spacing.xs,
  },
  roleText: {
    ...mobileTypography.captionBold,
    color: designTokens.colors.white,
  },
  statsRow: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    marginTop: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.md,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.overlay.light,
  },
  statItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs,
  },
  statDivider: {
    width: designTokens.borderWidth.thin,
    height: designTokens.spacing.lg,
    backgroundColor: designTokens.overlay.lightStrong,
    marginHorizontal: designTokens.spacing.md,
  },
  statText: {
    ...mobileTypography.caption,
    color: designTokens.overlay.lightStrong,
  },
});

export const accountStatusStyles = StyleSheet.create({
  section: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.md,
  },
  statusContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
  },
  statusInfo: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    flex: FLEX.ONE,
    gap: designTokens.spacing.md,
  },
  statusIconContainer: {
    width: designTokens.touchTarget.comfortable,
    height: designTokens.touchTarget.comfortable,
    borderRadius: designTokens.touchTarget.comfortable / MATH.HALF,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
  },
  statusText: {
    flex: FLEX.ONE,
  },
  statusLabel: {
    ...mobileTypography.bodyLargeBold,
    marginBottom: designTokens.spacing.xxs,
  },
  statusDescription: {
    ...mobileTypography.caption,
  },
});

export const contactInfoStyles = StyleSheet.create({
  section: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.md,
  },
  detailsContainer: {},
  detailRow: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.md,
    borderBottomWidth: designTokens.borderWidth.thin,
    gap: designTokens.spacing.md,
  },
  detailIconContainer: {
    width: designTokens.touchTarget.minimum,
    height: designTokens.touchTarget.minimum,
    borderRadius: designTokens.touchTarget.minimum / MATH.HALF,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
  },
  detailText: {
    flex: FLEX.ONE,
  },
  detailLabel: {
    ...mobileTypography.caption,
    marginBottom: designTokens.spacing.xxs,
    color: designTokens.colors.textSecondary,
  },
  detailValue: {
    ...mobileTypography.bodyLarge,
    color: designTokens.colors.textPrimary,
  },
});

export const preferencesStyles = StyleSheet.create({
  section: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.md,
  },
  settingsContainer: {},
  settingRow: {
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.transparent,
  },
  menuItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.md,
  },
  menuIconContainer: {
    width: designTokens.touchTarget.minimum,
    height: designTokens.touchTarget.minimum,
    borderRadius: designTokens.touchTarget.minimum / MATH.HALF,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
  },
  menuContent: {
    flex: FLEX.ONE,
  },
  menuLabel: {
    ...mobileTypography.caption,
    marginBottom: designTokens.spacing.xxs,
  },
  menuValue: {
    ...mobileTypography.bodyLarge,
  },
});

export const logoutStyles = StyleSheet.create({
  section: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.md,
  },
  logoutButton: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    borderWidth: designTokens.borderWidth.medium,
    gap: designTokens.spacing.sm,
  },
  logoutButtonText: {
    ...mobileTypography.bodyLargeBold,
  },
  versionSection: {
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.xl,
    paddingBottom: designTokens.spacing['3xl'],
  },
  versionText: {
    ...mobileTypography.caption,
  },
});
