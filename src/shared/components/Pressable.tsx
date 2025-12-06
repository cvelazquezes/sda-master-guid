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

import React, { ReactNode, useCallback, useState, useMemo } from 'react';
import {
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { designTokens } from '../theme/designTokens';
import { useThemeColor } from '../hooks/useThemeColor';
import { A11Y_ROLE, TOUCH_OPACITY } from '../constants';
import {
  InteractiveBackgroundColor,
  PressableBorderColor,
  SpacingKey,
  RadiusKey,
  BorderWidthKey,
} from '../types/theme';

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
  bg?: InteractiveBackgroundColor;
  /** Background color when pressed */
  pressedBg?: InteractiveBackgroundColor;
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
  borderColor?: PressableBorderColor;
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

// eslint-disable-next-line complexity -- Pressable component requires many conditional style and press state props
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
  // Use centralized theme color hook
  const { getInteractiveBackgroundColor, getPressableBorderColor } = useThemeColor();
  const [isPressed, setIsPressed] = useState(false);

  // Determine current background based on press state
  const currentBg = isPressed && pressedBg ? pressedBg : bg;

  // Build computed style (memoized for performance)
  const computedStyle = useMemo<ViewStyle>(
    // eslint-disable-next-line complexity -- Style object requires many conditional props
    () => ({
      // Background
      ...(currentBg && { backgroundColor: getInteractiveBackgroundColor(currentBg) }),

      // Padding
      ...(padding !== undefined && { padding: designTokens.spacing[padding] }),
      ...(paddingX !== undefined && { paddingHorizontal: designTokens.spacing[paddingX] }),
      ...(paddingY !== undefined && { paddingVertical: designTokens.spacing[paddingY] }),

      // Border
      ...(radius !== undefined && { borderRadius: designTokens.borderRadius[radius] }),
      ...(borderWidth !== undefined && { borderWidth: designTokens.borderWidth[borderWidth] }),
      ...(borderColor && { borderColor: getPressableBorderColor(borderColor) }),

      // Layout
      ...(gap !== undefined && { gap: designTokens.spacing[gap] }),
      ...(direction && { flexDirection: direction }),
      ...(align && { alignItems: align }),
      ...(justify && { justifyContent: justify }),
      ...(flex !== undefined && { flex }),

      // Disabled state
      ...(disabled && { opacity: designTokens.opacity.disabled }),
    }),
    [
      currentBg,
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
      disabled,
      getInteractiveBackgroundColor,
      getPressableBorderColor,
    ]
  );

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

export default Pressable;
