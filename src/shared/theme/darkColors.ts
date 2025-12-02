/**
 * Dark Theme Colors
 * Dark mode color palette for SDA Master Guide
 */

export const darkColors = {
  // Primary (SDA Brand - adjusted for dark mode)
  primary: '#BB86FC',          // Lighter purple for dark backgrounds
  primaryLight: '#DDB3FF',
  primaryDark: '#9965D4',
  primaryAlpha10: 'rgba(187, 134, 252, 0.1)',
  primaryAlpha20: 'rgba(187, 134, 252, 0.2)',

  // Secondary (Complementary - adjusted for dark mode)
  secondary: '#03DAC6',        // Teal for dark mode
  secondaryLight: '#66FFF9',
  secondaryDark: '#00A896',
  secondaryAlpha10: 'rgba(3, 218, 198, 0.1)',
  secondaryAlpha20: 'rgba(3, 218, 198, 0.2)',

  // Accent (Call-to-Action)
  accent: '#CF6679',           // Pinkish red for dark mode
  accentLight: '#FF94A9',
  accentDark: '#9A4F5F',

  // Neutral/Gray Scale (inverted for dark mode)
  gray50: '#E8E8E8',           // Light text on dark
  gray100: '#CFCFCF',
  gray200: '#B3B3B3',
  gray300: '#999999',
  gray400: '#808080',
  gray500: '#666666',
  gray600: '#4D4D4D',
  gray700: '#333333',
  gray800: '#1F1F1F',          // Darker backgrounds
  gray900: '#121212',          // Darkest background

  // Status Colors (adjusted for dark mode)
  success: '#4CAF50',
  successLight: '#80E27E',
  successDark: '#087F23',
  successAlpha10: 'rgba(76, 175, 80, 0.1)',
  successAlpha20: 'rgba(76, 175, 80, 0.2)',

  warning: '#FFB74D',
  warningLight: '#FFE97D',
  warningDark: '#C88719',
  warningAlpha10: 'rgba(255, 183, 77, 0.1)',
  warningAlpha20: 'rgba(255, 183, 77, 0.2)',

  error: '#CF6679',
  errorLight: '#FF94A9',
  errorDark: '#9A4F5F',
  errorAlpha10: 'rgba(207, 102, 121, 0.1)',
  errorAlpha20: 'rgba(207, 102, 121, 0.2)',

  info: '#4FC3F7',
  infoLight: '#8BF6FF',
  infoDark: '#0093C4',
  infoAlpha10: 'rgba(79, 195, 247, 0.1)',
  infoAlpha20: 'rgba(79, 195, 247, 0.2)',

  // Semantic Colors (Dark Mode)
  background: '#121212',         // Main background
  backgroundPrimary: '#121212',  // Alias for background
  backgroundElevated: '#1F1F1F', // Elevated surfaces (cards, modals)
  backgroundSecondary: '#2C2C2C',// Secondary backgrounds
  backgroundTertiary: '#333333', // Tertiary backgrounds
  surface: '#1F1F1F',           // Surface color (cards)
  surfaceLight: '#2C2C2C',      // Lighter surface
  surfaceDark: '#181818',       // Darker surface
  inputBackground: '#2C2C2C',   // Input field background

  // Text Colors (Dark Mode)
  textPrimary: '#E8E8E8',       // Main text
  textSecondary: '#B3B3B3',     // Secondary text
  textTertiary: '#808080',      // Tertiary/disabled text
  textQuaternary: '#666666',    // Quaternary/very dim text
  textInverse: '#121212',       // Text on light backgrounds
  textOnPrimary: '#FFFFFF',     // Text on primary color
  textOnSecondary: '#000000',   // Text on secondary color

  // Border & Dividers
  border: '#333333',            // Default border
  borderLight: '#4D4D4D',       // Lighter border
  borderMedium: '#3D3D3D',      // Medium border
  borderDark: '#1F1F1F',        // Darker border
  divider: '#333333',           // Divider lines

  // Interactive States
  hover: 'rgba(187, 134, 252, 0.08)',
  pressed: 'rgba(187, 134, 252, 0.12)',
  focused: 'rgba(187, 134, 252, 0.12)',
  selected: 'rgba(187, 134, 252, 0.16)',
  disabled: 'rgba(255, 255, 255, 0.12)',

  // Shadows (darker for dark mode)
  shadowLight: 'rgba(0, 0, 0, 0.5)',
  shadowMedium: 'rgba(0, 0, 0, 0.6)',
  shadowDark: 'rgba(0, 0, 0, 0.7)',

  // Social Media Colors (same as light mode)
  whatsapp: '#25D366',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  instagram: '#E4405F',

  // Special
  overlay: 'rgba(0, 0, 0, 0.7)',
  backdrop: 'rgba(0, 0, 0, 0.5)',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
};

export type DarkColorKey = keyof typeof darkColors;

