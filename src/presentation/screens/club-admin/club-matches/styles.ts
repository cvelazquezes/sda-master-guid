/**
 * Club Matches Screen Styles
 * Theme-aware style factories
 */
import { StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { FLEX } from '../../../../shared/constants';
import type { ThemeContextType } from '../../../state/ThemeContext';

// ============================================================================
// SCREEN STYLES FACTORY
// ============================================================================

type ScreenStyles = {
  container: ViewStyle;
  content: ViewStyle;
};

export const createScreenStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing']
): ScreenStyles =>
  StyleSheet.create({
    container: {
      flex: FLEX.ONE,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      padding: spacing.lg,
    },
  });

// ============================================================================
// FILTER SECTION STYLES FACTORY
// ============================================================================

type FilterSectionStyles = {
  section: ViewStyle;
  sectionTitle: TextStyle;
  filterScroll: ViewStyle;
  filterChip: ViewStyle;
  filterChipActive: ViewStyle;
  filterChipText: TextStyle;
  filterChipTextActive: TextStyle;
};

export const createFilterSectionStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): FilterSectionStyles =>
  StyleSheet.create({
    section: {
      padding: spacing.lg,
      backgroundColor: colors.backgroundPrimary,
      marginTop: spacing.sm,
    },
    sectionTitle: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold,
      marginBottom: spacing.lg,
      color: colors.textPrimary,
    },
    filterScroll: {
      flexDirection: 'row',
    },
    filterChip: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: radii['2xl'],
      marginRight: spacing.sm,
    },
    filterChipActive: {
      backgroundColor: colors.primary,
    },
    filterChipText: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.bold,
      color: colors.textSecondary,
    },
    filterChipTextActive: {
      color: colors.textInverse,
    },
  });

// ============================================================================
// STATS STYLES FACTORY
// ============================================================================

export const createStatsStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): {
  container: ViewStyle;
  sectionTitle: TextStyle;
  statsGrid: ViewStyle;
  statCard: ViewStyle;
  statValue: TextStyle;
  statLabel: TextStyle;
} =>
  StyleSheet.create({
    container: {
      padding: spacing.lg,
      backgroundColor: colors.backgroundPrimary,
      marginTop: spacing.sm,
    },
    sectionTitle: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold,
      marginBottom: spacing.lg,
      color: colors.textPrimary,
    },
    statsGrid: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    statCard: {
      flex: FLEX.ONE,
      backgroundColor: colors.inputBackground,
      padding: spacing.lg,
      borderRadius: radii.lg,
      alignItems: 'center',
    },
    statValue: {
      fontSize: typography.fontSizes['3xl'],
      fontWeight: typography.fontWeights.bold,
      color: colors.primary,
      marginBottom: spacing.xs,
    },
    statLabel: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
    },
  });

// ============================================================================
// ROUNDS STYLES FACTORY
// ============================================================================

export const createRoundsStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): {
  section: ViewStyle;
  sectionTitle: TextStyle;
  roundCard: ViewStyle;
  roundHeader: ViewStyle;
  roundTitle: TextStyle;
  roundDate: TextStyle;
  roundStatusBadge: ViewStyle;
  roundStatusText: TextStyle;
  roundMatches: TextStyle;
} =>
  StyleSheet.create({
    section: {
      padding: spacing.lg,
      backgroundColor: colors.backgroundPrimary,
      marginTop: spacing.sm,
    },
    sectionTitle: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold,
      marginBottom: spacing.lg,
      color: colors.textPrimary,
    },
    roundCard: {
      backgroundColor: colors.inputBackground,
      padding: spacing.lg,
      borderRadius: radii.lg,
      marginBottom: spacing.md,
    },
    roundHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    roundTitle: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
    },
    roundDate: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
      marginTop: spacing.xxs,
    },
    roundStatusBadge: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radii.lg,
    },
    roundStatusText: {
      fontSize: typography.fontSizes.xs,
      fontWeight: typography.fontWeights.bold,
    },
    roundMatches: {
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
    },
  });

// ============================================================================
// MODAL STYLES FACTORY
// ============================================================================

export const createModalStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): {
  modalContent: ViewStyle;
  modalSection: ViewStyle;
  modalSectionTitle: TextStyle;
  statusBadge: ViewStyle;
  statusText: TextStyle;
  participantRow: ViewStyle;
  participantAvatar: ViewStyle;
  participantAvatarText: TextStyle;
  participantInfo: ViewStyle;
  participantName: TextStyle;
  participantEmail: TextStyle;
  participantPhone: TextStyle;
} =>
  StyleSheet.create({
    modalContent: {
      padding: spacing.xl,
    },
    modalSection: {
      marginBottom: spacing.xxl,
    },
    modalSectionTitle: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold,
      marginBottom: spacing.md,
      color: colors.textPrimary,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.lg,
      gap: spacing.sm,
    },
    statusText: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
    },
    participantRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      backgroundColor: colors.inputBackground,
      borderRadius: radii.lg,
      marginBottom: spacing.sm,
      gap: spacing.md,
    },
    participantAvatar: {
      width: 48,
      height: 48,
      borderRadius: radii['3xl'],
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    participantAvatarText: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold,
      color: colors.textInverse,
    },
    participantInfo: {
      flex: FLEX.ONE,
    },
    participantName: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
    },
    participantEmail: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
      marginTop: spacing.xxs,
    },
    participantPhone: {
      fontSize: typography.fontSizes.xs,
      color: colors.success,
      marginTop: spacing.xxs,
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
  filterContainer: ViewStyle;
  filterButton: ViewStyle;
  filterButtonActive: ViewStyle;
  filterButtonText: TextStyle;
  filterButtonTextActive: TextStyle;
} =>
  StyleSheet.create({
    filterContainer: {
      flexDirection: 'row',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      gap: spacing.sm,
    },
    filterButton: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: radii.full,
      backgroundColor: colors.backgroundSecondary,
    },
    filterButtonActive: {
      backgroundColor: colors.primary,
    },
    filterButtonText: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
    },
    filterButtonTextActive: {
      color: colors.textInverse,
    },
  });

// ============================================================================
// MATCH LIST STYLES FACTORY
// ============================================================================

export const createMatchListStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): {
  listContainer: ViewStyle;
  matchCard: ViewStyle;
  matchHeader: ViewStyle;
  matchTitle: TextStyle;
  matchBadge: ViewStyle;
  matchBadgeText: TextStyle;
  matchParticipants: TextStyle;
  emptyContainer: ViewStyle;
  emptyText: TextStyle;
} =>
  StyleSheet.create({
    listContainer: {
      padding: spacing.lg,
      paddingTop: spacing.sm,
    },
    matchCard: {
      backgroundColor: colors.inputBackground,
      padding: spacing.lg,
      borderRadius: radii.lg,
      marginBottom: spacing.md,
    },
    matchHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    matchTitle: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      flex: FLEX.ONE,
      color: colors.textPrimary,
    },
    matchBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xxs,
      borderRadius: radii.md,
    },
    matchBadgeText: {
      fontSize: typography.fontSizes.xs,
      fontWeight: typography.fontWeights.bold,
    },
    matchParticipants: {
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
    },
    emptyContainer: {
      alignItems: 'center',
      padding: spacing.xxl,
    },
    emptyText: {
      fontSize: typography.fontSizes.md,
      color: colors.textTertiary,
    },
  });

// ============================================================================
// INDEX STYLES FACTORY
// ============================================================================

export const createIndexStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  typography: ThemeContextType['typography']
): {
  container: ViewStyle;
  scrollContent: ViewStyle;
  header: ViewStyle;
  headerTitle: TextStyle;
  headerSubtitle: TextStyle;
} =>
  StyleSheet.create({
    container: {
      flex: FLEX.ONE,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: spacing.xxl,
    },
    header: {
      padding: spacing.lg,
      backgroundColor: colors.backgroundPrimary,
    },
    headerTitle: {
      fontSize: typography.fontSizes['2xl'],
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
    },
    headerSubtitle: {
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
      marginTop: spacing.xxs,
    },
  });

// ============================================================================
// EMPTY STYLES FACTORY
// ============================================================================

export const createEmptyStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  typography: ThemeContextType['typography']
): { container: ViewStyle; text: TextStyle; subtext: TextStyle } =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing['4xl'],
      marginTop: spacing['4xl'],
    },
    text: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold,
      marginTop: spacing.lg,
      color: colors.textPrimary,
    },
    subtext: {
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
  });
