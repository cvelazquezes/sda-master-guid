/**
 * Layout Constants - Single Source of Truth for all style string values
 *
 * ============================================================================
 * THIS IS THE SINGLE SOURCE OF TRUTH FOR ALL LAYOUT STRING VALUES
 * ============================================================================
 *
 * All React Native style string values should be referenced from here.
 * This ensures type safety, consistency, and better IDE autocomplete.
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: flexDirection: 'row', alignItems: 'center'
 * ✅ ALWAYS use: flexDirection: layoutConstants.flexDirection.row
 *
 * NOTE: This file intentionally contains literal numbers as it DEFINES layout constants.
 *
 * @version 1.0.0
 */

import { FlexStyle, TextStyle, ImageStyle } from 'react-native';

/**
 * Flex Direction values
 */
export const flexDirection = {
  row: 'row' as FlexStyle['flexDirection'],
  column: 'column' as FlexStyle['flexDirection'],
  rowReverse: 'row-reverse' as FlexStyle['flexDirection'],
  columnReverse: 'column-reverse' as FlexStyle['flexDirection'],
} as const;

/**
 * Align Items values
 */
export const alignItems = {
  flexStart: 'flex-start' as FlexStyle['alignItems'],
  flexEnd: 'flex-end' as FlexStyle['alignItems'],
  center: 'center' as FlexStyle['alignItems'],
  stretch: 'stretch' as FlexStyle['alignItems'],
  baseline: 'baseline' as FlexStyle['alignItems'],
} as const;

/**
 * Align Self values
 */
export const alignSelf = {
  auto: 'auto' as FlexStyle['alignSelf'],
  flexStart: 'flex-start' as FlexStyle['alignSelf'],
  flexEnd: 'flex-end' as FlexStyle['alignSelf'],
  center: 'center' as FlexStyle['alignSelf'],
  stretch: 'stretch' as FlexStyle['alignSelf'],
  baseline: 'baseline' as FlexStyle['alignSelf'],
} as const;

/**
 * Justify Content values
 */
export const justifyContent = {
  flexStart: 'flex-start' as FlexStyle['justifyContent'],
  flexEnd: 'flex-end' as FlexStyle['justifyContent'],
  center: 'center' as FlexStyle['justifyContent'],
  spaceBetween: 'space-between' as FlexStyle['justifyContent'],
  spaceAround: 'space-around' as FlexStyle['justifyContent'],
  spaceEvenly: 'space-evenly' as FlexStyle['justifyContent'],
} as const;

/**
 * Position values
 */
export const position = {
  absolute: 'absolute' as FlexStyle['position'],
  relative: 'relative' as FlexStyle['position'],
} as const;

/**
 * Text Align values
 */
export const textAlign = {
  left: 'left' as TextStyle['textAlign'],
  right: 'right' as TextStyle['textAlign'],
  center: 'center' as TextStyle['textAlign'],
  justify: 'justify' as TextStyle['textAlign'],
  auto: 'auto' as TextStyle['textAlign'],
} as const;

/**
 * Text Align Vertical values (Android)
 */
export const textAlignVertical = {
  auto: 'auto' as TextStyle['textAlignVertical'],
  top: 'top' as TextStyle['textAlignVertical'],
  bottom: 'bottom' as TextStyle['textAlignVertical'],
  center: 'center' as TextStyle['textAlignVertical'],
} as const;

/**
 * Overflow values
 */
export const overflow = {
  hidden: 'hidden' as FlexStyle['overflow'],
  visible: 'visible' as FlexStyle['overflow'],
  scroll: 'scroll' as FlexStyle['overflow'],
} as const;

/**
 * Flex Wrap values
 */
export const flexWrap = {
  wrap: 'wrap' as FlexStyle['flexWrap'],
  nowrap: 'nowrap' as FlexStyle['flexWrap'],
  wrapReverse: 'wrap-reverse' as FlexStyle['flexWrap'],
} as const;

/**
 * Resize Mode values (for Images)
 */
export const resizeMode = {
  cover: 'cover' as ImageStyle['resizeMode'],
  contain: 'contain' as ImageStyle['resizeMode'],
  stretch: 'stretch' as ImageStyle['resizeMode'],
  center: 'center' as ImageStyle['resizeMode'],
  repeat: 'repeat' as ImageStyle['resizeMode'],
} as const;

/**
 * Font Style values
 */
export const fontStyle = {
  normal: 'normal' as TextStyle['fontStyle'],
  italic: 'italic' as TextStyle['fontStyle'],
} as const;

/**
 * Text Decoration Line values
 */
export const textDecorationLine = {
  none: 'none' as TextStyle['textDecorationLine'],
  underline: 'underline' as TextStyle['textDecorationLine'],
  lineThrough: 'line-through' as TextStyle['textDecorationLine'],
  underlineLineThrough: 'underline line-through' as TextStyle['textDecorationLine'],
} as const;

/**
 * Text Transform values
 */
export const textTransform = {
  none: 'none' as TextStyle['textTransform'],
  uppercase: 'uppercase' as TextStyle['textTransform'],
  lowercase: 'lowercase' as TextStyle['textTransform'],
  capitalize: 'capitalize' as TextStyle['textTransform'],
} as const;

/**
 * Display values
 */
export const display = {
  none: 'none' as FlexStyle['display'],
  flex: 'flex' as FlexStyle['display'],
} as const;

/**
 * Border Style values
 */
export const borderStyle = {
  solid: 'solid' as const,
  dotted: 'dotted' as const,
  dashed: 'dashed' as const,
} as const;

/**
 * Pointer Events values
 */
export const pointerEvents = {
  auto: 'auto' as const,
  none: 'none' as const,
  boxNone: 'box-none' as const,
  boxOnly: 'box-only' as const,
} as const;

/**
 * Backface Visibility values
 */
export const backfaceVisibility = {
  visible: 'visible' as const,
  hidden: 'hidden' as const,
} as const;

/**
 * Complete Layout Constants Export
 */
export const layoutConstants = {
  flexDirection,
  alignItems,
  alignSelf,
  justifyContent,
  position,
  textAlign,
  textAlignVertical,
  overflow,
  flexWrap,
  resizeMode,
  fontStyle,
  textDecorationLine,
  textTransform,
  display,
  borderStyle,
  pointerEvents,
  backfaceVisibility,
} as const;

export default layoutConstants;
