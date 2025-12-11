/**
 * Midnight Blue Theme Colors (SDA Brand)
 * Dark mode color palette maintaining SDA brand identity
 * Uses SDA Blue as the primary color for a cohesive brand experience
 */

export const midnightBlueColors = {
  // Primary (SDA Blue - maintained for brand consistency in dark mode)
  primary: '#64B5F6', // Lighter SDA blue for dark backgrounds (300 shade)
  primaryLight: '#90CAF9', // Even lighter for highlights
  primaryDark: '#1976D2', // Original SDA blue for accents
  primaryMedium: '#42A5F5', // Medium shade
  primaryAlpha10: 'rgba(100, 181, 246, 0.10)',
  primaryAlpha20: 'rgba(100, 181, 246, 0.20)',
  primaryHover: '#90CAF9',
  primaryActive: '#42A5F5',

  // Secondary (Master Guide Red/Burgundy - adjusted for dark mode)
  secondary: '#EF9A9A', // Lighter red for dark backgrounds
  secondaryLight: '#FFCDD2',
  secondaryDark: '#C62828',
  secondaryMedium: '#E57373',
  secondaryAlpha10: 'rgba(239, 154, 154, 0.10)',
  secondaryAlpha20: 'rgba(239, 154, 154, 0.20)',
  secondaryHover: '#FFCDD2',
  secondaryActive: '#E57373',

  // Accent (Gold/Amber - SDA accent color adjusted for dark mode)
  accent: '#FFD54F', // Lighter gold for dark backgrounds
  accentLight: '#FFE082',
  accentDark: '#FDB913',
  accentMedium: '#FFCA28',
  accentAlpha10: 'rgba(255, 213, 79, 0.10)',
  accentAlpha20: 'rgba(255, 213, 79, 0.20)',
  accentHover: '#FFE082',

  // Neutral/Gray Scale (dark blue tinted grays)
  gray50: '#E3E8EF', // Light text on dark
  gray100: '#C9D1DC',
  gray200: '#A8B5C4',
  gray300: '#8795A8',
  gray400: '#6B7A8F',
  gray500: '#516178',
  gray600: '#3D4A5C',
  gray700: '#2A3544',
  gray800: '#1A2332', // Darker backgrounds with blue tint
  gray900: '#0D1520', // Darkest background with blue tint

  // Status Colors (adjusted for dark mode visibility)
  success: '#66BB6A', // Lighter green
  successLight: '#A5D6A7',
  successDark: '#43A047',
  successMedium: '#81C784',
  successAlpha10: 'rgba(102, 187, 106, 0.10)',
  successAlpha20: 'rgba(102, 187, 106, 0.20)',

  warning: '#FFCA28', // Brighter amber
  warningLight: '#FFE082',
  warningDark: '#FFA000',
  warningMedium: '#FFD54F',
  warningAlpha10: 'rgba(255, 202, 40, 0.10)',
  warningAlpha20: 'rgba(255, 202, 40, 0.20)',

  error: '#EF5350', // Lighter red for dark mode
  errorLight: '#EF9A9A',
  errorDark: '#D32F2F',
  errorMedium: '#E57373',
  errorAlpha10: 'rgba(239, 83, 80, 0.10)',
  errorAlpha20: 'rgba(239, 83, 80, 0.20)',

  info: '#4FC3F7', // Light blue
  infoLight: '#81D4FA',
  infoDark: '#0288D1',
  infoMedium: '#29B6F6',
  infoAlpha10: 'rgba(79, 195, 247, 0.10)',
  infoAlpha20: 'rgba(79, 195, 247, 0.20)',

  // Semantic Colors (Midnight Blue Theme)
  background: '#0D1520', // Deep navy background
  backgroundPrimary: '#0D1520',
  backgroundElevated: '#1A2332', // Elevated surfaces (cards, modals)
  backgroundSecondary: '#232F3E', // Secondary backgrounds
  backgroundTertiary: '#2A3544', // Tertiary backgrounds
  surface: '#1A2332', // Surface color (cards)
  surfaceLight: '#232F3E', // Lighter surface
  surfaceDark: '#0A1018', // Darker surface
  inputBackground: '#232F3E', // Input field background

  // Text Colors (optimized for dark blue backgrounds)
  textPrimary: '#E3E8EF', // Main text - high contrast
  textSecondary: '#A8B5C4', // Secondary text
  textTertiary: '#6B7A8F', // Tertiary/muted text
  textQuaternary: '#516178', // Very dim text
  textInverse: '#0D1520', // Text on light backgrounds
  textOnPrimary: '#FFFFFF', // Text on primary color
  textOnSecondary: '#0D1520', // Text on secondary color
  textDisabled: '#516178',
  textOnAccent: '#0D1520',

  // Border & Dividers (blue-tinted)
  border: '#2A3544', // Default border
  borderLight: '#3D4A5C', // Lighter border
  borderMedium: '#324152', // Medium border
  borderDark: '#1A2332', // Darker border
  divider: '#2A3544', // Divider lines
  borderFocus: '#64B5F6',
  borderError: '#EF5350',
  borderSuccess: '#66BB6A',

  // Interactive States
  hover: 'rgba(100, 181, 246, 0.08)',
  pressed: 'rgba(100, 181, 246, 0.12)',
  focused: 'rgba(100, 181, 246, 0.12)',
  selected: 'rgba(100, 181, 246, 0.16)',
  disabled: 'rgba(255, 255, 255, 0.12)',

  // Shadows (darker for dark mode)
  shadowLight: 'rgba(0, 0, 0, 0.5)',
  shadowMedium: 'rgba(0, 0, 0, 0.6)',
  shadowDark: 'rgba(0, 0, 0, 0.7)',
  shadowHeavy: 'rgba(0, 0, 0, 0.7)',
  shadowXL: 'rgba(0, 0, 0, 0.8)',

  // Social Media Colors
  whatsapp: '#25D366',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  instagram: '#E4405F',

  // Special
  overlay: 'rgba(13, 21, 32, 0.8)',
  backdrop: 'rgba(13, 21, 32, 0.6)',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',

  // Interactive surface states
  surfaceHovered: '#2A3544',
  surfacePressed: '#324152',
  surfaceDisabled: '#1A2332',
  interactivePrimary: '#64B5F6',
  interactivePrimaryHover: '#90CAF9',
  interactivePrimaryActive: '#42A5F5',
  interactiveSecondary: '#EF9A9A',
  interactiveSecondaryHover: '#FFCDD2',
  interactiveSecondaryActive: '#E57373',
  interactiveDisabled: '#3D4A5C',

  // Additional semantic colors
  link: '#64B5F6',
  placeholder: '#6B7A8F',
  shadow: '#000000',
  backgroundModal: '#1A2332',
  backgroundOverlay: 'rgba(13, 21, 32, 0.8)',
  surfaceDefault: '#1A2332',
  surfaceSubdued: '#232F3E',
};

// =============================================================================
// MIDNIGHT BLUE THEME STATUS COLORS
// =============================================================================

export const midnightBlueStatusColors = {
  active: {
    primary: '#66BB6A',
    light: 'rgba(102, 187, 106, 0.15)',
    medium: 'rgba(102, 187, 106, 0.25)',
    text: '#A5D6A7',
    icon: 'check-circle',
  },
  inactive: {
    primary: '#EF5350',
    light: 'rgba(239, 83, 80, 0.15)',
    medium: 'rgba(239, 83, 80, 0.25)',
    text: '#EF9A9A',
    icon: 'cancel',
  },
  paused: {
    primary: '#FFCA28',
    light: 'rgba(255, 202, 40, 0.15)',
    medium: 'rgba(255, 202, 40, 0.25)',
    text: '#FFE082',
    icon: 'pause-circle',
  },
  pending: {
    primary: '#FFCA28',
    light: 'rgba(255, 202, 40, 0.15)',
    medium: 'rgba(255, 202, 40, 0.25)',
    text: '#FFE082',
    icon: 'clock-outline',
  },
  completed: {
    primary: '#66BB6A',
    light: 'rgba(102, 187, 106, 0.15)',
    medium: 'rgba(102, 187, 106, 0.25)',
    text: '#A5D6A7',
    icon: 'check-circle',
  },
  scheduled: {
    primary: '#4FC3F7',
    light: 'rgba(79, 195, 247, 0.15)',
    medium: 'rgba(79, 195, 247, 0.25)',
    text: '#81D4FA',
    icon: 'calendar-clock',
  },
  skipped: {
    primary: '#6B7A8F',
    light: 'rgba(107, 122, 143, 0.15)',
    medium: 'rgba(107, 122, 143, 0.25)',
    text: '#A8B5C4',
    icon: 'cancel',
  },
  cancelled: {
    primary: '#EF5350',
    light: 'rgba(239, 83, 80, 0.15)',
    medium: 'rgba(239, 83, 80, 0.25)',
    text: '#EF9A9A',
    icon: 'close-circle',
  },
} as const;

// =============================================================================
// MIDNIGHT BLUE THEME ROLE COLORS
// =============================================================================

export const midnightBlueRoleColors = {
  admin: {
    primary: '#EF5350',
    light: 'rgba(239, 83, 80, 0.15)',
    medium: 'rgba(239, 83, 80, 0.25)',
    text: '#EF9A9A',
    icon: 'shield-crown',
  },
  club_admin: {
    primary: '#FFCA28',
    light: 'rgba(255, 202, 40, 0.15)',
    medium: 'rgba(255, 202, 40, 0.25)',
    text: '#FFE082',
    icon: 'shield-account',
  },
  user: {
    primary: '#64B5F6',
    light: 'rgba(100, 181, 246, 0.15)',
    medium: 'rgba(100, 181, 246, 0.25)',
    text: '#90CAF9',
    icon: 'account',
  },
} as const;

export type MidnightBlueColorKey = keyof typeof midnightBlueColors;
