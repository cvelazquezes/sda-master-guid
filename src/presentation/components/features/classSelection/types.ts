/**
 * Theme colors interface for component styling
 * Matches the colors returned by useTheme() hook
 */
export type ThemeColors = {
  primary: string;
  primaryLight: string;
  primaryAlpha20?: string;
  surface: string;
  surfaceLight: string;
  background: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  border: string;
  info: string;
  infoLight: string;
  infoAlpha20?: string;
  success: string;
  error: string;
  [key: string]: string | undefined;
};
