/**
 * Club Settings Screen Styles
 * Theme-aware style factories for all club settings components
 */
import { StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { FLEX } from '../../../../shared/constants';
import type { ThemeContextType } from '../../../state/ThemeContext';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type ScreenStyles = {
  container: ViewStyle;
  content: ViewStyle;
  hierarchySection: ViewStyle;
  saveButton: ViewStyle;
  saveButtonText: TextStyle;
  loadingText: TextStyle;
};

type SectionStyles = {
  section: ViewStyle;
  sectionTitle: TextStyle;
};

type ActivitySettingsStyles = SectionStyles & {
  selectContainer: ViewStyle;
  selectLabel: TextStyle;
  selectOptions: ViewStyle;
};

type OptionButtonStyles = {
  selectOption: ViewStyle;
  selectOptionText: TextStyle;
};

type UserPreferencesStyles = SectionStyles & {
  preferenceItem: ViewStyle;
};

// ============================================================================
// SCREEN STYLES FACTORY
// ============================================================================

export const createScreenStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  borderRadius: ThemeContextType['borderRadius'],
  typography: ThemeContextType['typography']
): ScreenStyles =>
  StyleSheet.create({
    container: {
      flex: FLEX.ONE,
      backgroundColor: colors.background,
    },
    content: {
      padding: spacing.md,
    },
    hierarchySection: {
      marginBottom: spacing.md,
    },
    saveButton: {
      padding: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      marginTop: spacing.sm,
      backgroundColor: colors.primary,
    },
    saveButtonText: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.semibold as TextStyle['fontWeight'],
      color: colors.textInverse,
    },
    loadingText: {
      textAlign: 'center',
      marginTop: spacing['3xl'],
      fontSize: typography.fontSizes.lg,
      color: colors.textSecondary,
    },
  });

// ============================================================================
// SECTION STYLES FACTORY (Shared by BasicInfo, Activity, UserPreferences)
// ============================================================================

export const createSectionStyles = (
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): SectionStyles =>
  StyleSheet.create({
    section: {
      padding: spacing.lg,
      borderRadius: radii.md,
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      marginBottom: spacing.md,
    },
  });

// ============================================================================
// ACTIVITY SETTINGS STYLES FACTORY
// ============================================================================

export const createActivitySettingsStyles = (
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): ActivitySettingsStyles =>
  StyleSheet.create({
    section: {
      padding: spacing.lg,
      borderRadius: radii.md,
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      marginBottom: spacing.md,
    },
    selectContainer: {
      marginBottom: spacing.lg,
    },
    selectLabel: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      marginBottom: spacing.md,
    },
    selectOptions: {
      flexDirection: 'row',
      gap: spacing.md,
    },
  });

// ============================================================================
// OPTION BUTTON STYLES FACTORY
// ============================================================================

export const createOptionButtonStyles = (
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  borderWidth: ThemeContextType['borderWidth'],
  typography: ThemeContextType['typography']
): OptionButtonStyles =>
  StyleSheet.create({
    selectOption: {
      flex: FLEX.ONE,
      padding: spacing.md,
      borderRadius: radii.md,
      borderWidth: borderWidth.thin,
      alignItems: 'center',
    },
    selectOptionText: {
      fontSize: typography.fontSizes.md,
    },
  });

// ============================================================================
// USER PREFERENCES STYLES FACTORY
// ============================================================================

export const createUserPreferencesStyles = (
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): UserPreferencesStyles =>
  StyleSheet.create({
    section: {
      padding: spacing.lg,
      borderRadius: radii.md,
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
      marginBottom: spacing.md,
    },
    preferenceItem: {
      marginBottom: spacing.sm,
    },
  });
