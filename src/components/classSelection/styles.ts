import { StyleSheet } from 'react-native';
import { mobileFontSizes, designTokens, layoutConstants } from '../../shared/theme';
import { flexValues } from '../../shared/constants';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: flexValues.one,
    backgroundColor: designTokens.overlay.darkMedium,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.xl,
    paddingHorizontal: designTokens.spacing.lg,
  },
  modalContent: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius['2xl'],
  },
  header: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.xl,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  headerLeft: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.md,
  },
  title: {
    fontSize: mobileFontSizes.xl,
    fontWeight: designTokens.fontWeight.bold,
    color: designTokens.colors.textPrimary,
  },
  closeButton: {
    padding: designTokens.spacing.xs,
  },
  infoCard: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.primaryLight,
    margin: designTokens.spacing.lg,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    gap: designTokens.spacing.md,
  },
  infoText: {
    flex: flexValues.one,
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.primary,
    lineHeight: designTokens.lineHeights.bodyLarge,
  },
  classList: {
    flex: flexValues.one,
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
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderWidth: designTokens.borderWidth.medium,
    borderColor: designTokens.colors.transparent,
  },
  classOptionSelected: {
    backgroundColor: designTokens.colors.primaryLight,
    borderColor: designTokens.colors.primary,
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
    borderColor: designTokens.colors.textTertiary,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  checkboxSelected: {
    backgroundColor: designTokens.colors.primary,
    borderColor: designTokens.colors.primary,
  },
  classOptionText: {
    fontSize: mobileFontSizes.lg,
    color: designTokens.colors.textPrimary,
    fontWeight: designTokens.fontWeight.medium,
  },
  classOptionTextSelected: {
    color: designTokens.colors.primary,
    fontWeight: designTokens.fontWeight.semibold,
  },
  selectedBadge: {
    width: designTokens.componentSizes.badge.md,
    height: designTokens.componentSizes.badge.md,
    borderRadius: designTokens.borderRadius['2xl'],
    backgroundColor: designTokens.colors.primary,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  selectedBadgeText: {
    color: designTokens.colors.textInverse,
    fontSize: mobileFontSizes.sm,
    fontWeight: designTokens.fontWeight.bold,
  },
  footer: {
    flexDirection: layoutConstants.flexDirection.row,
    padding: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
  },
  cancelButton: {
    flex: flexValues.one,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.backgroundSecondary,
    alignItems: layoutConstants.alignItems.center,
  },
  cancelButtonText: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textSecondary,
  },
  saveButton: {
    flex: flexValues.one,
    flexDirection: layoutConstants.flexDirection.row,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.primary,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    gap: designTokens.spacing.sm,
  },
  saveButtonText: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textInverse,
  },
});
