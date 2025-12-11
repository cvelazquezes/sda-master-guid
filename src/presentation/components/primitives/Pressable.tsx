/**
 * Pressable Primitive Component
 *
 * Themed pressable component with press states from the theme.
 * Use this instead of raw TouchableOpacity when you need theme-aware interactions.
 *
 * @example
 * <Pressable bg="surface" pressedBg="surfaceHovered" padding="md" radius="lg" onPress={handlePress}>
 *   <Text>Press me</Text>
 * </Pressable>
 */

import React, { useCallback, useState, useMemo, type ReactNode } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { A11Y_ROLE, TOUCH_OPACITY } from '../../../shared/constants';
import { useThemeColor } from '../../hooks/useThemeColor';
import { designTokens } from '../../theme/designTokens';
import type {
  BorderWidthKey,
  InteractiveBackgroundColor,
  PressableBorderColor,
  RadiusKey,
  SpacingKey,
} from '../../../shared/types/theme';

export type PressableProps = {
  children?: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  bg?: InteractiveBackgroundColor;
  pressedBg?: InteractiveBackgroundColor;
  padding?: SpacingKey;
  paddingX?: SpacingKey;
  paddingY?: SpacingKey;
  radius?: RadiusKey;
  borderWidth?: BorderWidthKey;
  borderColor?: PressableBorderColor;
  gap?: SpacingKey;
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  flex?: number;
  activeOpacity?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'link' | 'menuitem' | 'tab';
};

// Style builder helpers
type PaddingStyleInput = {
  padding?: SpacingKey;
  paddingX?: SpacingKey;
  paddingY?: SpacingKey;
};

type LayoutStyleInput = {
  gap?: SpacingKey;
  direction?: PressableProps['direction'];
  align?: PressableProps['align'];
  justify?: PressableProps['justify'];
  flex?: number;
};

function buildPaddingStyle(p: PaddingStyleInput): ViewStyle {
  return {
    ...(p.padding !== undefined && { padding: designTokens.spacing[p.padding] }),
    ...(p.paddingX !== undefined && { paddingHorizontal: designTokens.spacing[p.paddingX] }),
    ...(p.paddingY !== undefined && { paddingVertical: designTokens.spacing[p.paddingY] }),
  };
}

function buildLayoutStyle(l: LayoutStyleInput): ViewStyle {
  return {
    ...(l.gap !== undefined && { gap: designTokens.spacing[l.gap] }),
    ...(l.direction && { flexDirection: l.direction }),
    ...(l.align && { alignItems: l.align }),
    ...(l.justify && { justifyContent: l.justify }),
    ...(l.flex !== undefined && { flex: l.flex }),
  };
}

export const Pressable: React.FC<PressableProps> = (props) => {
  const {
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
  } = props;

  const { getInteractiveBackgroundColor, getPressableBorderColor } = useThemeColor();
  const [isPressed, setIsPressed] = useState(false);

  const currentBg = isPressed && pressedBg ? pressedBg : bg;

  const computedStyle = useMemo<ViewStyle>(() => {
    const paddingStyle = buildPaddingStyle({ padding, paddingX, paddingY });
    const layoutStyle = buildLayoutStyle({ gap, direction, align, justify, flex });
    return {
      ...(currentBg && { backgroundColor: getInteractiveBackgroundColor(currentBg) }),
      ...paddingStyle,
      ...(radius !== undefined && { borderRadius: designTokens.borderRadius[radius] }),
      ...(borderWidth !== undefined && { borderWidth: designTokens.borderWidth[borderWidth] }),
      ...(borderColor && { borderColor: getPressableBorderColor(borderColor) }),
      ...layoutStyle,
      ...(disabled && { opacity: designTokens.opacity.disabled }),
    };
  }, [
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
  ]);

  const flattenedStyle = style ? StyleSheet.flatten(style) : undefined;

  const handlePressIn = useCallback(() => setIsPressed(true), []);
  const handlePressOut = useCallback(() => setIsPressed(false), []);

  return (
    <TouchableOpacity
      accessible
      style={[computedStyle, flattenedStyle]}
      disabled={disabled}
      activeOpacity={activeOpacity}
      testID={testID}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {children}
    </TouchableOpacity>
  );
};

export default Pressable;
