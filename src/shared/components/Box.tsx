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

import React, { ReactNode, useMemo } from 'react';
import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import { designTokens } from '../theme/designTokens';
import { useThemeColor } from '../hooks/useThemeColor';
import {
  BackgroundColor,
  BorderColor,
  SpacingKey,
  RadiusKey,
  BorderWidthKey,
} from '../types/theme';

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

// eslint-disable-next-line complexity -- Box component requires many conditional style props for flexibility
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
  // Use centralized theme color hook
  const { getBackgroundColor, getBorderColor } = useThemeColor();

  // Build computed style (memoized for performance)
  const computedStyle = useMemo<ViewStyle>(
    // eslint-disable-next-line complexity -- Style object requires many conditional props
    () => ({
      // Background
      ...(bg && { backgroundColor: getBackgroundColor(bg) }),

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
      ...(borderColor && { borderColor: getBorderColor(borderColor) }),

      // Layout
      ...(gap !== undefined && { gap: designTokens.spacing[gap] }),
      ...(direction && { flexDirection: direction }),
      ...(align && { alignItems: align }),
      ...(justify && { justifyContent: justify }),
      ...(flex !== undefined && { flex }),
      ...(wrap && { flexWrap: wrap }),
    }),
    [
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
      getBackgroundColor,
      getBorderColor,
    ]
  );

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

export default Box;
