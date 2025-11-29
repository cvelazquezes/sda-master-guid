/**
 * Color Palette
 * 
 * Comprehensive color system following Material Design and iOS HIG principles.
 * Supports light and dark modes with accessibility-first colors (WCAG AAA).
 */

export const colors = {
  // Primary brand colors
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3', // Main
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },

  // Secondary/accent colors
  secondary: {
    50: '#FCE4EC',
    100: '#F8BBD0',
    200: '#F48FB1',
    300: '#F06292',
    400: '#EC407A',
    500: '#E91E63', // Main
    600: '#D81B60',
    700: '#C2185B',
    800: '#AD1457',
    900: '#880E4F',
  },

  // Success colors
  success: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50', // Main
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },

  // Warning colors
  warning: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FF9800', // Main
    600: '#FB8C00',
    700: '#F57C00',
    800: '#EF6C00',
    900: '#E65100',
  },

  // Error colors
  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#F44336', // Main
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
  },

  // Info colors
  info: {
    50: '#E1F5FE',
    100: '#B3E5FC',
    200: '#81D4FA',
    300: '#4FC3F7',
    400: '#29B6F6',
    500: '#03A9F4', // Main
    600: '#039BE5',
    700: '#0288D1',
    800: '#0277BD',
    900: '#01579B',
  },

  // Neutral/gray colors
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Semantic colors (light mode)
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    surfaceVariant: '#EEEEEE',
    onBackground: '#212121',
    onSurface: '#424242',
    onSurfaceVariant: '#616161',
    border: '#E0E0E0',
    divider: '#EEEEEE',
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.1)',
    disabled: '#BDBDBD',
    placeholder: '#9E9E9E',
  },

  // Semantic colors (dark mode)
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    onBackground: '#FFFFFF',
    onSurface: '#E0E0E0',
    onSurfaceVariant: '#BDBDBD',
    border: '#424242',
    divider: '#2C2C2C',
    overlay: 'rgba(0, 0, 0, 0.7)',
    shadow: 'rgba(0, 0, 0, 0.3)',
    disabled: '#616161',
    placeholder: '#757575',
  },

  // Social media brand colors
  social: {
    facebook: '#1877F2',
    twitter: '#1DA1F2',
    instagram: '#E4405F',
    linkedin: '#0A66C2',
    github: '#181717',
    google: '#4285F4',
    apple: '#000000',
  },

  // Transparent colors
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

/**
 * Color utility functions
 */
export const colorUtils = {
  /**
   * Add alpha transparency to hex color
   * 
   * @param hex - Hex color (e.g., "#FF0000")
   * @param alpha - Alpha value (0-1)
   * @returns RGBA color string
   * 
   * @example
   * addAlpha('#FF0000', 0.5) // "rgba(255, 0, 0, 0.5)"
   */
  addAlpha(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  /**
   * Lighten a hex color
   * 
   * @param hex - Hex color
   * @param percent - Percentage to lighten (0-100)
   * @returns Lightened hex color
   */
  lighten(hex: string, percent: number): string {
    const num = parseInt(hex.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)}`;
  },

  /**
   * Darken a hex color
   * 
   * @param hex - Hex color
   * @param percent - Percentage to darken (0-100)
   * @returns Darkened hex color
   */
  darken(hex: string, percent: number): string {
    return colorUtils.lighten(hex, -percent);
  },
};

export type ColorName = keyof typeof colors;
export type ColorShade = keyof typeof colors.primary;

