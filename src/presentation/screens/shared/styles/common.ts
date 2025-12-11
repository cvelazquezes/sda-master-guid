/* eslint-disable max-lines -- Shared styles require comprehensive style definitions */
/**
 * Common Shared Styles
 * Theme-aware style factories for reusable patterns across multiple screens.
 */
import { StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { FLEX } from '../../../../shared/constants';
import { designTokens } from '../../../theme';
import type { ThemeContextType } from '../../../state/ThemeContext';

// ============================================================================
// LEGACY EXPORTS (for backwards compatibility during migration)
// These are static and will be deprecated. Use factory functions above.
// ============================================================================

// ============================================================================
// CONTAINER STYLES FACTORY
// ============================================================================

export const createContainerStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing']
): {
  screen: ViewStyle;
  screenPrimary: ViewStyle;
  content: ViewStyle;
  contentLarge: ViewStyle;
  scrollContent: ViewStyle;
} =>
  StyleSheet.create({
    /** Full screen container with secondary background */
    screen: {
      flex: FLEX.ONE,
      backgroundColor: colors.backgroundSecondary,
    },

    /** Full screen container with primary background */
    screenPrimary: {
      flex: FLEX.ONE,
      backgroundColor: colors.backgroundPrimary,
    },

    /** Content wrapper with standard padding */
    content: {
      padding: spacing.lg,
    },

    /** Content wrapper with extra large padding */
    contentLarge: {
      padding: spacing.xl,
    },

    /** Scrollable content with bottom padding */
    scrollContent: {
      paddingBottom: spacing.xxl,
    },
  });

// ============================================================================
// SECTION STYLES FACTORY
// ============================================================================

export const createSectionStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): {
  section: ViewStyle;
  sectionSpaced: ViewStyle;
  sectionCard: ViewStyle;
  sectionTitle: TextStyle;
  sectionSubtitle: TextStyle;
} =>
  StyleSheet.create({
    /** Standard section container */
    section: {
      padding: spacing.lg,
      backgroundColor: colors.backgroundPrimary,
    },

    /** Section with top margin */
    sectionSpaced: {
      padding: spacing.lg,
      backgroundColor: colors.backgroundPrimary,
      marginTop: spacing.sm,
    },

    /** Section with rounded corners */
    sectionCard: {
      backgroundColor: colors.backgroundPrimary,
      padding: spacing.lg,
      borderRadius: radii.lg,
    },

    /** Section title */
    sectionTitle: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold,
      marginBottom: spacing.lg,
      color: colors.textPrimary,
    },

    /** Section subtitle */
    sectionSubtitle: {
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
      marginTop: spacing.xxs,
    },
  });

// ============================================================================
// CARD STYLES FACTORY
// ============================================================================

export const createCardStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): { card: ViewStyle; cardHeader: ViewStyle; cardTitle: TextStyle; cardSubtitle: TextStyle } =>
  StyleSheet.create({
    /** Standard card with input background */
    card: {
      backgroundColor: colors.inputBackground,
      padding: spacing.lg,
      borderRadius: radii.lg,
      marginBottom: spacing.md,
    },

    /** Card header with space between */
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },

    /** Card title */
    cardTitle: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
    },

    /** Card subtitle */
    cardSubtitle: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
      marginTop: spacing.xxs,
    },
  });

// ============================================================================
// MODAL STYLES FACTORY
// ============================================================================

export const createModalStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  typography: ThemeContextType['typography']
): {
  content: ViewStyle;
  contentLarge: ViewStyle;
  section: ViewStyle;
  sectionLarge: ViewStyle;
  sectionTitle: TextStyle;
} =>
  StyleSheet.create({
    /** Modal content container */
    content: {
      padding: spacing.lg,
    },

    /** Modal content with extra padding */
    contentLarge: {
      padding: spacing.xl,
    },

    /** Modal section */
    section: {
      marginBottom: spacing.xl,
    },

    /** Modal section with extra margin */
    sectionLarge: {
      marginBottom: spacing.xxl,
    },

    /** Modal section title */
    sectionTitle: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
  });

// ============================================================================
// AVATAR STYLES FACTORY
// ============================================================================

export const createAvatarStyles = (
  colors: ThemeContextType['colors'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): { avatarLg: ViewStyle; avatarText: TextStyle; avatarTextMd: TextStyle } =>
  StyleSheet.create({
    /** Large avatar container */
    avatarLg: {
      width: 48,
      height: 48,
      borderRadius: radii['3xl'],
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },

    /** Avatar text (initials) */
    avatarText: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold,
      color: colors.textInverse,
    },

    /** Medium avatar text */
    avatarTextMd: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      color: colors.textInverse,
    },
  });

// ============================================================================
// STATUS BADGE STYLES FACTORY
// ============================================================================

export const createStatusBadgeStyles = (
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): { badge: ViewStyle; badgeSmall: ViewStyle; badgeText: TextStyle; badgeTextSmall: TextStyle } =>
  StyleSheet.create({
    /** Status badge container */
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.lg,
      gap: spacing.sm,
    },

    /** Small status badge */
    badgeSmall: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radii.lg,
    },

    /** Status badge text */
    badgeText: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
    },

    /** Small badge text */
    badgeTextSmall: {
      fontSize: typography.fontSizes.xs,
      fontWeight: typography.fontWeights.bold,
    },
  });

// ============================================================================
// LIST ROW STYLES FACTORY
// ============================================================================

export const createListRowStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): {
  row: ViewStyle;
  rowSecondary: ViewStyle;
  rowInfo: ViewStyle;
  rowTitle: TextStyle;
  rowSubtitle: TextStyle;
} =>
  StyleSheet.create({
    /** Standard list row */
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      backgroundColor: colors.inputBackground,
      borderRadius: radii.lg,
      marginBottom: spacing.sm,
      gap: spacing.md,
    },

    /** Row with secondary background */
    rowSecondary: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: radii.lg,
      marginBottom: spacing.sm,
      gap: spacing.md,
    },

    /** Row info container (flex: 1) */
    rowInfo: {
      flex: FLEX.ONE,
    },

    /** Row primary text */
    rowTitle: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
    },

    /** Row secondary text */
    rowSubtitle: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
      marginTop: spacing.xxs,
    },
  });

// ============================================================================
// EMPTY STATE STYLES FACTORY
// ============================================================================

export const createEmptyStateStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  typography: ThemeContextType['typography']
): { container: ViewStyle; containerCompact: ViewStyle; title: TextStyle; subtitle: TextStyle } =>
  StyleSheet.create({
    /** Empty state container */
    container: {
      alignItems: 'center',
      padding: spacing['4xl'],
    },

    /** Empty state container (smaller) */
    containerCompact: {
      alignItems: 'center',
      padding: spacing.xxl,
    },

    /** Empty state title */
    title: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold,
      color: colors.textSecondary,
      marginTop: spacing.lg,
    },

    /** Empty state subtitle */
    subtitle: {
      fontSize: typography.fontSizes.sm,
      color: colors.textTertiary,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
  });

// ============================================================================
// FILTER STYLES FACTORY
// ============================================================================

export const createFilterStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): {
  container: ViewStyle;
  row: ViewStyle;
  label: TextStyle;
  badge: ViewStyle;
  badgeText: TextStyle;
} =>
  StyleSheet.create({
    /** Filter container */
    container: {
      marginBottom: spacing.lg,
    },

    /** Filter row (horizontal scroll) */
    row: {
      flexDirection: 'row',
      gap: spacing.sm,
    },

    /** Filter label */
    label: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },

    /** Filter badge */
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.backgroundPrimary,
      borderRadius: radii.full,
      marginRight: spacing.sm,
      gap: spacing.sm,
    },

    /** Filter badge text */
    badgeText: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
    },
  });

// ============================================================================
// FOOTER STYLES FACTORY
// ============================================================================

export const createFooterStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): { footer: ViewStyle; primaryButton: ViewStyle; primaryButtonText: TextStyle } =>
  StyleSheet.create({
    /** Standard footer */
    footer: {
      padding: spacing.xl,
      backgroundColor: colors.backgroundPrimary,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },

    /** Primary action button in footer */
    primaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      borderRadius: radii.xl,
      gap: spacing.md,
    },

    /** Primary button text */
    primaryButtonText: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      color: colors.textInverse,
    },
  });

/** @deprecated Use createContainerStyles factory instead */
export const containerStyles = StyleSheet.create({
  screen: { flex: FLEX.ONE, backgroundColor: designTokens.colors.backgroundSecondary },
  screenPrimary: { flex: FLEX.ONE, backgroundColor: designTokens.colors.backgroundPrimary },
  content: { padding: designTokens.spacing.lg },
  contentLarge: { padding: designTokens.spacing.xl },
  scrollContent: { paddingBottom: designTokens.spacing.xxl },
});

/** @deprecated Use createSectionStyles factory instead */
export const sectionStyles = StyleSheet.create({
  section: {
    padding: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.backgroundPrimary,
  },
  sectionSpaced: {
    padding: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.backgroundPrimary,
    marginTop: designTokens.spacing.sm,
  },
  sectionCard: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: designTokens.spacing.lg,
    color: designTokens.colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.xxs,
  },
});

/** @deprecated Use createCardStyles factory instead */
export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: designTokens.colors.inputBackground,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: designTokens.colors.textPrimary },
  cardSubtitle: {
    fontSize: 12,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.xxs,
  },
});

/** @deprecated Use createModalStyles factory instead */
export const modalStyles = StyleSheet.create({
  content: { padding: designTokens.spacing.lg },
  contentLarge: { padding: designTokens.spacing.xl },
  section: { marginBottom: designTokens.spacing.xl },
  sectionLarge: { marginBottom: designTokens.spacing.xxl },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.md,
  },
});

/** @deprecated Use createAvatarStyles factory instead */
export const avatarStyles = StyleSheet.create({
  avatarLg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: designTokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '700', color: designTokens.colors.textInverse },
  avatarTextMd: { fontSize: 16, fontWeight: '700', color: designTokens.colors.textInverse },
});

/** @deprecated Use createStatusBadgeStyles factory instead */
export const statusBadgeStyles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    gap: designTokens.spacing.sm,
  },
  badgeSmall: {
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.lg,
  },
  badgeText: { fontSize: 16, fontWeight: '700' },
  badgeTextSmall: { fontSize: 12, fontWeight: '700' },
});

/** @deprecated Use createListRowStyles factory instead */
export const listRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: designTokens.spacing.md,
    backgroundColor: designTokens.colors.inputBackground,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.sm,
    gap: designTokens.spacing.md,
  },
  rowSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: designTokens.spacing.md,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.sm,
    gap: designTokens.spacing.md,
  },
  rowInfo: { flex: FLEX.ONE },
  rowTitle: { fontSize: 16, fontWeight: '700', color: designTokens.colors.textPrimary },
  rowSubtitle: {
    fontSize: 12,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.xxs,
  },
});

/** @deprecated Use createEmptyStateStyles factory instead */
export const emptyStateStyles = StyleSheet.create({
  container: { alignItems: 'center', padding: designTokens.spacing['4xl'] },
  containerCompact: { alignItems: 'center', padding: designTokens.spacing.xxl },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.lg,
  },
  subtitle: {
    fontSize: 14,
    color: designTokens.colors.textTertiary,
    marginTop: designTokens.spacing.sm,
    textAlign: 'center',
  },
});

/** @deprecated Use createFilterStyles factory instead */
export const filterStyles = StyleSheet.create({
  container: { marginBottom: designTokens.spacing.lg },
  row: { flexDirection: 'row', gap: designTokens.spacing.sm },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.full,
    marginRight: designTokens.spacing.sm,
    gap: designTokens.spacing.sm,
  },
  badgeText: { fontSize: 14, fontWeight: '700', color: designTokens.colors.textPrimary },
});

/** @deprecated Use createFooterStyles factory instead */
export const footerStyles = StyleSheet.create({
  footer: {
    padding: designTokens.spacing.xl,
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderTopWidth: 1,
    borderTopColor: designTokens.colors.borderLight,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: designTokens.colors.primary,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.xl,
    gap: designTokens.spacing.md,
  },
  primaryButtonText: { fontSize: 16, fontWeight: '700', color: designTokens.colors.textInverse },
});
