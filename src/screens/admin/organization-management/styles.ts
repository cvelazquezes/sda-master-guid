import { StyleSheet } from 'react-native';
import { mobileFontSizes, designTokens, layoutConstants } from '../../../shared/theme';
import {
  flexValues,
  dimensionValues,
  borderValues,
  textTransformValues,
  typographyValues,
} from '../../../shared/constants';

export const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  typeSelectorContainer: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  typeSelector: {
    flexDirection: layoutConstants.flexDirection.row,
    padding: designTokens.spacing.md,
    gap: designTokens.spacing.sm,
  },
  typeButton: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.backgroundSecondary,
    gap: designTokens.spacing.xs,
    borderWidth: designTokens.borderWidth.medium,
    borderColor: borderValues.color.transparent,
    minHeight: dimensionValues.minHeight.touchTarget,
  },
  typeButtonActive: {
    backgroundColor: designTokens.colors.primary,
    borderColor: designTokens.colors.primary,
  },
  typeButtonText: {
    fontSize: mobileFontSizes.sm,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textPrimary,
  },
  typeButtonTextActive: {
    color: designTokens.colors.textInverse,
  },
  actionsContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
    backgroundColor: designTokens.colors.backgroundPrimary,
  },
  searchContainer: {
    flex: flexValues.one,
  },
  createButton: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    backgroundColor: designTokens.colors.primary,
    paddingVertical: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    gap: designTokens.spacing.xs,
    minHeight: dimensionValues.minHeight.touchTargetStandard,
  },
  createButtonText: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textInverse,
  },
  content: {
    flex: flexValues.one,
    padding: designTokens.spacing.lg,
  },
  loadingText: {
    fontSize: mobileFontSizes.md,
    color: designTokens.colors.textSecondary,
    textAlign: layoutConstants.textAlign.center,
    marginTop: designTokens.spacing.xl,
  },
});

export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.md,
    marginBottom: designTokens.spacing.sm,
    ...designTokens.shadows.sm,
  },
  header: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.sm,
  },
  title: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    flex: flexValues.one,
    gap: designTokens.spacing.sm,
  },
  info: {
    flex: flexValues.one,
  },
  name: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.xxs,
  },
  parent: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textTertiary,
  },
  deleteButton: {
    padding: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.md,
    minWidth: dimensionValues.minWidth.iconButtonSmall,
    minHeight: dimensionValues.minHeight.iconButtonSmall,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
  },
  footer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs,
    paddingTop: designTokens.spacing.sm,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
  },
  clubCount: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textTertiary,
  },
});

export const modalStyles = StyleSheet.create({
  overlay: {
    flex: flexValues.one,
    backgroundColor: designTokens.overlay.darkMedium,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
  },
  overlayMobile: {
    justifyContent: layoutConstants.justifyContent.flexEnd,
    padding: designTokens.spacing.none,
  },
  content: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius['3xl'],
    width: dimensionValues.width.full,
    maxWidth: dimensionValues.maxWidth.modal,
    maxHeight: dimensionValues.maxHeight.modalPercent,
  },
  contentMobile: {
    maxWidth: dimensionValues.maxWidthPercent.full,
    borderBottomLeftRadius: borderValues.radius.none,
    borderBottomRightRadius: borderValues.radius.none,
    borderTopLeftRadius: designTokens.borderRadius['3xl'],
    borderTopRightRadius: designTokens.borderRadius['3xl'],
  },
  handle: {
    width: designTokens.componentSizes.iconContainer.md,
    height: dimensionValues.height.dragHandle,
    backgroundColor: designTokens.colors.borderLight,
    borderRadius: designTokens.borderRadius.full,
    alignSelf: layoutConstants.alignSelf.center,
    marginTop: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.xs,
  },
  header: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  title: {
    fontSize: mobileFontSizes.xl,
    fontWeight: designTokens.fontWeight.bold,
    color: designTokens.colors.textPrimary,
  },
  closeButton: {
    padding: designTokens.spacing.xs,
  },
  body: {
    maxHeight: dimensionValues.maxHeight.modalBodyMedium,
  },
  footer: {
    flexDirection: layoutConstants.flexDirection.row,
    padding: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
  },
});

export const filterStyles = StyleSheet.create({
  infoBanner: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.flexStart,
    backgroundColor: designTokens.colors.primaryLight,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    marginHorizontal: designTokens.spacing.lg,
    marginTop: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.none,
    gap: designTokens.spacing.sm,
  },
  infoText: {
    flex: flexValues.one,
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.primary,
    lineHeight: typographyValues.lineHeight.md,
  },
  section: {
    padding: designTokens.spacing.lg,
  },
  sectionHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.sm,
  },
  sectionTitle: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textPrimary,
  },
  resultsCount: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textTertiary,
    fontWeight: designTokens.fontWeight.medium,
  },
  hierarchyItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.md,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderRadius: designTokens.borderRadius.md,
    marginTop: designTokens.spacing.md,
    marginBottom: designTokens.spacing.sm,
    gap: designTokens.spacing.md,
  },
  hierarchyInfo: {
    flex: flexValues.one,
  },
  hierarchyLabel: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textTertiary,
    fontWeight: designTokens.fontWeight.semibold,
    textTransform: textTransformValues.uppercase,
    letterSpacing: typographyValues.letterSpacing.normal,
    marginBottom: designTokens.spacing.xxs,
  },
  hierarchyValue: {
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.textPrimary,
    fontWeight: designTokens.fontWeight.semibold,
  },
  option: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.sm,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderWidth: designTokens.borderWidth.medium,
    borderColor: borderValues.color.transparent,
    minHeight: dimensionValues.minHeight.filterOption,
  },
  optionActive: {
    backgroundColor: designTokens.colors.primaryLight,
    borderColor: designTokens.colors.primary,
  },
  optionContent: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    flex: flexValues.one,
    gap: designTokens.spacing.md,
  },
  optionText: {
    fontSize: mobileFontSizes.md,
    color: designTokens.colors.textSecondary,
    flex: flexValues.one,
  },
  optionTextActive: {
    color: designTokens.colors.primary,
    fontWeight: designTokens.fontWeight.semibold,
  },
  noResultsText: {
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.textTertiary,
    textAlign: layoutConstants.textAlign.center,
    padding: designTokens.spacing.lg,
    fontStyle: layoutConstants.fontStyle.italic,
  },
  warningBanner: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.flexStart,
    backgroundColor: designTokens.colors.warningLight,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    marginHorizontal: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.lg,
    gap: designTokens.spacing.sm,
  },
  warningText: {
    flex: flexValues.one,
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.warning,
    lineHeight: typographyValues.lineHeight.lg,
  },
});

export const buttonStyles = StyleSheet.create({
  clear: {
    flex: flexValues.one,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.backgroundSecondary,
    alignItems: layoutConstants.alignItems.center,
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.center,
    gap: designTokens.spacing.xs,
    minHeight: dimensionValues.minHeight.selectItem,
  },
  clearText: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textSecondary,
  },
  apply: {
    flex: flexValues.one,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.primary,
    alignItems: layoutConstants.alignItems.center,
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.center,
    gap: designTokens.spacing.xs,
    minHeight: dimensionValues.minHeight.selectItem,
  },
  applyText: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textInverse,
  },
});
