/**
 * Activities Screen Styles
 * Theme-aware style factories
 */
import { StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { FLEX } from '../../../../shared/constants';
import type { ThemeContextType } from '../../../state/ThemeContext';

// Re-export shared styles for convenience
export {
  containerStyles,
  modalStyles as sharedModalStyles,
  statusBadgeStyles,
  listRowStyles,
  filterStyles as sharedFilterStyles,
} from '../../shared/styles';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type ScreenStyles = {
  container: ViewStyle;
  content: ViewStyle;
};

type FilterStyles = {
  container: ViewStyle;
  label: TextStyle;
  badge: ViewStyle;
  text: TextStyle;
};

type ModalStyles = {
  content: ViewStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
};

type StatusStyles = {
  badge: ViewStyle;
  text: TextStyle;
};

type ParticipantStyles = {
  row: ViewStyle;
  avatar: ViewStyle;
  avatarText: TextStyle;
  info: ViewStyle;
  name: TextStyle;
  email: TextStyle;
};

// ============================================================================
// SCREEN STYLES FACTORY
// ============================================================================

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
// FILTER STYLES FACTORY
// ============================================================================

export const createFilterStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): FilterStyles =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.lg,
    },
    label: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
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
    text: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.textPrimary,
    },
  });

// ============================================================================
// MODAL STYLES FACTORY
// ============================================================================

export const createModalStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  typography: ThemeContextType['typography']
): ModalStyles =>
  StyleSheet.create({
    content: {
      padding: spacing.lg,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
  });

// ============================================================================
// STATUS STYLES FACTORY
// ============================================================================

export const createStatusStyles = (
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): StatusStyles =>
  StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.lg,
      gap: spacing.sm,
    },
    text: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
    },
  });

// ============================================================================
// PARTICIPANT STYLES FACTORY
// ============================================================================

export const createParticipantStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): ParticipantStyles =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: radii.lg,
      marginBottom: spacing.sm,
      gap: spacing.md,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: radii['3xl'],
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.textInverse,
    },
    info: {
      flex: FLEX.ONE,
    },
    name: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      color: colors.textPrimary,
    },
    email: {
      fontSize: typography.fontSizes.xs,
      color: colors.textSecondary,
      marginTop: spacing.xxs,
    },
  });
