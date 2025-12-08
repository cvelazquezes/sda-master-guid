import { StyleSheet } from 'react-native';
import {
  mobileTypography,
  mobileFontSizes,
  designTokens,
  layoutConstants,
} from '../../../theme';
import { BORDERS, DIMENSIONS, FLEX, TEXT_TRANSFORM, TYPOGRAPHY } from '../../../../shared/constants';

export const styles = StyleSheet.create({
  container: { flex: FLEX.ONE, backgroundColor: designTokens.colors.backgroundSecondary },
  content: { padding: designTokens.spacing.lg },
});

export const modalStyles = StyleSheet.create({
  overlay: {
    flex: FLEX.ONE,
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
    width: DIMENSIONS.WIDTH.FULL,
    maxWidth: DIMENSIONS.MAX_WIDTH.MODAL,
    maxHeight: DIMENSIONS.MAX_HEIGHT.MODAL_PERCENT,
  },
  contentMobile: {
    maxWidth: DIMENSIONS.MAX_WIDTH_PERCENT.FULL,
    borderBottomLeftRadius: BORDERS.RADIUS.NONE,
    borderBottomRightRadius: BORDERS.RADIUS.NONE,
    borderTopLeftRadius: designTokens.borderRadius['3xl'],
    borderTopRightRadius: designTokens.borderRadius['3xl'],
  },
  body: { paddingHorizontal: designTokens.spacing.lg, paddingBottom: designTokens.spacing.lg },
  dragHandle: {
    width: designTokens.componentSizes.iconContainer.md,
    height: DIMENSIONS.HEIGHT.DRAG_HANDLE,
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
    flex: FLEX.ONE,
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.primary,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.MD,
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
    textTransform: TEXT_TRANSFORM.UPPERCASE,
    letterSpacing: TYPOGRAPHY.LETTER_SPACING.NORMAL,
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
  hierarchyInfo: { flex: FLEX.ONE },
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
    borderColor: BORDERS.COLOR.TRANSPARENT,
    minHeight: DIMENSIONS.MIN_HEIGHT.FILTER_OPTION,
  },
  optionActive: {
    backgroundColor: designTokens.colors.primaryLight,
    borderColor: designTokens.colors.primary,
  },
  optionContent: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    flex: FLEX.ONE,
    gap: designTokens.spacing.md,
  },
  optionText: {
    fontSize: mobileFontSizes.md,
    color: designTokens.colors.textSecondary,
    flex: FLEX.ONE,
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
    flex: FLEX.ONE,
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
    flex: FLEX.ONE,
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
