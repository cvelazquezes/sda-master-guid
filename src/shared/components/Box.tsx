/**
 * Box Primitive Component
 *
 * Themed View wrapper that provides background colors from the theme.
 * Use this instead of raw View when you need theme-aware backgrounds.
 *
 * ❌ <View style={{ backgroundColor: colors.surface }}>
 * ✅ <Box bg="surface">
 *
 * @example
 * <Box bg="surface" padding="md" radius="lg">
 *   <Text>Content</Text>
 * </Box>
 */

import React, { ReactNode } from 'react';
import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../theme/designTokens';

// ============================================================================
// TYPES
// ============================================================================

export type BackgroundColor =
  | 'background'
  | 'backgroundPrimary'
  | 'backgroundSecondary'
  | 'backgroundTertiary'
  | 'backgroundElevated'
  | 'surface'
  | 'surfaceLight'
  | 'surfaceDark'
  | 'primary'
  | 'primaryLight'
  | 'secondary'
  | 'secondaryLight'
  | 'accent'
  | 'accentLight'
  | 'success'
  | 'successLight'
  | 'warning'
  | 'warningLight'
  | 'error'
  | 'errorLight'
  | 'info'
  | 'infoLight'
  | 'transparent'
  | 'none';

export type SpacingKey = keyof typeof designTokens.spacing;
export type RadiusKey = keyof typeof designTokens.borderRadius;
export type BorderWidthKey = keyof typeof designTokens.borderWidth;

export type BorderColor =
  | 'border'
  | 'borderLight'
  | 'borderMedium'
  | 'borderDark'
  | 'borderFocus'
  | 'borderError'
  | 'borderSuccess'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'error'
  | 'success'
  | 'warning'
  | 'info'
  | 'transparent';

export interface BoxProps {
  /** Children elements */
  children?: ReactNode;
  /** Background color from theme */
  bg?: BackgroundColor;
  /** Padding (all sides) */
  padding?: SpacingKey;
  /** Padding horizontal */
  paddingX?: SpacingKey;
  /** Padding vertical */
  paddingY?: SpacingKey;
  /** Padding top */
  paddingTop?: SpacingKey;
  /** Padding bottom */
  paddingBottom?: SpacingKey;
  /** Padding left */
  paddingLeft?: SpacingKey;
  /** Padding right */
  paddingRight?: SpacingKey;
  /** Margin (all sides) */
  margin?: SpacingKey;
  /** Margin horizontal */
  marginX?: SpacingKey;
  /** Margin vertical */
  marginY?: SpacingKey;
  /** Margin top */
  marginTop?: SpacingKey;
  /** Margin bottom */
  marginBottom?: SpacingKey;
  /** Margin left */
  marginLeft?: SpacingKey;
  /** Margin right */
  marginRight?: SpacingKey;
  /** Border radius */
  radius?: RadiusKey;
  /** Border width */
  borderWidth?: BorderWidthKey;
  /** Border color from theme */
  borderColor?: BorderColor;
  /** Gap between children (for flex containers) */
  gap?: SpacingKey;
  /** Flex direction */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /** Align items */
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  /** Justify content */
  justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  /** Flex value */
  flex?: number;
  /** Flex wrap */
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  /** Additional styles (use sparingly - prefer props) */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/* eslint-disable max-lines-per-function, complexity */
export const Box: React.FC<BoxProps> = ({
  children,
  bg,
  padding,
  paddingX,
  paddingY,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  margin,
  marginX,
  marginY,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  radius,
  borderWidth,
  borderColor,
  gap,
  direction,
  align,
  justify,
  flex,
  wrap,
  style,
  testID,
  accessibilityLabel,
}) => {
  const { colors } = useTheme();

  // Background color map
  const bgColorMap: Record<string, string | undefined> = {
    background: colors.background,
    backgroundPrimary: colors.backgroundPrimary,
    backgroundSecondary: colors.backgroundSecondary,
    backgroundTertiary: colors.backgroundTertiary,
    backgroundElevated: colors.backgroundElevated,
    surface: colors.surface,
    surfaceLight: colors.surfaceLight,
    surfaceDark: colors.surfaceDark,
    primary: colors.primary,
    primaryLight: colors.primaryLight,
    secondary: colors.secondary,
    secondaryLight: colors.secondaryLight,
    accent: colors.accent,
    accentLight: colors.accentLight,
    success: colors.success,
    successLight: colors.successLight,
    warning: colors.warning,
    warningLight: colors.warningLight,
    error: colors.error,
    errorLight: colors.errorLight,
    info: colors.info,
    infoLight: colors.infoLight,
  };

  // Border color map
  const borderColorMap: Record<string, string | undefined> = {
    border: colors.border,
    borderLight: colors.borderLight,
    borderMedium: colors.borderMedium,
    borderDark: colors.borderDark,
    borderFocus: colors.borderFocus,
    borderError: colors.borderError,
    borderSuccess: colors.borderSuccess,
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
  };

  // Get background color from theme
  const getBackgroundColor = (): string | undefined => {
    if (!bg || bg === 'none') {
      return undefined;
    }
    if (bg === 'transparent') {
      return 'transparent';
    }
    return bgColorMap[bg];
  };

  // Get border color from theme
  const getBorderColor = (): string | undefined => {
    if (!borderColor) {
      return undefined;
    }
    if (borderColor === 'transparent') {
      return 'transparent';
    }
    return borderColorMap[borderColor];
  };

  // Build computed style
  const computedStyle: ViewStyle = {
    // Background
    ...(bg && { backgroundColor: getBackgroundColor() }),

    // Padding
    ...(padding !== undefined && { padding: designTokens.spacing[padding] }),
    ...(paddingX !== undefined && { paddingHorizontal: designTokens.spacing[paddingX] }),
    ...(paddingY !== undefined && { paddingVertical: designTokens.spacing[paddingY] }),
    ...(paddingTop !== undefined && { paddingTop: designTokens.spacing[paddingTop] }),
    ...(paddingBottom !== undefined && { paddingBottom: designTokens.spacing[paddingBottom] }),
    ...(paddingLeft !== undefined && { paddingLeft: designTokens.spacing[paddingLeft] }),
    ...(paddingRight !== undefined && { paddingRight: designTokens.spacing[paddingRight] }),

    // Margin
    ...(margin !== undefined && { margin: designTokens.spacing[margin] }),
    ...(marginX !== undefined && { marginHorizontal: designTokens.spacing[marginX] }),
    ...(marginY !== undefined && { marginVertical: designTokens.spacing[marginY] }),
    ...(marginTop !== undefined && { marginTop: designTokens.spacing[marginTop] }),
    ...(marginBottom !== undefined && { marginBottom: designTokens.spacing[marginBottom] }),
    ...(marginLeft !== undefined && { marginLeft: designTokens.spacing[marginLeft] }),
    ...(marginRight !== undefined && { marginRight: designTokens.spacing[marginRight] }),

    // Border
    ...(radius !== undefined && { borderRadius: designTokens.borderRadius[radius] }),
    ...(borderWidth !== undefined && { borderWidth: designTokens.borderWidth[borderWidth] }),
    ...(borderColor && { borderColor: getBorderColor() }),

    // Layout
    ...(gap !== undefined && { gap: designTokens.spacing[gap] }),
    ...(direction && { flexDirection: direction }),
    ...(align && { alignItems: align }),
    ...(justify && { justifyContent: justify }),
    ...(flex !== undefined && { flex }),
    ...(wrap && { flexWrap: wrap }),
  };

  // Flatten style prop
  const flattenedStyle = style ? StyleSheet.flatten(style) : undefined;

  return (
    <View
      style={[computedStyle, flattenedStyle]}
      testID={testID}
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
};
/* eslint-enable max-lines-per-function, complexity */

export default Box;
