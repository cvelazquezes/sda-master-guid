/**
 * Login Screen Styles
 * Uses factory pattern for theme-aware styles
 */
import { StyleSheet, type ViewStyle } from 'react-native';
import { FLEX, DIMENSIONS } from '../../../../shared/constants';
import type { ThemeContextType } from '../../../state/ThemeContext';

type LoginStyles = {
  safeArea: ViewStyle;
  container: ViewStyle;
  scrollContent: ViewStyle;
  form: ViewStyle;
};

export const createStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing']
): LoginStyles =>
  StyleSheet.create({
    safeArea: {
      flex: FLEX.ONE,
      backgroundColor: colors.background,
    },
    container: {
      flex: FLEX.ONE,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: FLEX.GROW_ENABLED,
      justifyContent: 'center',
      padding: spacing.lg,
    },
    form: {
      width: DIMENSIONS.WIDTH.FULL,
      gap: spacing.md,
    },
  });
