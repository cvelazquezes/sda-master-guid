/**
 * Accessibility Utilities
 * Provides helpers for WCAG 2.1 AA compliance following Google/Apple accessibility guidelines
 */

import { Platform, AccessibilityInfo, type AccessibilityProps } from 'react-native';
import { PLATFORM_OS } from '../constants/app';
import { LOCALE, DATE_FORMAT, STRING_JOINER } from '../constants/locale';
import { COLOR, WCAG, TOUCH_TARGET, SPACING, MATH } from '../constants/numbers';
import {
  A11Y_ROLE,
  A11Y_ALERT_TYPE,
  A11Y_LABEL,
  A11Y_NUMBER_LABEL,
  type A11Y_CHECKED,
  type AccessibilityRoleType,
  type A11yAlertType,
} from '../constants/ui';

// ============================================================================
// Accessibility Role Mapping (derived from A11Y_ROLE constants)
// ============================================================================

export type AccessibilityRole = AccessibilityRoleType;

// ============================================================================
// Accessibility State
// ============================================================================

export type AccessibilityState = {
  disabled?: boolean;
  selected?: boolean;
  checked?: boolean | typeof A11Y_CHECKED.MIXED;
  busy?: boolean;
  expanded?: boolean;
};

// ============================================================================
// Common Accessibility Props
// ============================================================================

/**
 * Creates accessibility props for a button
 */
export function createButtonA11yProps(
  label: string,
  options?: {
    disabled?: boolean;
    hint?: string;
    role?: AccessibilityRole;
  }
): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: options?.role || A11Y_ROLE.BUTTON,
    accessibilityLabel: label,
    accessibilityHint: options?.hint,
    accessibilityState: {
      disabled: options?.disabled || false,
    },
  };
}

/**
 * Creates accessibility props for a link
 */
export function createLinkA11yProps(
  label: string,
  options?: {
    hint?: string;
  }
): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: A11Y_ROLE.LINK,
    accessibilityLabel: label,
    accessibilityHint: options?.hint,
  };
}

/**
 * Creates accessibility props for an input field
 */
export function createInputA11yProps(
  label: string,
  options?: {
    required?: boolean;
    error?: string;
    value?: string;
    placeholder?: string;
  }
): AccessibilityProps {
  let hint = options?.placeholder;

  if (options?.required) {
    hint = hint ? `${hint} ${A11Y_LABEL.REQUIRED_SUFFIX}` : A11Y_LABEL.REQUIRED_FIELD;
  }

  if (options?.error) {
    hint = options.error;
  }

  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityValue: options?.value ? { text: options.value } : undefined,
  };
}

/**
 * Creates accessibility props for a checkbox
 */
export function createCheckboxA11yProps(
  label: string,
  checked: boolean,
  options?: {
    disabled?: boolean;
    hint?: string;
  }
): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: A11Y_ROLE.CHECKBOX,
    accessibilityLabel: label,
    accessibilityHint: options?.hint,
    accessibilityState: {
      checked,
      disabled: options?.disabled || false,
    },
  };
}

/**
 * Creates accessibility props for a switch/toggle
 */
export function createSwitchA11yProps(
  label: string,
  value: boolean,
  options?: {
    disabled?: boolean;
    hint?: string;
  }
): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: A11Y_ROLE.SWITCH,
    accessibilityLabel: label,
    accessibilityHint: options?.hint,
    accessibilityState: {
      checked: value,
      disabled: options?.disabled || false,
    },
  };
}

/**
 * Creates accessibility props for a radio button
 */
export function createRadioA11yProps(
  label: string,
  selected: boolean,
  options?: {
    disabled?: boolean;
    hint?: string;
  }
): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: A11Y_ROLE.RADIO,
    accessibilityLabel: label,
    accessibilityHint: options?.hint,
    accessibilityState: {
      selected,
      disabled: options?.disabled || false,
    },
  };
}

/**
 * Creates accessibility props for a header
 */
export function createHeaderA11yProps(label: string, level: number = 1): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: A11Y_ROLE.HEADER,
    accessibilityLabel: label,
    accessibilityHint: A11Y_LABEL.HEADING_LEVEL(level),
  };
}

/**
 * Creates accessibility props for an image
 */
export function createImageA11yProps(
  altText: string,
  options?: {
    decorative?: boolean;
  }
): AccessibilityProps {
  if (options?.decorative) {
    return {
      accessible: false,
    };
  }

  return {
    accessible: true,
    accessibilityRole: A11Y_ROLE.IMAGE,
    accessibilityLabel: altText,
  };
}

/**
 * Creates accessibility props for a loading indicator
 */
export function createLoadingA11yProps(message: string = A11Y_LABEL.LOADING): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: A11Y_ROLE.PROGRESSBAR,
    accessibilityLabel: message,
    accessibilityState: {
      busy: true,
    },
  };
}

/**
 * Creates accessibility props for an alert/notification
 */
export function createAlertA11yProps(
  message: string,
  type: A11yAlertType = A11Y_ALERT_TYPE.INFO
): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: A11Y_ROLE.ALERT,
    accessibilityLabel: A11Y_LABEL.ALERT_MESSAGE(type, message),
    accessibilityLiveRegion: 'assertive',
  };
}

/**
 * Creates accessibility props for a tab
 */
export function createTabA11yProps(
  label: string,
  selected: boolean,
  index: number,
  total: number
): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: A11Y_ROLE.TAB,
    accessibilityLabel: A11Y_LABEL.TAB_POSITION(label, index, total),
    accessibilityState: {
      selected,
    },
  };
}

// ============================================================================
// Semantic Helpers
// ============================================================================

/**
 * Combines multiple text strings into a single accessibility label
 */
export function combineA11yLabel(...parts: Array<string | undefined | null>): string {
  return parts.filter(Boolean).join(STRING_JOINER.COMMA_SPACE);
}

/**
 * Formats a number for screen readers
 */
export function formatNumberA11y(value: number): string {
  if (value >= MATH.MILLION) {
    return `${(value / MATH.MILLION).toFixed(1)} ${A11Y_NUMBER_LABEL.MILLION}`;
  }
  if (value >= MATH.THOUSAND) {
    return `${(value / MATH.THOUSAND).toFixed(1)} ${A11Y_NUMBER_LABEL.THOUSAND}`;
  }
  return value.toString();
}

/**
 * Formats a date for screen readers
 */
export function formatDateA11y(date: Date): string {
  return date.toLocaleDateString(LOCALE.EN_US, DATE_FORMAT.FULL_DATE);
}

/**
 * Formats a time for screen readers
 */
export function formatTimeA11y(date: Date): string {
  return date.toLocaleTimeString(LOCALE.EN_US, DATE_FORMAT.TIME_12H);
}

/**
 * Creates a descriptive label for a list item
 */
export function createListItemA11y(
  title: string,
  index: number,
  total: number,
  description?: string
): string {
  return A11Y_LABEL.ITEM_POSITION(title, index, total, description);
}

// ============================================================================
// Touch Target Helpers
// ============================================================================

export const MINIMUM_TOUCH_TARGET = TOUCH_TARGET.STANDARD;

/**
 * Ensures minimum touch target size
 */
export function getMinimumTouchTarget(currentSize: number): {
  minWidth: number;
  minHeight: number;
} {
  const size = Math.max(currentSize, MINIMUM_TOUCH_TARGET);
  return {
    minWidth: size,
    minHeight: size,
  };
}

/**
 * Creates hit slop for better touch targets
 */
export function createHitSlop(size: number = SPACING.XS): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} {
  return {
    top: size,
    bottom: size,
    left: size,
    right: size,
  };
}

// ============================================================================
// Focus Management
// ============================================================================

/**
 * Announces a message to screen readers
 */
export function announceForAccessibility(message: string): void {
  if (Platform.OS === PLATFORM_OS.IOS || Platform.OS === PLATFORM_OS.ANDROID) {
    AccessibilityInfo.announceForAccessibility(message);
  }
}

/**
 * Checks if screen reader is enabled
 */
export async function isScreenReaderEnabled(): Promise<boolean> {
  if (Platform.OS === PLATFORM_OS.WEB) {
    return false; // Not available on web
  }

  return await AccessibilityInfo.isScreenReaderEnabled();
}

// ============================================================================
// Color Contrast Helpers
// ============================================================================

/**
 * Calculates relative luminance of a color
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const { MAX_RGB } = COLOR;
  const {
    RED: RED_COEFFICIENT,
    GREEN: GREEN_COEFFICIENT,
    BLUE: BLUE_COEFFICIENT,
    THRESHOLD,
    LINEAR_SCALE,
    GAMMA,
    OFFSET,
    DENOMINATOR,
  } = WCAG.LUMINANCE;

  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / MAX_RGB;
    return sRGB <= THRESHOLD ? sRGB / LINEAR_SCALE : Math.pow((sRGB + OFFSET) / DENOMINATOR, GAMMA);
  });
  return RED_COEFFICIENT * rs + GREEN_COEFFICIENT * gs + BLUE_COEFFICIENT * bs;
}

/** Luminance offset for contrast calculation per WCAG */
const LUMINANCE_OFFSET = 0.05;

/**
 * Calculates contrast ratio between two colors
 */
export function getContrastRatio(
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number }
): number {
  const l1 = getRelativeLuminance(color1.r, color1.g, color1.b);
  const l2 = getRelativeLuminance(color2.r, color2.g, color2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + LUMINANCE_OFFSET) / (darker + LUMINANCE_OFFSET);
}

/**
 * Checks if contrast ratio meets WCAG AA standard
 */
export function meetsWCAGAA(contrastRatio: number, isLargeText: boolean = false): boolean {
  return isLargeText
    ? contrastRatio >= WCAG.CONTRAST.AA_LARGE
    : contrastRatio >= WCAG.CONTRAST.AA_NORMAL;
}

/**
 * Checks if contrast ratio meets WCAG AAA standard
 */
export function meetsWCAGAAA(contrastRatio: number, isLargeText: boolean = false): boolean {
  return isLargeText
    ? contrastRatio >= WCAG.CONTRAST.AAA_LARGE
    : contrastRatio >= WCAG.CONTRAST.AAA_NORMAL;
}

// ============================================================================
// Testing Helpers
// ============================================================================

/**
 * Gets testID for component testing
 */
export function getTestID(id: string): { testID: string } {
  return { testID: id };
}

/**
 * Combines accessibility props with testID
 */
export function createA11yProps(
  a11yProps: AccessibilityProps,
  testID?: string
): AccessibilityProps & { testID?: string } {
  return {
    ...a11yProps,
    ...(testID ? { testID } : {}),
  };
}
