import { StyleSheet } from 'react-native';
import { mobileTypography, designTokens, layoutConstants } from '../../shared/theme';
import { flexValues } from '../../shared/constants';

export const styles = StyleSheet.create({
  card: {
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
    shadowColor: designTokens.colors.black,
    shadowOffset: { width: 0, height: designTokens.spacing.xxs },
    shadowRadius: designTokens.shadows.md.shadowRadius,
    elevation: designTokens.shadows.md.elevation,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
    minHeight: designTokens.componentSizes.cardMinHeight.md,
  },
  icon: {
    width: designTokens.componentSizes.iconContainer.lg,
    height: designTokens.componentSizes.iconContainer.lg,
    borderRadius: designTokens.borderRadius['3xl'],
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    marginRight: designTokens.spacing.md,
    flexShrink: flexValues.shrinkDisabled,
  },
  clubInfo: {
    flex: flexValues.one,
    marginRight: designTokens.spacing.md,
    minWidth: designTokens.spacing.none,
  },
  clubHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.xs,
    gap: designTokens.spacing.sm,
  },
  clubName: {
    ...mobileTypography.bodyMediumBold,
    flex: flexValues.one,
  },
  clubDescription: {
    ...mobileTypography.bodySmall,
    marginBottom: designTokens.spacing.xs,
  },
  hierarchyContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    flexWrap: layoutConstants.flexWrap.wrap,
    gap: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.xs,
  },
  hierarchyItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs,
  },
  hierarchyText: {
    ...mobileTypography.caption,
  },
  clubDetails: {
    flexDirection: layoutConstants.flexDirection.row,
    flexWrap: layoutConstants.flexWrap.wrap,
    gap: designTokens.spacing.sm,
  },
  detailItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs,
  },
  detailText: {
    ...mobileTypography.caption,
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
});
