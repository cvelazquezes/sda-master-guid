/**
 * Layout Design Tokens
 * 
 * Breakpoints, grid system, density, and responsive layout configurations.
 * These tokens drive ALL layout decisions across the entire codebase.
 * 
 * ❌ NEVER write: width < 768, isCompact = width < 500
 * ✅ ALWAYS use: width < layoutTokens.breakpoints.sm
 */

import { Dimensions } from 'react-native';

// ============================================================================
// BREAKPOINT TOKENS
// ============================================================================

/**
 * Responsive breakpoints
 * Used for ALL responsive logic throughout the app
 * 
 * @example
 * // ❌ BAD
 * const isTablet = width >= 768;
 * 
 * // ✅ GOOD
 * const isTablet = width >= breakpointTokens.md;
 */
export const breakpointTokens = {
  /** Extra small devices (phones in portrait) */
  xs: 0,
  /** Small devices (phones in landscape, small tablets) */
  sm: 480,
  /** Medium devices (tablets) */
  md: 768,
  /** Large devices (tablets landscape, small laptops) */
  lg: 1024,
  /** Extra large devices (desktops) */
  xl: 1280,
  /** Extra extra large (large desktops) */
  '2xl': 1536,
} as const;

// ============================================================================
// DENSITY TOKENS
// ============================================================================

/**
 * UI Density configurations
 * Controls compact vs comfortable vs spacious layouts
 * 
 * @example
 * const density = useLayoutDensity();
 * const padding = densityTokens[density].cardPadding;
 */
export const densityTokens = {
  /** Compact density - for data-dense screens */
  compact: {
    cardPadding: 12,
    listItemPadding: 8,
    listItemHeight: 48,
    iconSize: 18,
    buttonHeight: 36,
    inputHeight: 40,
    sectionGap: 16,
    screenPadding: 12,
  },
  /** Comfortable density - default for most screens */
  comfortable: {
    cardPadding: 16,
    listItemPadding: 12,
    listItemHeight: 56,
    iconSize: 20,
    buttonHeight: 48,
    inputHeight: 48,
    sectionGap: 24,
    screenPadding: 16,
  },
  /** Spacious density - for relaxed, content-focused screens */
  spacious: {
    cardPadding: 24,
    listItemPadding: 16,
    listItemHeight: 72,
    iconSize: 24,
    buttonHeight: 56,
    inputHeight: 56,
    sectionGap: 32,
    screenPadding: 24,
  },
} as const;

export type DensityMode = keyof typeof densityTokens;

// ============================================================================
// GRID TOKENS
// ============================================================================

/**
 * Grid system configuration
 * Use for layout grids, card grids, and column layouts
 */
export const gridTokens = {
  /** Number of columns at each breakpoint */
  columns: {
    xs: 4,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 12,
    '2xl': 12,
  },
  /** Gap between grid items at each breakpoint */
  gap: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 24,
  },
  /** Margin around the grid container */
  margin: {
    xs: 16,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
    '2xl': 64,
  },
  /** Maximum content width */
  maxWidth: {
    sm: 540,
    md: 720,
    lg: 960,
    xl: 1140,
    '2xl': 1320,
  },
} as const;

// ============================================================================
// CONTAINER TOKENS
// ============================================================================

/**
 * Container/wrapper configurations
 */
export const containerTokens = {
  /** Maximum content width for screens */
  maxWidth: 1200,
  /** Horizontal padding for screen containers */
  paddingHorizontal: {
    xs: 16,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
  /** Vertical padding for screen containers */
  paddingVertical: {
    xs: 16,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
} as const;

// ============================================================================
// NAVIGATION TOKENS
// ============================================================================

/**
 * Navigation component dimensions
 * Use for header, tab bar, drawer, etc.
 */
export const navigationTokens = {
  /** Header/AppBar */
  header: {
    height: 56,
    heightLarge: 64,
    paddingHorizontal: 16,
  },
  /** Bottom Tab Bar */
  tabBar: {
    height: 56,
    heightWithSafeArea: 83, // 56 + typical safe area
    iconSize: 24,
    labelSize: 12,
    paddingBottom: 8,
  },
  /** Drawer/Sidebar */
  drawer: {
    width: 280,
    widthCollapsed: 72,
    headerHeight: 64,
  },
  /** Bottom Sheet */
  bottomSheet: {
    handleHeight: 24,
    handleWidth: 40,
    handleThickness: 4,
    borderRadius: 16,
    maxHeightRatio: 0.9, // 90% of screen height
  },
} as const;

// ============================================================================
// MODAL TOKENS (Layout specific)
// ============================================================================

/**
 * Modal size configurations
 */
export const modalSizeTokens = {
  /** Small modals (alerts, confirmations) */
  sm: {
    width: 320,
    maxWidth: '85%',
    maxHeight: '70%',
  },
  /** Medium modals (forms, selections) */
  md: {
    width: 480,
    maxWidth: '90%',
    maxHeight: '80%',
  },
  /** Large modals (complex content) */
  lg: {
    width: 640,
    maxWidth: '95%',
    maxHeight: '90%',
  },
  /** Full screen modals */
  full: {
    width: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
  },
} as const;

// ============================================================================
// SAFE AREA TOKENS
// ============================================================================

/**
 * Default safe area insets (fallbacks when SafeAreaView isn't available)
 */
export const safeAreaTokens = {
  /** Top inset (notch area) */
  top: {
    default: 0,
    withNotch: 47,
    withDynamicIsland: 59,
  },
  /** Bottom inset (home indicator) */
  bottom: {
    default: 0,
    withHomeIndicator: 34,
  },
  /** Horizontal insets (for landscape) */
  horizontal: {
    default: 0,
    withNotch: 44,
  },
} as const;

// ============================================================================
// SCROLL TOKENS
// ============================================================================

/**
 * Scroll behavior configurations
 */
export const scrollTokens = {
  /** Indicator insets */
  indicatorInsets: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  /** Pull to refresh */
  pullToRefresh: {
    triggerDistance: 80,
    indicatorSize: 24,
  },
  /** Infinite scroll */
  infiniteScroll: {
    threshold: 0.8, // 80% of content scrolled
    loadingIndicatorHeight: 48,
  },
  /** Snap to interval */
  snapToInterval: {
    card: 300,
    page: Dimensions.get('window').width,
  },
} as const;

// ============================================================================
// KEYBOARD TOKENS
// ============================================================================

/**
 * Keyboard-related layout values
 */
export const keyboardTokens = {
  /** Average keyboard heights by platform */
  averageHeight: {
    ios: 300,
    android: 280,
  },
  /** Extra padding when keyboard is open */
  extraPadding: 20,
  /** Animation duration for keyboard appear/disappear */
  animationDuration: 250,
} as const;

// ============================================================================
// ACCESSIBILITY TOKENS
// ============================================================================

/**
 * Accessibility-related layout values
 */
export const accessibilityTokens = {
  /** Minimum touch target size (WCAG 2.1) */
  minTouchTarget: 44,
  /** Comfortable touch target */
  comfortableTouchTarget: 48,
  /** Minimum text size for readability */
  minTextSize: 13,
  /** Minimum contrast ratio (WCAG AA) */
  minContrastRatio: 4.5,
  /** Large text contrast ratio (WCAG AA) */
  largeTextContrastRatio: 3,
  /** Focus indicator width */
  focusIndicatorWidth: 2,
} as const;

// ============================================================================
// LIST LAYOUT TOKENS
// ============================================================================

/**
 * List and collection layout configurations
 */
export const listLayoutTokens = {
  /** Default item heights */
  itemHeight: {
    small: 48,
    medium: 56,
    large: 72,
    xlarge: 88,
  },
  /** Section header */
  sectionHeader: {
    height: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  /** Separator */
  separator: {
    height: 1,
    insetLeft: 16,
    insetRight: 0,
  },
  /** Empty state */
  emptyState: {
    minHeight: 200,
    iconSize: 64,
    spacing: 16,
  },
} as const;

// ============================================================================
// CARD LAYOUT TOKENS
// ============================================================================

/**
 * Card grid configurations
 */
export const cardLayoutTokens = {
  /** Card widths for grid layouts */
  minCardWidth: {
    xs: 140,
    sm: 160,
    md: 200,
    lg: 240,
    xl: 280,
    '2xl': 320,
  },
  /** Number of cards per row */
  cardsPerRow: {
    xs: 2,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    '2xl': 6,
  },
  /** Aspect ratios */
  aspectRatio: {
    square: 1,
    portrait: 4 / 3,
    landscape: 16 / 9,
    wide: 21 / 9,
  },
} as const;

// ============================================================================
// COMBINED LAYOUT TOKENS EXPORT
// ============================================================================

export const layoutTokens = {
  breakpoints: breakpointTokens,
  density: densityTokens,
  grid: gridTokens,
  container: containerTokens,
  navigation: navigationTokens,
  modalSize: modalSizeTokens,
  safeArea: safeAreaTokens,
  scroll: scrollTokens,
  keyboard: keyboardTokens,
  accessibility: accessibilityTokens,
  list: listLayoutTokens,
  card: cardLayoutTokens,
} as const;

export type LayoutTokens = typeof layoutTokens;

// ============================================================================
// LAYOUT UTILITY FUNCTIONS
// ============================================================================

/**
 * Get the current breakpoint based on screen width
 * 
 * @example
 * const breakpoint = getCurrentBreakpoint(width);
 * // Returns 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
 */
export function getCurrentBreakpoint(width: number): keyof typeof breakpointTokens {
  if (width >= breakpointTokens['2xl']) return '2xl';
  if (width >= breakpointTokens.xl) return 'xl';
  if (width >= breakpointTokens.lg) return 'lg';
  if (width >= breakpointTokens.md) return 'md';
  if (width >= breakpointTokens.sm) return 'sm';
  return 'xs';
}

/**
 * Check if current width matches a breakpoint query
 * 
 * @example
 * const isTablet = matchBreakpoint(width, 'md'); // width >= md
 * const isPhone = matchBreakpoint(width, 'sm', 'down'); // width < md
 */
export function matchBreakpoint(
  width: number,
  breakpoint: keyof typeof breakpointTokens,
  direction: 'up' | 'down' = 'up'
): boolean {
  const value = breakpointTokens[breakpoint];
  return direction === 'up' ? width >= value : width < value;
}

/**
 * Check if device is in compact mode based on width
 * 
 * @example
 * // ❌ BAD: const isCompact = width < 768;
 * // ✅ GOOD:
 * const isCompact = isCompactWidth(width);
 */
export function isCompactWidth(width: number): boolean {
  return width < breakpointTokens.md;
}

/**
 * Check if device is tablet or larger
 * 
 * @example
 * const isTablet = isTabletWidth(width);
 */
export function isTabletWidth(width: number): boolean {
  return width >= breakpointTokens.md;
}

/**
 * Get appropriate density based on screen width
 * 
 * @example
 * const density = getResponsiveDensity(width);
 */
export function getResponsiveDensity(width: number): DensityMode {
  if (width < breakpointTokens.sm) return 'compact';
  if (width >= breakpointTokens.lg) return 'spacious';
  return 'comfortable';
}

/**
 * Calculate number of grid columns for current width
 * 
 * @example
 * const columns = getGridColumns(width);
 */
export function getGridColumns(width: number): number {
  const breakpoint = getCurrentBreakpoint(width);
  return gridTokens.columns[breakpoint];
}

/**
 * Calculate number of cards per row for current width
 * 
 * @example
 * const cardsPerRow = getCardsPerRow(width);
 */
export function getCardsPerRow(width: number): number {
  const breakpoint = getCurrentBreakpoint(width);
  return cardLayoutTokens.cardsPerRow[breakpoint];
}

