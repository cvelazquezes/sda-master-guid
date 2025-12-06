import { StyleSheet } from 'react-native';
import {
  mobileTypography,
  mobileFontSizes,
  designTokens,
  layoutConstants,
} from '../../shared/theme';
import { flexValues } from '../../shared/constants';

export const styles = StyleSheet.create({
  card: {
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
    shadowOffset: { width: 0, height: designTokens.spacing.xxs },
    shadowRadius: designTokens.shadows.md.shadowRadius,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
    minHeight: designTokens.componentSizes.cardMinHeight.md,
  },
  cardInactive: {
    backgroundColor: designTokens.colors.backgroundTertiary,
    opacity: designTokens.opacity.high,
  },
  avatar: {
    width: designTokens.avatarSize.lg,
    height: designTokens.avatarSize.lg,
    borderRadius: designTokens.borderRadius['3xl'],
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    marginRight: designTokens.spacing.md,
    flexShrink: flexValues.shrinkDisabled,
  },
  avatarText: {
    ...mobileTypography.heading3,
    color: designTokens.colors.textInverse,
  },
  avatarTextInactive: {
    color: designTokens.colors.textQuaternary,
  },
  userInfo: {
    flex: flexValues.one,
    marginRight: designTokens.spacing.md,
    minWidth: designTokens.spacing.none,
  },
  userHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.xs,
    gap: designTokens.spacing.sm,
  },
  userName: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.textPrimary,
    flex: flexValues.one,
  },
  textInactive: {
    color: designTokens.colors.textQuaternary,
  },
  roleText: {
    ...mobileTypography.badge,
    fontSize: mobileFontSizes.xs,
  },
  userEmail: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.xs,
  },
  detailsRow: {
    flexDirection: layoutConstants.flexDirection.row,
    flexWrap: layoutConstants.flexWrap.wrap,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
  },
  metaItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs,
  },
  metaText: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs,
    flexShrink: flexValues.shrinkDisabled,
  },
  chevron: {
    flexShrink: flexValues.shrinkDisabled,
  },
  balanceSection: {
    marginTop: designTokens.spacing.sm,
    paddingTop: designTokens.spacing.sm,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
    gap: designTokens.spacing.xs,
  },
  balanceRow: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs + designTokens.spacing.xxs,
  },
  balanceText: {
    ...mobileTypography.labelBold,
  },
  overdueWarning: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs,
    backgroundColor: designTokens.colors.errorLight,
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs + designTokens.spacing.xxs,
    borderRadius: designTokens.borderRadius.sm,
  },
  overdueWarningText: {
    ...mobileTypography.caption,
    color: designTokens.colors.error,
    fontWeight: designTokens.fontWeight.semibold,
  },
});
