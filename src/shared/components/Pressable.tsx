/**
 * Pressable Primitive Component
 *
 * Themed pressable component with press states from the theme.
 * Use this instead of raw TouchableOpacity when you need theme-aware interactions.
 *
 * ❌ <TouchableOpacity style={{ backgroundColor: colors.primary }}>
 * ✅ <Pressable bg="primary" pressedBg="primaryHover">
 *
 * @example
 * <Pressable
 *   bg="surface"
 *   pressedBg="surfaceHovered"
 *   padding="md"
 *   radius="lg"
 *   onPress={handlePress}
 * >
 *   <Text>Press me</Text>
 * </Pressable>
 */

import React, { ReactNode, useCallback, useState } from 'react';
import {
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../theme/designTokens';
import { A11Y_ROLE, TOUCH_OPACITY } from '../constants';

// ============================================================================
// TYPES
// ============================================================================

export type PressableBackgroundColor =
  | 'background'
  | 'backgroundPrimary'
  | 'backgroundSecondary'
  | 'surface'
  | 'surfaceLight'
  | 'surfaceHovered'
  | 'surfacePressed'
  | 'primary'
  | 'primaryHover'
  | 'primaryActive'
  | 'primaryLight'
  | 'primaryAlpha10'
  | 'primaryAlpha20'
  | 'secondary'
  | 'secondaryHover'
  | 'secondaryLight'
  | 'accent'
  | 'accentHover'
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
  | 'borderFocus'
  | 'primary'
  | 'secondary'
  | 'transparent';

export interface PressableProps {
  /** Children elements */
  children?: ReactNode;
  /** Press handler */
  onPress?: (event: GestureResponderEvent) => void;
  /** Long press handler */
  onLongPress?: (event: GestureResponderEvent) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Background color from theme */
  bg?: PressableBackgroundColor;
  /** Background color when pressed */
  pressedBg?: PressableBackgroundColor;
  /** Padding (all sides) */
  padding?: SpacingKey;
  /** Padding horizontal */
  paddingX?: SpacingKey;
  /** Padding vertical */
  paddingY?: SpacingKey;
  /** Border radius */
  radius?: RadiusKey;
  /** Border width */
  borderWidth?: BorderWidthKey;
  /** Border color from theme */
  borderColor?: BorderColor;
  /** Gap between children */
  gap?: SpacingKey;
  /** Flex direction */
  direction?: 'row' | 'column';
  /** Align items */
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
  /** Justify content */
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  /** Flex value */
  flex?: number;
  /** Active opacity (how transparent when pressed) */
  activeOpacity?: number;
  /** Additional styles */
  style?: StyleProp<ViewStyle>;
  /** Test ID */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
  /** Accessibility role */
  accessibilityRole?: 'button' | 'link' | 'menuitem' | 'tab';
}

// ============================================================================
// COMPONENT
// ============================================================================

/* eslint-disable max-lines-per-function, complexity */
export const Pressable: React.FC<PressableProps> = ({
  children,
  onPress,
  onLongPress,
  disabled = false,
  bg,
  pressedBg,
  padding,
  paddingX,
  paddingY,
  radius,
  borderWidth,
  borderColor,
  gap,
  direction,
  align,
  justify,
  flex,
  activeOpacity = TOUCH_OPACITY.default,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = A11Y_ROLE.BUTTON,
}) => {
  const { colors } = useTheme();
  const [isPressed, setIsPressed] = useState(false);

  // Background color map
  const bgColorMap: Record<string, string | undefined> = {
    background: colors.background,
    backgroundPrimary: colors.backgroundPrimary,
    backgroundSecondary: colors.backgroundSecondary,
    surface: colors.surface,
    surfaceLight: colors.surfaceLight,
    surfaceHovered: colors.surfaceHovered,
    surfacePressed: colors.surfacePressed,
    primary: colors.primary,
    primaryHover: colors.primaryHover,
    primaryActive: colors.primaryActive,
    primaryLight: colors.primaryLight,
    primaryAlpha10: colors.primaryAlpha10,
    primaryAlpha20: colors.primaryAlpha20,
    secondary: colors.secondary,
    secondaryHover: colors.secondaryHover,
    secondaryLight: colors.secondaryLight,
    accent: colors.accent,
    accentHover: colors.accentHover,
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
    borderFocus: colors.borderFocus,
    primary: colors.primary,
    secondary: colors.secondary,
  };

  // Get background color from theme
  const getBackgroundColor = (colorKey?: PressableBackgroundColor): string | undefined => {
    if (!colorKey || colorKey === 'none') {
      return undefined;
    }
    if (colorKey === 'transparent') {
      return 'transparent';
    }
    return bgColorMap[colorKey];
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

  // Determine current background based on press state
  const currentBg = isPressed && pressedBg ? pressedBg : bg;

  // Build computed style
  const computedStyle: ViewStyle = {
    // Background
    ...(currentBg && { backgroundColor: getBackgroundColor(currentBg) }),

    // Padding
    ...(padding !== undefined && { padding: designTokens.spacing[padding] }),
    ...(paddingX !== undefined && { paddingHorizontal: designTokens.spacing[paddingX] }),
    ...(paddingY !== undefined && { paddingVertical: designTokens.spacing[paddingY] }),

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

    // Disabled state
    ...(disabled && { opacity: designTokens.opacity.disabled }),
  };

  // Flatten style prop
  const flattenedStyle = style ? StyleSheet.flatten(style) : undefined;

  // Press handlers for visual feedback
  const handlePressIn = useCallback(() => {
    setIsPressed(true);
  }, []);

  const handlePressOut = useCallback(() => {
    setIsPressed(false);
  }, []);

  return (
    <TouchableOpacity
      style={[computedStyle, flattenedStyle]}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={activeOpacity}
      testID={testID}
      accessible
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
    >
      {children}
    </TouchableOpacity>
  );
};
/* eslint-enable max-lines-per-function, complexity */

export default Pressable;
