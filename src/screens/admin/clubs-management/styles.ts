import { StyleSheet } from 'react-native';
import {
  mobileTypography,
  mobileFontSizes,
  designTokens,
  layoutConstants,
} from '../../../shared/theme';
import {
  borderValues,
  dimensionValues,
  flexValues,
  textTransformValues,
  typographyValues,
} from '../../../shared/constants';

export const styles = StyleSheet.create({
  container: { flex: flexValues.one, backgroundColor: designTokens.colors.backgroundSecondary },
  content: { padding: designTokens.spacing.lg },
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
  body: { paddingHorizontal: designTokens.spacing.lg, paddingBottom: designTokens.spacing.lg },
  dragHandle: {
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
  title: { ...mobileTypography.heading2, color: designTokens.colors.textPrimary },
  closeButton: { padding: designTokens.spacing.xs },
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
  section: { padding: designTokens.spacing.lg },
  sectionTitle: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.md,
  },
  label: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textTertiary,
    fontWeight: designTokens.fontWeight.semibold,
    textTransform: textTransformValues.uppercase,
    letterSpacing: typographyValues.letterSpacing.normal,
    marginTop: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.sm,
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
  hierarchyInfo: { flex: flexValues.one },
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
  optionSubtitle: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textTertiary,
    marginTop: designTokens.spacing.xxs,
  },
  noDataText: {
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.textTertiary,
    fontStyle: layoutConstants.fontStyle.italic,
    textAlign: layoutConstants.textAlign.center,
    paddingVertical: designTokens.spacing.lg,
    paddingHorizontal: designTokens.spacing.md,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderRadius: designTokens.borderRadius.md,
    marginTop: designTokens.spacing.md,
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
    gap: designTokens.spacing.sm,
  },
  clearText: {
    fontSize: mobileFontSizes.lg,
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
    gap: designTokens.spacing.sm,
  },
  applyText: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textInverse,
  },
});
