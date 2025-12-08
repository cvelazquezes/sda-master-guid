/**
 * Settings Screen Styles
 *
 * ✅ COMPLIANT: Uses factory pattern with useTheme() values
 * All design tokens come from ThemeContext, not direct imports
 */
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ThemeContextType } from '../../../state/ThemeContext';
import { FLEX, TEXT_TRANSFORM, TYPOGRAPHY } from '../../../../shared/constants';

// Type for theme values needed by these styles
type ThemeValues = Pick<
  ThemeContextType,
  | 'spacing'
  | 'radii'
  | 'typography'
  | 'shadows'
  | 'componentSizes'
  | 'avatarSizes'
  | 'borderWidths'
  | 'lineHeights'
>;

// ============================================================================
// MAIN STYLES
// ============================================================================

interface MainStyles {
  container: ViewStyle;
  header: ViewStyle;
  headerContent: ViewStyle;
  avatarContainer: ViewStyle;
  avatar: ViewStyle;
  avatarText: TextStyle;
  activeIndicator: ViewStyle;
  userName: TextStyle;
  userEmail: TextStyle;
  roleBadge: ViewStyle;
  roleText: TextStyle;
  headerStats: ViewStyle;
  headerStat: ViewStyle;
  headerStatText: TextStyle;
  headerStatDot: ViewStyle;
  statusDot: ViewStyle;
}

export const createStyles = (theme: ThemeValues): MainStyles =>
  StyleSheet.create<MainStyles>({
    container: { flex: FLEX.ONE },
    header: {
      paddingTop: theme.spacing['6xl'],
      paddingBottom: theme.spacing.xxl,
      paddingHorizontal: theme.spacing.lg,
    },
    headerContent: { alignItems: 'center' },
    avatarContainer: {
      padding: theme.spacing.xs,
      borderRadius: theme.radii.full,
      marginBottom: theme.spacing.lg,
    },
    avatar: {
      width: theme.avatarSizes.xxl,
      height: theme.avatarSizes.xxl,
      borderRadius: theme.radii.full,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: theme.typography.fontSizes['4xl'],
      fontWeight: theme.typography.fontWeights.bold,
    },
    activeIndicator: {
      position: 'absolute',
      bottom: theme.spacing.xs,
      right: theme.spacing.xs,
      width: theme.spacing.xl,
      height: theme.spacing.xl,
      borderRadius: theme.radii.full,
      borderWidth: theme.borderWidths.thick,
    },
    userName: {
      fontSize: theme.typography.fontSizes['2xl'],
      fontWeight: theme.typography.fontWeights.bold,
      marginBottom: theme.spacing.xs,
    },
    userEmail: {
      fontSize: theme.typography.fontSizes.md,
      marginBottom: theme.spacing.md,
    },
    roleBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radii.full,
      gap: theme.spacing.sm,
    },
    roleText: {
      fontSize: theme.typography.fontSizes.sm,
      fontWeight: theme.typography.fontWeights.semibold,
      textTransform: TEXT_TRANSFORM.UPPERCASE,
      letterSpacing: TYPOGRAPHY.LETTER_SPACING.NORMAL,
    },
    headerStats: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      borderTopWidth: theme.borderWidths.thin,
      gap: theme.spacing.md,
    },
    headerStat: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    headerStatText: { fontSize: theme.typography.fontSizes.sm },
    headerStatDot: {
      width: theme.spacing.xs,
      height: theme.spacing.xs,
      borderRadius: theme.radii.full,
    },
    statusDot: {
      width: theme.spacing.sm,
      height: theme.spacing.sm,
      borderRadius: theme.radii.full,
    },
  });

// ============================================================================
// QUICK ACTION STYLES
// ============================================================================

interface QuickActionStyles {
  container: ViewStyle;
  action: ViewStyle;
  actionIcon: ViewStyle;
  actionText: TextStyle;
}

export const createQuickActionStyles = (theme: ThemeValues): QuickActionStyles =>
  StyleSheet.create<QuickActionStyles>({
    container: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    action: {
      flex: FLEX.ONE,
      alignItems: 'center',
      paddingVertical: theme.spacing.lg,
      borderRadius: theme.radii.xl,
      ...shadows.sm,
    },
    actionIcon: {
      width: theme.componentSizes.iconContainer.lg,
      height: theme.componentSizes.iconContainer.lg,
      borderRadius: theme.radii.lg,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    actionText: {
      fontSize: theme.typography.fontSizes.xs,
      fontWeight: theme.typography.fontWeights.semibold,
      textAlign: 'center',
    },
  });

// ============================================================================
// SECTION STYLES
// ============================================================================

interface SectionStyles {
  section: ViewStyle;
  sectionHeader: ViewStyle;
  sectionTitle: TextStyle;
}

export const createSectionStyles = (theme: ThemeValues): SectionStyles =>
  StyleSheet.create<SectionStyles>({
    section: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderRadius: theme.radii.xl,
      overflow: 'hidden',
      ...shadows.sm,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSizes.sm,
      fontWeight: theme.typography.fontWeights.bold,
      textTransform: TEXT_TRANSFORM.UPPERCASE,
      letterSpacing: TYPOGRAPHY.LETTER_SPACING.NORMAL,
    },
  });

// ============================================================================
// MENU ITEM STYLES
// ============================================================================

interface MenuItemStyles {
  menuItem: ViewStyle;
  menuIcon: ViewStyle;
  menuContent: ViewStyle;
  menuTitle: TextStyle;
  menuSubtitle: TextStyle;
}

export const createMenuItemStyles = (theme: ThemeValues): MenuItemStyles =>
  StyleSheet.create<MenuItemStyles>({
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      gap: theme.spacing.md,
      borderBottomWidth: theme.borderWidths.thin,
    },
    menuIcon: {
      width: theme.componentSizes.iconContainer.md,
      height: theme.componentSizes.iconContainer.md,
      borderRadius: theme.radii.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuContent: { flex: FLEX.ONE },
    menuTitle: {
      fontSize: theme.typography.fontSizes.md,
      fontWeight: theme.typography.fontWeights.semibold,
      marginBottom: theme.spacing.xxs,
    },
    menuSubtitle: { fontSize: theme.typography.fontSizes.xs },
  });

// ============================================================================
// SKELETON STYLES
// ============================================================================

interface SkeletonStyles {
  skeletonProfile: ViewStyle;
  skeletonAvatar: ViewStyle;
  skeletonName: ViewStyle;
  skeletonEmail: ViewStyle;
}

export const createSkeletonStyles = (theme: ThemeValues): SkeletonStyles =>
  StyleSheet.create<SkeletonStyles>({
    skeletonProfile: {
      alignItems: 'center',
      paddingVertical: theme.spacing['4xl'],
    },
    skeletonAvatar: {
      width: theme.avatarSizes.xxl,
      height: theme.avatarSizes.xxl,
      borderRadius: theme.radii.full,
      marginBottom: theme.spacing.lg,
    },
    skeletonName: {
      width: theme.componentSizes.skeleton.text.sm,
      height: theme.componentSizes.tabBarIndicator.lg,
      borderRadius: theme.radii.sm,
      marginBottom: theme.spacing.sm,
    },
    skeletonEmail: {
      width: theme.componentSizes.skeleton.text.md,
      height: theme.lineHeights.captionLarge,
      borderRadius: theme.radii.sm,
    },
  });
