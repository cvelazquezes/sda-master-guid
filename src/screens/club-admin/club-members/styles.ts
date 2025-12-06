import { StyleSheet } from 'react-native';
import {
  mobileTypography,
  mobileFontSizes,
  designTokens,
  layoutConstants,
} from '../../../shared/theme';
import {
  flexValues,
  textTransformValues,
  typographyValues,
  dimensionValues,
} from '../../../shared/constants';

export const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  content: {
    padding: designTokens.spacing.lg,
  },
});

export const pendingCardStyles = StyleSheet.create({
  card: {
    backgroundColor: designTokens.colors.warningLight,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
    ...designTokens.shadows.sm,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
    minHeight: dimensionValues.minHeight.cardContent,
    borderLeftWidth: designTokens.borderWidth.medium,
    borderLeftColor: designTokens.colors.warning,
  },
  avatar: {
    width: designTokens.componentSizes.iconContainer.lg,
    height: designTokens.componentSizes.iconContainer.lg,
    borderRadius: designTokens.borderRadius['3xl'],
    backgroundColor: designTokens.colors.warningLight,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    marginRight: designTokens.spacing.md,
    flexShrink: flexValues.shrinkDisabled,
    position: layoutConstants.position.relative,
  },
  avatarText: {
    ...mobileTypography.heading3,
    color: designTokens.colors.warning,
  },
  badge: {
    position: layoutConstants.position.absolute,
    bottom: dimensionValues.offset.badgeNegative,
    right: dimensionValues.offset.badgeNegative,
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.xl,
    width: dimensionValues.size.badgeSmall,
    height: dimensionValues.size.badgeSmall,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    borderWidth: designTokens.borderWidth.medium,
    borderColor: designTokens.colors.warningLight,
  },
  info: {
    flex: flexValues.one,
    marginRight: designTokens.spacing.md,
    minWidth: designTokens.spacing.none,
  },
  header: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.xs,
    gap: designTokens.spacing.sm,
  },
  name: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.textPrimary,
    flex: flexValues.one,
  },
  statusBadge: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xxs,
    backgroundColor: designTokens.colors.warningLight,
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xxs,
    borderRadius: designTokens.borderRadius.sm,
    flexShrink: flexValues.shrinkDisabled,
  },
  statusText: {
    fontSize: mobileFontSizes.xs,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.warning,
    textTransform: textTransformValues.uppercase,
    letterSpacing: typographyValues.letterSpacing.normal,
  },
  email: {
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
  actionsContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
    flexShrink: flexValues.shrinkDisabled,
  },
  rejectButton: {
    backgroundColor: designTokens.colors.error,
  },
  approveButton: {
    backgroundColor: designTokens.colors.success,
  },
});

export const memberCardStyles = StyleSheet.create({
  card: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
    ...designTokens.shadows.sm,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
    minHeight: dimensionValues.minHeight.cardContent,
  },
  cardInactive: {
    backgroundColor: designTokens.colors.backgroundTertiary,
    opacity: designTokens.opacity.high,
  },
  avatar: {
    width: designTokens.componentSizes.iconContainer.lg,
    height: designTokens.componentSizes.iconContainer.lg,
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
  info: {
    flex: flexValues.one,
    marginRight: designTokens.spacing.md,
    minWidth: designTokens.spacing.none,
  },
  header: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.xs,
    gap: designTokens.spacing.sm,
  },
  name: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.textPrimary,
    flex: flexValues.one,
  },
  textInactive: {
    color: designTokens.colors.textQuaternary,
  },
  roleBadge: {
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xxs,
    borderRadius: designTokens.borderRadius.sm,
    backgroundColor: designTokens.colors.infoLight,
    flexShrink: flexValues.shrinkDisabled,
  },
  roleText: {
    fontSize: mobileFontSizes.xs,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textSecondary,
    textTransform: textTransformValues.uppercase,
    letterSpacing: typographyValues.letterSpacing.normal,
  },
  roleTextInactive: {
    color: designTokens.colors.textQuaternary,
  },
  email: {
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
  statusBadge: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xxs,
  },
  statusText: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
    fontWeight: designTokens.fontWeight.medium,
  },
  actionsContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs,
    flexShrink: flexValues.shrinkDisabled,
  },
  balanceRow: {
    marginTop: designTokens.spacing.sm,
    paddingTop: designTokens.spacing.sm,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
  },
  balanceIndicator: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.lg,
    alignSelf: layoutConstants.alignSelf.flexStart,
  },
  balanceText: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.textInverse,
  },
  balanceLabel: {
    fontSize: mobileFontSizes.xs,
    fontWeight: designTokens.fontWeight.bold,
    color: designTokens.colors.textInverse,
    marginLeft: designTokens.spacing.xs,
    textTransform: textTransformValues.uppercase,
    letterSpacing: typographyValues.letterSpacing.normal,
  },
});
