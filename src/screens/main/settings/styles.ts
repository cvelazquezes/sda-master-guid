import { StyleSheet } from 'react-native';
import { mobileFontSizes, designTokens, layoutConstants } from '../../../shared/theme';
import { flexValues, textTransformValues, typographyValues } from '../../../shared/constants';

export const styles = StyleSheet.create({
  container: { flex: flexValues.one },
  header: {
    paddingTop: designTokens.spacing['6xl'],
    paddingBottom: designTokens.spacing.xxl,
    paddingHorizontal: designTokens.spacing.lg,
  },
  headerContent: { alignItems: layoutConstants.alignItems.center },
  avatarContainer: {
    padding: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.full,
    marginBottom: designTokens.spacing.lg,
  },
  avatar: {
    width: designTokens.avatarSize.xxl,
    height: designTokens.avatarSize.xxl,
    borderRadius: designTokens.borderRadius.full,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  avatarText: {
    fontSize: designTokens.fontSize['4xl'],
    fontWeight: designTokens.fontWeight.bold,
  },
  activeIndicator: {
    position: layoutConstants.position.absolute,
    bottom: designTokens.spacing.xs,
    right: designTokens.spacing.xs,
    width: designTokens.spacing.xl,
    height: designTokens.spacing.xl,
    borderRadius: designTokens.borderRadius.full,
    borderWidth: designTokens.borderWidth.thick,
  },
  userName: {
    fontSize: mobileFontSizes['2xl'],
    fontWeight: designTokens.fontWeight.bold,
    marginBottom: designTokens.spacing.xs,
  },
  userEmail: {
    fontSize: mobileFontSizes.md,
    marginBottom: designTokens.spacing.md,
  },
  roleBadge: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.full,
    gap: designTokens.spacing.sm,
  },
  roleText: {
    fontSize: mobileFontSizes.sm,
    fontWeight: designTokens.fontWeight.semibold,
    textTransform: textTransformValues.uppercase,
    letterSpacing: typographyValues.letterSpacing.normal,
  },
  headerStats: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    marginTop: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.lg,
    borderTopWidth: designTokens.borderWidth.thin,
    gap: designTokens.spacing.md,
  },
  headerStat: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
  },
  headerStatText: { fontSize: mobileFontSizes.sm },
  headerStatDot: {
    width: designTokens.spacing.xs,
    height: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.full,
  },
  statusDot: {
    width: designTokens.spacing.sm,
    height: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.full,
  },
});

export const quickActionStyles = StyleSheet.create({
  container: {
    flexDirection: layoutConstants.flexDirection.row,
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
  },
  action: {
    flex: flexValues.one,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.xl,
    ...designTokens.shadows.sm,
  },
  actionIcon: {
    width: designTokens.componentSizes.iconContainer.lg,
    height: designTokens.componentSizes.iconContainer.lg,
    borderRadius: designTokens.borderRadius.lg,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.sm,
  },
  actionText: {
    fontSize: mobileFontSizes.xs,
    fontWeight: designTokens.fontWeight.semibold,
    textAlign: layoutConstants.textAlign.center,
  },
});

export const sectionStyles = StyleSheet.create({
  section: {
    marginHorizontal: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.xl,
    overflow: layoutConstants.overflow.hidden,
    ...designTokens.shadows.sm,
  },
  sectionHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingHorizontal: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.lg,
    paddingBottom: designTokens.spacing.sm,
    gap: designTokens.spacing.sm,
  },
  sectionTitle: {
    fontSize: mobileFontSizes.sm,
    fontWeight: designTokens.fontWeight.bold,
    textTransform: textTransformValues.uppercase,
    letterSpacing: typographyValues.letterSpacing.normal,
  },
});

export const menuItemStyles = StyleSheet.create({
  menuItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
    borderBottomWidth: designTokens.borderWidth.thin,
  },
  menuIcon: {
    width: designTokens.componentSizes.iconContainer.md,
    height: designTokens.componentSizes.iconContainer.md,
    borderRadius: designTokens.borderRadius.lg,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  menuContent: { flex: flexValues.one },
  menuTitle: {
    fontSize: mobileFontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
    marginBottom: designTokens.spacing.xxs,
  },
  menuSubtitle: { fontSize: mobileFontSizes.xs },
});

export const skeletonStyles = StyleSheet.create({
  skeletonProfile: {
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing['4xl'],
  },
  skeletonAvatar: {
    width: designTokens.avatarSize.xxl,
    height: designTokens.avatarSize.xxl,
    borderRadius: designTokens.borderRadius.full,
    marginBottom: designTokens.spacing.lg,
  },
  skeletonName: {
    width: designTokens.componentSizes.skeleton.text.sm,
    height: designTokens.componentSizes.tabBarIndicator.lg,
    borderRadius: designTokens.borderRadius.sm,
    marginBottom: designTokens.spacing.sm,
  },
  skeletonEmail: {
    width: designTokens.componentSizes.skeleton.text.md,
    height: designTokens.lineHeights.captionLarge,
    borderRadius: designTokens.borderRadius.sm,
  },
});
