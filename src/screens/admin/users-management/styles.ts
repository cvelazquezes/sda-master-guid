import { StyleSheet } from 'react-native';
import {
  mobileTypography,
  mobileFontSizes,
  designTokens,
  layoutConstants,
} from '../../../shared/theme';
import {
  flexValues,
  dimensionValues,
  borderValues,
  textTransformValues,
  typographyValues,
} from '../../../shared/constants';
import { BORDER_WIDTH } from '../../../shared/constants/numbers';

export const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  content: {
    padding: designTokens.spacing.lg,
  },
});

export const pendingStyles = StyleSheet.create({
  card: {
    backgroundColor: designTokens.colors.warningLight,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
    ...designTokens.shadows.sm,
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
    minHeight: dimensionValues.minHeight.cardContent,
    borderLeftWidth: BORDER_WIDTH.THICK,
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
  userInfo: {
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
  userName: {
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
    marginRight: designTokens.spacing.sm,
  },
  metaText: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
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
  title: {
    fontSize: mobileFontSizes['2xl'],
    fontWeight: designTokens.fontWeight.bold,
    color: designTokens.colors.textPrimary,
  },
  closeButton: {
    padding: designTokens.spacing.xs,
  },
  body: {
    maxHeight: dimensionValues.maxHeight.modalBodySmall,
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
    margin: designTokens.spacing.lg,
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
  sectionTitle: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.md,
  },
  label: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.textTertiary,
    fontWeight: designTokens.fontWeight.medium,
    textTransform: textTransformValues.uppercase,
    marginBottom: designTokens.spacing.xxs,
  },
  hierarchyItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.md,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderRadius: designTokens.borderRadius.md,
    marginBottom: designTokens.spacing.sm,
    gap: designTokens.spacing.md,
  },
  hierarchyInfo: {
    flex: flexValues.one,
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
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.sm,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  optionActive: {
    backgroundColor: designTokens.colors.primaryLight,
    borderWidth: designTokens.borderWidth.medium,
    borderColor: designTokens.colors.primary,
  },
  optionContent: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.md,
  },
  optionText: {
    fontSize: mobileFontSizes.lg,
    color: designTokens.colors.textSecondary,
  },
  optionTextActive: {
    color: designTokens.colors.primary,
    fontWeight: designTokens.fontWeight.semibold,
  },
  clubInactiveLabel: {
    fontSize: mobileFontSizes.xs,
    color: designTokens.colors.error,
    marginLeft: designTokens.spacing.sm,
    fontStyle: layoutConstants.fontStyle.italic,
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
  },
  applyText: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textInverse,
  },
});
