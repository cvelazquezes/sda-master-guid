import { StyleSheet } from 'react-native';
import { mobileFontSizes, designTokens, layoutConstants } from '../../shared/theme';
import { FLEX } from '../../shared/constants';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: FLEX.ONE,
    backgroundColor: designTokens.overlay.darkMedium,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.xl,
    paddingHorizontal: designTokens.spacing.lg,
  },
  modalContent: {
    borderRadius: designTokens.borderRadius['2xl'],
  },
  header: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.xl,
    borderBottomWidth: designTokens.borderWidth.thin,
  },
  headerLeft: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.md,
  },
  title: {
    fontSize: mobileFontSizes.xl,
    fontWeight: designTokens.fontWeight.bold,
  },
  closeButton: {
    padding: designTokens.spacing.xs,
  },
  infoCard: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    margin: designTokens.spacing.lg,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    gap: designTokens.spacing.md,
  },
  infoText: {
    flex: FLEX.ONE,
    fontSize: mobileFontSizes.sm,
    lineHeight: designTokens.lineHeights.bodyLarge,
  },
  classList: {
    flex: FLEX.ONE,
    paddingHorizontal: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.lg,
  },
  classOption: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
    borderWidth: designTokens.borderWidth.medium,
    borderColor: designTokens.colors.transparent,
  },
  classOptionSelected: {
    // Colors applied inline for theme support
  },
  classOptionContent: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.md,
  },
  checkbox: {
    width: designTokens.componentSizes.checkbox.md,
    height: designTokens.componentSizes.checkbox.md,
    borderRadius: designTokens.borderRadius.sm,
    borderWidth: designTokens.borderWidth.medium,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  checkboxSelected: {
    // Colors applied inline for theme support
  },
  classOptionText: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.medium,
  },
  classOptionTextSelected: {
    fontWeight: designTokens.fontWeight.semibold,
  },
  selectedBadge: {
    width: designTokens.componentSizes.badge.md,
    height: designTokens.componentSizes.badge.md,
    borderRadius: designTokens.borderRadius['2xl'],
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  selectedBadgeText: {
    fontSize: mobileFontSizes.sm,
    fontWeight: designTokens.fontWeight.bold,
  },
  footer: {
    flexDirection: layoutConstants.flexDirection.row,
    padding: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
    borderTopWidth: designTokens.borderWidth.thin,
  },
  cancelButton: {
    flex: FLEX.ONE,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    alignItems: layoutConstants.alignItems.center,
  },
  cancelButtonText: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
  },
  saveButton: {
    flex: FLEX.ONE,
    flexDirection: layoutConstants.flexDirection.row,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    gap: designTokens.spacing.sm,
  },
  saveButtonText: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
  },
});
