/**
 * Theme colors interface for component styling
 * Matches the colors returned by useTheme() hook
 */
export interface ThemeColors {
  primary: string;
  primaryLight: string;
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
  success: string;
  error: string;
  [key: string]: string;
}
