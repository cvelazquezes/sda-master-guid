import { StyleSheet } from 'react-native';
import { mobileTypography, designTokens, layoutConstants } from '../../../shared/theme';
import { FLEX, BORDERS } from '../../../shared/constants';

export const styles = StyleSheet.create({
  container: {
    flex: FLEX.ONE,
  },
  scrollView: {
    flex: FLEX.ONE,
  },
  section: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.sm,
  },
  profileCard: {
    marginBottom: designTokens.spacing.none,
  },
  profileHeader: {
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.md,
  },
  avatarContainer: {
    width: designTokens.avatarSize.xxl,
    height: designTokens.avatarSize.xxl,
    borderRadius: designTokens.borderRadius.full,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    marginBottom: designTokens.spacing.md,
  },
  profileName: {
    ...mobileTypography.heading2,
    marginBottom: designTokens.spacing.xs,
    textAlign: layoutConstants.textAlign.center,
  },
  profileEmail: {
    ...mobileTypography.body,
    marginBottom: designTokens.spacing.sm,
    textAlign: layoutConstants.textAlign.center,
  },
  roleBadge: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.xs,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.full,
    gap: designTokens.spacing.xs,
  },
  roleText: {
    ...mobileTypography.captionBold,
  },
  settingRow: {
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: BORDERS.COLOR.TRANSPARENT,
  },
  detailsContainer: {},
  detailRow: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.md,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: BORDERS.COLOR.TRANSPARENT,
    gap: designTokens.spacing.md,
  },
  detailIconContainer: {
    width: designTokens.avatarSize.md,
    height: designTokens.avatarSize.md,
    borderRadius: designTokens.borderRadius.full,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
  },
  detailText: {
    flex: FLEX.ONE,
  },
  detailLabel: {
    ...mobileTypography.caption,
    marginBottom: designTokens.spacing.xxs,
  },
  detailValue: {
    ...mobileTypography.bodyLarge,
  },
  classesContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    flexWrap: layoutConstants.flexWrap.wrap,
    gap: designTokens.spacing.xs,
    marginTop: designTokens.spacing.xs,
  },
  classBadge: {
    paddingVertical: designTokens.spacing.xs,
    paddingHorizontal: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.md,
  },
  classBadgeText: {
    ...mobileTypography.caption,
    fontWeight: designTokens.fontWeight.semibold,
  },
  bottomSpacer: {
    height: designTokens.spacing['3xl'],
  },
});

export const statusStyles = StyleSheet.create({
  container: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
  },
  info: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    flex: FLEX.ONE,
    gap: designTokens.spacing.md,
  },
  iconContainer: {
    width: designTokens.touchTarget.comfortable,
    height: designTokens.touchTarget.comfortable,
    borderRadius: designTokens.borderRadius.full,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
  },
  text: {
    flex: FLEX.ONE,
  },
  label: {
    ...mobileTypography.bodyLargeBold,
    marginBottom: designTokens.spacing.xxs,
  },
  description: {
    ...mobileTypography.caption,
  },
});

export const logoutStyles = StyleSheet.create({
  button: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    borderWidth: designTokens.borderWidth.medium,
    gap: designTokens.spacing.sm,
  },
  buttonText: {
    ...mobileTypography.bodyLargeBold,
  },
});
