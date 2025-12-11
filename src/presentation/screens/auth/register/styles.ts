/**
 * Register Screen Styles
 * Theme-aware style factories for all register-related components
 */
import { StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { FLEX, DIMENSIONS } from '../../../../shared/constants';
import type { ThemeContextType } from '../../../state/ThemeContext';

// ============================================================================
// SCREEN STYLES FACTORY
// ============================================================================

type RegisterScreenStyles = {
  safeArea: ViewStyle;
  container: ViewStyle;
  scrollContent: ViewStyle;
  form: ViewStyle;
};

export const createScreenStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing']
): RegisterScreenStyles =>
  StyleSheet.create({
    safeArea: {
      flex: FLEX.ONE,
      backgroundColor: colors.backgroundPrimary,
    },
    container: {
      flex: FLEX.ONE,
      backgroundColor: colors.backgroundPrimary,
    },
    scrollContent: {
      flexGrow: FLEX.ONE,
      padding: spacing.lg,
      paddingTop: spacing['3xl'],
    },
    form: {
      width: DIMENSIONS.MAX_WIDTH_PERCENT.FULL,
    },
  });

// ============================================================================
// SECTION STYLES FACTORY
// ============================================================================

export const createSectionStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  typography: ThemeContextType['typography']
): { header: ViewStyle; title: TextStyle; description: TextStyle } =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
      marginBottom: spacing.md,
      gap: spacing.sm,
    },
    title: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold,
      color: colors.primary,
    },
    description: {
      fontSize: typography.fontSizes.sm,
      color: colors.textSecondary,
      marginBottom: spacing.md,
      marginTop: -spacing.sm,
    },
  });

// ============================================================================
// ACCOUNT TYPE SECTION STYLES FACTORY
// ============================================================================

export const createAccountTypeStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): {
  checkboxContainer: ViewStyle;
  checkboxLabel: TextStyle;
  infoBox: ViewStyle;
  infoText: TextStyle;
} =>
  StyleSheet.create({
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
      paddingVertical: spacing.sm,
    },
    checkboxLabel: {
      fontSize: typography.fontSizes.md,
      marginLeft: spacing.md,
      color: colors.textPrimary,
    },
    infoBox: {
      flexDirection: 'row',
      backgroundColor: colors.infoAlpha20,
      borderRadius: radii.md,
      padding: spacing.md,
      marginBottom: spacing.lg,
      gap: spacing.md,
    },
    infoText: {
      fontSize: typography.fontSizes.sm,
      color: colors.textPrimary,
      flex: FLEX.ONE,
    },
  });

// ============================================================================
// HIERARCHY PICKER STYLES FACTORY
// ============================================================================

export const createHierarchyPickerStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): {
  container: ViewStyle;
  label: TextStyle;
  optionsList: ViewStyle;
  option: ViewStyle;
  optionSelected: ViewStyle;
  optionText: TextStyle;
} =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      marginBottom: spacing.md,
      color: colors.textPrimary,
    },
    optionsList: {
      maxHeight: DIMENSIONS.MAX_HEIGHT.LIST_SMALL,
      borderWidth: 1,
      borderColor: colors.borderMedium,
      borderRadius: radii.md,
      backgroundColor: colors.inputBackground,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    optionSelected: {
      backgroundColor: colors.primaryAlpha20,
    },
    optionText: {
      marginLeft: spacing.md,
      fontSize: typography.fontSizes.md,
      color: colors.textPrimary,
    },
  });

// ============================================================================
// CLUB PICKER STYLES FACTORY
// ============================================================================

export const createClubPickerStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): {
  container: ViewStyle;
  label: TextStyle;
  clubsList: ViewStyle;
  clubOption: ViewStyle;
  clubOptionSelected: ViewStyle;
  clubInfo: ViewStyle;
  clubName: TextStyle;
  clubDescription: TextStyle;
} =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      marginBottom: spacing.md,
      color: colors.textPrimary,
    },
    clubsList: {
      maxHeight: DIMENSIONS.MAX_HEIGHT.LIST_MEDIUM,
      borderWidth: 1,
      borderColor: colors.borderMedium,
      borderRadius: radii.md,
      backgroundColor: colors.inputBackground,
    },
    clubOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    clubOptionSelected: {
      backgroundColor: colors.primaryAlpha20,
    },
    clubInfo: {
      marginLeft: spacing.md,
      flex: FLEX.ONE,
    },
    clubName: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.bold,
      color: colors.textPrimary,
    },
    clubDescription: {
      fontSize: typography.fontSizes.sm,
      marginTop: spacing.xs,
      color: colors.textSecondary,
    },
  });

// ============================================================================
// CLASS SELECTION STYLES FACTORY
// ============================================================================

export const createClassSelectionStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing'],
  radii: ThemeContextType['radii'],
  typography: ThemeContextType['typography']
): { button: ViewStyle; buttonContent: ViewStyle; buttonText: TextStyle } =>
  StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: colors.borderLight,
      borderRadius: radii.md,
      marginBottom: spacing.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
      backgroundColor: colors.inputBackground,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      flex: FLEX.ONE,
    },
    buttonText: {
      fontSize: typography.fontSizes.md,
      flex: FLEX.ONE,
      color: colors.textPrimary,
    },
  });
