import { StyleSheet } from 'react-native';
import { mobileFontSizes, designTokens, layoutConstants } from '../../shared/theme';
import { flexValues } from '../../shared/constants';

// Note: Colors should be applied dynamically via useTheme() in the component
// This file only contains layout-related styles
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
    // backgroundColor applied dynamically via useTheme
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
    // Typography handled by Text primitive variant
  },
  avatarTextInactive: {
    // Color handled dynamically via useTheme
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
    flex: flexValues.one,
  },
  textInactive: {
    // Color handled dynamically via useTheme
  },
  roleText: {
    fontSize: mobileFontSizes.xs,
  },
  userEmail: {
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
    // Typography and color handled by Text primitive
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
    // borderTopColor applied dynamically via useTheme
    gap: designTokens.spacing.xs,
  },
  balanceRow: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs + designTokens.spacing.xxs,
  },
  balanceText: {
    // Typography handled by Text primitive variant
  },
  overdueWarning: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs,
    // backgroundColor applied dynamically via useTheme
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs + designTokens.spacing.xxs,
    borderRadius: designTokens.borderRadius.sm,
  },
  overdueWarningText: {
    // Color handled dynamically via useTheme
    fontWeight: designTokens.fontWeight.semibold,
  },
});
