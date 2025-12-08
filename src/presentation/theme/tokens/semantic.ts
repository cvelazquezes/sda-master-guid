/**
 * Semantic Design Tokens
 *
 * Theme-aware tokens that map primitive values to meaningful design concepts.
 * These are the tokens that should be used in components and layouts.
 *
 * USAGE:
 * Use useTheme() from ThemeContext to access theme colors.
 */

import {
  colorPrimitives,
  spacingPrimitives,
  radiusPrimitives,
  opacityPrimitives,
  typographyPrimitives,
} from './primitives';
import { THEME_MODE } from '../../../shared/constants';

export type ThemeMode = (typeof THEME_MODE)[keyof typeof THEME_MODE];

// ============================================================================
// SEMANTIC COLOR TOKENS
// ============================================================================

/** Semantic color token structure */
export type SemanticColors = {
  brand: Record<string, string>;
  feedback: Record<string, string>;
  text: Record<string, string>;
  background: Record<string, string>;
  border: Record<string, string>;
  shadow: Record<string, string>;
  divider: Record<string, string>;
  icon: Record<string, string>;
  role: Record<string, { primary: string; subtle: string; text: string }>;
  status: Record<string, { primary: string; subtle: string; text: string }>;
  hierarchy: Record<string, { primary: string; subtle: string }>;
};

/**
 * Creates theme-aware semantic color tokens
 */
export const createSemanticColors = (theme: ThemeMode): SemanticColors => {
  const isLight = theme === THEME_MODE.LIGHT;
  const c = colorPrimitives;

  return {
    // ----- Brand Colors -----
    brand: {
      primary: isLight ? c.blue[500] : c.dark.purple[400],
      primaryHover: isLight ? c.blue[600] : c.dark.purple[300],
      primaryActive: isLight ? c.blue[700] : c.dark.purple[500],
      primarySubtle: isLight ? c.blue[50] : `rgba(187, 134, 252, 0.1)`,
      primaryMuted: isLight ? c.blue[100] : `rgba(187, 134, 252, 0.2)`,

      secondary: isLight ? c.burgundy[500] : c.dark.teal[400],
      secondaryHover: isLight ? c.burgundy[600] : c.dark.teal[300],
      secondaryActive: isLight ? c.burgundy[700] : c.dark.teal[500],
      secondarySubtle: isLight ? c.burgundy[50] : `rgba(3, 218, 198, 0.1)`,
      secondaryMuted: isLight ? c.burgundy[100] : `rgba(3, 218, 198, 0.2)`,

      accent: isLight ? c.gold[500] : c.gold[400],
      accentHover: isLight ? c.gold[600] : c.gold[500],
      accentActive: isLight ? c.gold[700] : c.gold[600],
      accentSubtle: isLight ? c.gold[50] : `rgba(253, 185, 19, 0.1)`,
      accentMuted: isLight ? c.gold[100] : `rgba(253, 185, 19, 0.2)`,
    },

    // ----- Feedback Colors -----
    feedback: {
      success: isLight ? c.green[500] : c.green[400],
      successSubtle: isLight ? c.green[50] : `rgba(67, 160, 71, 0.1)`,
      successMuted: isLight ? c.green[100] : `rgba(67, 160, 71, 0.2)`,
      successText: isLight ? c.green[700] : c.green[300],

      warning: isLight ? c.orange[500] : c.orange[400],
      warningSubtle: isLight ? c.orange[50] : `rgba(251, 140, 0, 0.1)`,
      warningMuted: isLight ? c.orange[100] : `rgba(251, 140, 0, 0.2)`,
      warningText: isLight ? c.orange[700] : c.orange[300],

      error: isLight ? c.red[500] : c.dark.pink[400],
      errorSubtle: isLight ? c.red[100] : `rgba(207, 102, 121, 0.1)`,
      errorMuted: isLight ? c.red[200] : `rgba(207, 102, 121, 0.2)`,
      errorText: isLight ? c.red[700] : c.dark.pink[300],

      info: isLight ? c.cyan[500] : c.cyan[400],
      infoSubtle: isLight ? c.cyan[50] : `rgba(2, 136, 209, 0.1)`,
      infoMuted: isLight ? c.cyan[100] : `rgba(2, 136, 209, 0.2)`,
      infoText: isLight ? c.cyan[700] : c.cyan[300],
    },

    // ----- Text Colors -----
    text: {
      primary: isLight ? c.gray[900] : c.gray[50],
      secondary: isLight ? c.gray[700] : c.gray[300],
      tertiary: isLight ? c.gray[600] : c.gray[400],
      quaternary: isLight ? c.gray[500] : c.gray[500],
      disabled: isLight ? c.gray[400] : c.gray[600],
      placeholder: isLight ? c.gray[500] : c.gray[500],
      inverse: isLight ? c.absolute.white : c.gray[950],
      onPrimary: c.absolute.white,
      onSecondary: c.absolute.white,
      onAccent: isLight ? c.gray[900] : c.gray[900],
      onSurface: isLight ? c.gray[900] : c.gray[50],
      link: isLight ? c.blue[600] : c.dark.purple[400],
      linkHover: isLight ? c.blue[700] : c.dark.purple[300],
    },

    // ----- Background Colors -----
    background: {
      // Page backgrounds
      primary: isLight ? c.absolute.white : c.gray[950],
      secondary: isLight ? c.gray[100] : c.gray[900],
      tertiary: isLight ? c.gray[200] : c.gray[800],

      // Surface backgrounds (cards, modals)
      surface: isLight ? c.absolute.white : c.gray[900],
      surfaceElevated: isLight ? c.absolute.white : c.gray[800],
      surfaceSubdued: isLight ? c.gray[50] : c.gray[900],

      // Interactive backgrounds
      hover: isLight ? c.gray[100] : `rgba(255, 255, 255, 0.05)`,
      pressed: isLight ? c.gray[200] : `rgba(255, 255, 255, 0.1)`,
      selected: isLight ? c.blue[50] : `rgba(187, 134, 252, 0.16)`,
      disabled: isLight ? c.gray[100] : c.gray[900],

      // Input backgrounds
      input: isLight ? c.gray[50] : c.gray[800],
      inputFocused: isLight ? c.absolute.white : c.gray[700],

      // Overlay backgrounds
      overlay: isLight ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.7)',
      backdrop: isLight ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.7)',
      scrim: isLight ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.5)',
    },

    // ----- Border Colors -----
    border: {
      default: isLight ? c.gray[200] : c.gray[700],
      subtle: isLight ? c.gray[100] : c.gray[800],
      muted: isLight ? c.gray[300] : c.gray[600],
      strong: isLight ? c.gray[400] : c.gray[500],
      focus: isLight ? c.blue[500] : c.dark.purple[400],
      error: isLight ? c.red[500] : c.dark.pink[400],
      success: isLight ? c.green[500] : c.green[400],
      warning: isLight ? c.orange[500] : c.orange[400],
      disabled: isLight ? c.gray[200] : c.gray[700],
    },

    // ----- Shadow Colors -----
    shadow: {
      default: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.5)',
      subtle: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.3)',
      strong: isLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.6)',
      colored: isLight ? 'rgba(25, 118, 210, 0.2)' : 'rgba(187, 134, 252, 0.2)',
    },

    // ----- Divider Colors -----
    divider: {
      default: isLight ? c.gray[200] : c.gray[700],
      subtle: isLight ? c.gray[100] : c.gray[800],
      strong: isLight ? c.gray[300] : c.gray[600],
    },

    // ----- Icon Colors -----
    icon: {
      primary: isLight ? c.gray[900] : c.gray[100],
      secondary: isLight ? c.gray[600] : c.gray[400],
      tertiary: isLight ? c.gray[500] : c.gray[500],
      disabled: isLight ? c.gray[400] : c.gray[600],
      inverse: isLight ? c.absolute.white : c.gray[900],
      onPrimary: c.absolute.white,
      brand: isLight ? c.blue[500] : c.dark.purple[400],
    },

    // ----- Status Role Colors -----
    role: {
      admin: {
        primary: isLight ? c.red[600] : c.dark.pink[400],
        subtle: isLight ? c.red[50] : `rgba(207, 102, 121, 0.1)`,
        text: isLight ? c.red[700] : c.dark.pink[300],
      },
      clubAdmin: {
        primary: isLight ? c.gold[600] : c.gold[400],
        subtle: isLight ? c.gold[50] : `rgba(253, 185, 19, 0.1)`,
        text: isLight ? c.gold[800] : c.gold[300],
      },
      user: {
        primary: isLight ? c.blue[500] : c.dark.purple[400],
        subtle: isLight ? c.blue[50] : `rgba(187, 134, 252, 0.1)`,
        text: isLight ? c.blue[700] : c.dark.purple[300],
      },
    },

    // ----- Status Colors -----
    status: {
      active: {
        primary: isLight ? c.green[500] : c.green[400],
        subtle: isLight ? c.green[50] : `rgba(67, 160, 71, 0.1)`,
        text: isLight ? c.green[700] : c.green[300],
      },
      inactive: {
        primary: isLight ? c.red[500] : c.dark.pink[400],
        subtle: isLight ? c.red[50] : `rgba(207, 102, 121, 0.1)`,
        text: isLight ? c.red[700] : c.dark.pink[300],
      },
      pending: {
        primary: isLight ? c.orange[500] : c.orange[400],
        subtle: isLight ? c.orange[50] : `rgba(251, 140, 0, 0.1)`,
        text: isLight ? c.orange[700] : c.orange[300],
      },
      paused: {
        primary: isLight ? c.orange[500] : c.orange[400],
        subtle: isLight ? c.orange[50] : `rgba(251, 140, 0, 0.1)`,
        text: isLight ? c.orange[700] : c.orange[300],
      },
      completed: {
        primary: isLight ? c.green[500] : c.green[400],
        subtle: isLight ? c.green[50] : `rgba(67, 160, 71, 0.1)`,
        text: isLight ? c.green[700] : c.green[300],
      },
      scheduled: {
        primary: isLight ? c.cyan[500] : c.cyan[400],
        subtle: isLight ? c.cyan[50] : `rgba(2, 136, 209, 0.1)`,
        text: isLight ? c.cyan[700] : c.cyan[300],
      },
      skipped: {
        primary: isLight ? c.gray[500] : c.gray[400],
        subtle: isLight ? c.gray[100] : `rgba(158, 158, 158, 0.1)`,
        text: isLight ? c.gray[700] : c.gray[300],
      },
      cancelled: {
        primary: isLight ? c.red[500] : c.dark.pink[400],
        subtle: isLight ? c.red[50] : `rgba(207, 102, 121, 0.1)`,
        text: isLight ? c.red[700] : c.dark.pink[300],
      },
    },

    // ----- Hierarchy Colors -----
    hierarchy: {
      division: {
        primary: isLight ? c.blue[600] : c.dark.purple[400],
        subtle: isLight ? c.blue[50] : `rgba(187, 134, 252, 0.1)`,
      },
      union: {
        primary: isLight ? c.blue[500] : c.dark.purple[400],
        subtle: isLight ? c.blue[100] : `rgba(187, 134, 252, 0.15)`,
      },
      association: {
        primary: isLight ? c.blue[400] : c.dark.purple[300],
        subtle: isLight ? c.blue[100] : `rgba(187, 134, 252, 0.2)`,
      },
      church: {
        primary: isLight ? c.burgundy[500] : c.dark.teal[400],
        subtle: isLight ? c.burgundy[50] : `rgba(3, 218, 198, 0.1)`,
      },
      club: {
        primary: isLight ? c.gold[600] : c.gold[400],
        subtle: isLight ? c.gold[50] : `rgba(253, 185, 19, 0.1)`,
      },
    },
  } as const;
};

// ============================================================================
// SEMANTIC SPACING TOKENS
// ============================================================================

export const semanticSpacing = {
  // Component internal spacing
  component: {
    xs: spacingPrimitives.xs,
    sm: spacingPrimitives.sm,
    md: spacingPrimitives.md,
    lg: spacingPrimitives.lg,
    xl: spacingPrimitives.xl,
  },

  // Layout spacing
  layout: {
    screenPadding: spacingPrimitives.lg,
    sectionGap: spacingPrimitives['2xl'],
    cardGap: spacingPrimitives.md,
    listItemGap: spacingPrimitives.md,
    inlineGap: spacingPrimitives.sm,
  },

  // Content spacing
  content: {
    paragraphGap: spacingPrimitives.md,
    headingGap: spacingPrimitives.lg,
    labelGap: spacingPrimitives.sm,
  },
} as const;

// ============================================================================
// SEMANTIC TYPOGRAPHY TOKENS
// ============================================================================

// Helper to calculate line height in pixels (React Native requires absolute values)
const calcLineHeight = (fontSize: number, multiplier: number): number =>
  Math.round(fontSize * multiplier);

export const semanticTypography = {
  // Display (Large headlines)
  display: {
    large: {
      fontSize: typographyPrimitives.fontSize['7xl'],
      fontWeight: typographyPrimitives.fontWeight.bold,
      lineHeight: calcLineHeight(
        typographyPrimitives.fontSize['7xl'],
        typographyPrimitives.lineHeight.tight
      ),
      letterSpacing: typographyPrimitives.letterSpacing.tight,
    },
    medium: {
      fontSize: typographyPrimitives.fontSize['5xl'],
      fontWeight: typographyPrimitives.fontWeight.bold,
      lineHeight: calcLineHeight(
        typographyPrimitives.fontSize['5xl'],
        typographyPrimitives.lineHeight.tight
      ),
      letterSpacing: typographyPrimitives.letterSpacing.tight,
    },
    small: {
      fontSize: typographyPrimitives.fontSize['4xl'],
      fontWeight: typographyPrimitives.fontWeight.semibold,
      lineHeight: calcLineHeight(
        typographyPrimitives.fontSize['4xl'],
        typographyPrimitives.lineHeight.tight
      ),
      letterSpacing: typographyPrimitives.letterSpacing.normal,
    },
  },

  // Headings
  heading: {
    h1: {
      fontSize: typographyPrimitives.fontSize['3xl'],
      fontWeight: typographyPrimitives.fontWeight.bold,
      lineHeight: calcLineHeight(
        typographyPrimitives.fontSize['3xl'],
        typographyPrimitives.lineHeight.snug
      ),
    },
    h2: {
      fontSize: typographyPrimitives.fontSize['2xl'],
      fontWeight: typographyPrimitives.fontWeight.semibold,
      lineHeight: calcLineHeight(
        typographyPrimitives.fontSize['2xl'],
        typographyPrimitives.lineHeight.snug
      ),
    },
    h3: {
      fontSize: typographyPrimitives.fontSize.xl,
      fontWeight: typographyPrimitives.fontWeight.semibold,
      lineHeight: calcLineHeight(
        typographyPrimitives.fontSize.xl,
        typographyPrimitives.lineHeight.normal
      ),
    },
    h4: {
      fontSize: typographyPrimitives.fontSize.lg,
      fontWeight: typographyPrimitives.fontWeight.semibold,
      lineHeight: calcLineHeight(
        typographyPrimitives.fontSize.lg,
        typographyPrimitives.lineHeight.normal
      ),
    },
  },

  // Body text
  body: {
    large: {
      fontSize: typographyPrimitives.fontSize.lg,
      fontWeight: typographyPrimitives.fontWeight.regular,
      lineHeight: calcLineHeight(
        typographyPrimitives.fontSize.lg,
        typographyPrimitives.lineHeight.normal
      ),
    },
    medium: {
      fontSize: typographyPrimitives.fontSize.md,
      fontWeight: typographyPrimitives.fontWeight.regular,
      lineHeight: calcLineHeight(
        typographyPrimitives.fontSize.md,
        typographyPrimitives.lineHeight.normal
      ),
    },
    small: {
      fontSize: typographyPrimitives.fontSize.sm,
      fontWeight: typographyPrimitives.fontWeight.regular,
      lineHeight: calcLineHeight(
        typographyPrimitives.fontSize.sm,
        typographyPrimitives.lineHeight.normal
      ),
    },
  },

  // Labels
  label: {
    large: {
      fontSize: typographyPrimitives.fontSize.md,
      fontWeight: typographyPrimitives.fontWeight.medium,
      lineHeight: calcLineHeight(
        typographyPrimitives.fontSize.md,
        typographyPrimitives.lineHeight.normal
      ),
    },
    medium: {
      fontSize: typographyPrimitives.fontSize.sm,
      fontWeight: typographyPrimitives.fontWeight.medium,
      lineHeight: calcLineHeight(
        typographyPrimitives.fontSize.sm,
        typographyPrimitives.lineHeight.normal
      ),
    },
    small: {
      fontSize: typographyPrimitives.fontSize.xs,
      fontWeight: typographyPrimitives.fontWeight.medium,
      lineHeight: calcLineHeight(
        typographyPrimitives.fontSize.xs,
        typographyPrimitives.lineHeight.normal
      ),
    },
  },

  // Caption
  caption: {
    regular: {
      fontSize: typographyPrimitives.fontSize.xs,
      fontWeight: typographyPrimitives.fontWeight.regular,
      lineHeight: calcLineHeight(
        typographyPrimitives.fontSize.xs,
        typographyPrimitives.lineHeight.normal
      ),
    },
    bold: {
      fontSize: typographyPrimitives.fontSize.xs,
      fontWeight: typographyPrimitives.fontWeight.semibold,
      lineHeight: calcLineHeight(
        typographyPrimitives.fontSize.xs,
        typographyPrimitives.lineHeight.normal
      ),
    },
  },

  // UI elements
  ui: {
    button: {
      fontSize: typographyPrimitives.fontSize.lg,
      fontWeight: typographyPrimitives.fontWeight.semibold,
      lineHeight: calcLineHeight(
        typographyPrimitives.fontSize.lg,
        typographyPrimitives.lineHeight.normal
      ),
      letterSpacing: typographyPrimitives.letterSpacing.wide,
    },
    buttonSmall: {
      fontSize: typographyPrimitives.fontSize.sm,
      fontWeight: typographyPrimitives.fontWeight.semibold,
      lineHeight: calcLineHeight(
        typographyPrimitives.fontSize.sm,
        typographyPrimitives.lineHeight.normal
      ),
    },
    badge: {
      fontSize: typographyPrimitives.fontSize.xs,
      fontWeight: typographyPrimitives.fontWeight.semibold,
      lineHeight: calcLineHeight(
        typographyPrimitives.fontSize.xs,
        typographyPrimitives.lineHeight.tight
      ),
      letterSpacing: typographyPrimitives.letterSpacing.wide,
    },
    helper: {
      fontSize: typographyPrimitives.fontSize.xs,
      fontWeight: typographyPrimitives.fontWeight.regular,
      lineHeight: calcLineHeight(
        typographyPrimitives.fontSize.xs,
        typographyPrimitives.lineHeight.normal
      ),
    },
  },
} as const;

// ============================================================================
// SEMANTIC BORDER TOKENS
// ============================================================================

export const semanticBorder = {
  radius: {
    none: radiusPrimitives.none,
    sm: radiusPrimitives.sm,
    md: radiusPrimitives.lg,
    lg: radiusPrimitives.xl,
    xl: radiusPrimitives['2xl'],
    full: radiusPrimitives.full,

    // Component-specific
    button: radiusPrimitives.lg,
    card: radiusPrimitives.xl,
    input: radiusPrimitives.lg,
    modal: radiusPrimitives['2xl'],
    badge: radiusPrimitives.full,
    avatar: radiusPrimitives.full,
    chip: radiusPrimitives.lg,
  },
} as const;

// ============================================================================
// CREATE SEMANTIC TOKENS FUNCTION
// ============================================================================

export const createSemanticTokens = (
  theme: ThemeMode
): {
  colors: SemanticColors;
  spacing: typeof semanticSpacing;
  typography: typeof semanticTypography;
  border: typeof semanticBorder;
  opacity: typeof opacityPrimitives;
} => ({
  colors: createSemanticColors(theme),
  spacing: semanticSpacing,
  typography: semanticTypography,
  border: semanticBorder,
  opacity: opacityPrimitives,
});

export type SemanticTokens = ReturnType<typeof createSemanticTokens>;
