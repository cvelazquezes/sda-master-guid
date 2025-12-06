import { StyleSheet } from 'react-native';
import { mobileFontSizes, designTokens, layoutConstants } from '../../shared/theme';
import { dimensionValues } from '../../shared/constants';

export const styles = StyleSheet.create({
  container: {
    borderRadius: designTokens.borderRadius.md,
    overflow: layoutConstants.overflow.hidden,
    borderWidth: designTokens.borderWidth.thin,
  },
  header: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    padding: designTokens.spacing.lg,
  },
  headerLeft: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
  },
  title: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
  },
  content: {
    padding: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
  },
  hierarchyItem: {
    gap: designTokens.spacing.sm,
  },
  levelContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
  },
  levelLabel: {
    fontSize: mobileFontSizes.sm,
    fontWeight: designTokens.fontWeight.semibold,
  },
  levelBadge: {
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xxs,
    borderRadius: designTokens.borderRadius.lg,
  },
  levelBadgeText: {
    fontSize: mobileFontSizes.xs,
    fontWeight: designTokens.fontWeight.semibold,
  },
  hierarchyValue: {
    fontSize: mobileFontSizes.md,
    marginLeft: designTokens.spacing.xxl,
    fontWeight: designTokens.fontWeight.medium,
  },
  compactContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    flexWrap: layoutConstants.flexWrap.wrap,
    gap: designTokens.spacing.sm,
    marginTop: designTokens.spacing.sm,
  },
  compactItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.lg,
    gap: designTokens.spacing.xs,
  },
  compactText: {
    fontSize: mobileFontSizes.xs,
    fontWeight: designTokens.fontWeight.medium,
    maxWidth: dimensionValues.maxWidth.label,
  },
});
