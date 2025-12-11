/* eslint-disable max-lines -- Component tokens require comprehensive definitions */
/**
 * Component Design Tokens
 *
 * Pre-composed tokens for specific UI components.
 * These tokens combine semantic tokens into ready-to-use component configurations.
 *
 * USAGE:
 * const { colors } = useTheme();
 *
 * NOTE: This file intentionally contains literal numbers as it DEFINES component tokens.
 */

import {
  spacingPrimitives,
  shadowPrimitives,
  opacityPrimitives,
  sizePrimitives,
  borderWidthPrimitives,
  typographyPrimitives,
} from './primitives';
import {
  createSemanticColors,
  semanticTypography,
  semanticBorder,
  type ThemeMode,
} from './semantic';
import { THEME_MODE, BORDERS } from '../../../shared/constants';
import type { TextStyle } from 'react-native';

// ============================================================================
// BUTTON TOKENS
// ============================================================================

const createButtonTokens = (
  theme: ThemeMode
): {
  sizes: {
    small: {
      paddingVertical: number;
      paddingHorizontal: number;
      minHeight: number;
      fontSize: number;
      iconSize: number;
      borderRadius: number;
    };
    medium: {
      paddingVertical: number;
      paddingHorizontal: number;
      minHeight: number;
      fontSize: number;
      iconSize: number;
      borderRadius: number;
    };
    large: {
      paddingVertical: number;
      paddingHorizontal: number;
      minHeight: number;
      fontSize: number;
      iconSize: number;
      borderRadius: number;
    };
  };
  variants: Record<string, { backgroundColor: string; color: string; borderColor: string }>;
  states: { disabled: { opacity: number }; loading: { opacity: number } };
  borderWidth: number;
} => {
  const colors = createSemanticColors(theme);

  return {
    sizes: {
      small: {
        paddingVertical: spacingPrimitives.sm,
        paddingHorizontal: spacingPrimitives.md,
        minHeight: sizePrimitives.touchTarget.minimum,
        fontSize: typographyPrimitives.fontSize.sm,
        iconSize: sizePrimitives.icon.sm,
        borderRadius: semanticBorder.radius.button,
      },
      medium: {
        paddingVertical: spacingPrimitives.md,
        paddingHorizontal: spacingPrimitives.lg,
        minHeight: sizePrimitives.touchTarget.comfortable,
        fontSize: typographyPrimitives.fontSize.lg,
        iconSize: sizePrimitives.icon.md,
        borderRadius: semanticBorder.radius.button,
      },
      large: {
        paddingVertical: spacingPrimitives.lg,
        paddingHorizontal: spacingPrimitives.xl,
        minHeight: sizePrimitives.touchTarget.spacious,
        fontSize: typographyPrimitives.fontSize.xl,
        iconSize: sizePrimitives.icon.lg,
        borderRadius: semanticBorder.radius.button,
      },
    },
    variants: {
      primary: {
        backgroundColor: colors.brand.primary,
        color: colors.text.onPrimary,
        borderColor: BORDERS.COLOR.TRANSPARENT,
      },
      secondary: {
        backgroundColor: colors.brand.secondary,
        color: colors.text.onSecondary,
        borderColor: BORDERS.COLOR.TRANSPARENT,
      },
      accent: {
        backgroundColor: colors.brand.accent,
        color: colors.text.onAccent,
        borderColor: BORDERS.COLOR.TRANSPARENT,
      },
      danger: {
        backgroundColor: colors.feedback.error,
        color: colors.text.onPrimary,
        borderColor: BORDERS.COLOR.TRANSPARENT,
      },
      success: {
        backgroundColor: colors.feedback.success,
        color: colors.text.onPrimary,
        borderColor: BORDERS.COLOR.TRANSPARENT,
      },
      outline: {
        backgroundColor: BORDERS.COLOR.TRANSPARENT,
        color: colors.brand.primary,
        borderColor: colors.brand.primary,
      },
      ghost: {
        backgroundColor: BORDERS.COLOR.TRANSPARENT,
        color: colors.brand.primary,
        borderColor: BORDERS.COLOR.TRANSPARENT,
      },
    },
    states: {
      disabled: {
        opacity: opacityPrimitives.disabled,
      },
      loading: {
        opacity: opacityPrimitives[70],
      },
    },
    borderWidth: borderWidthPrimitives.medium,
  } as const;
};

// ============================================================================
// CARD TOKENS
// ============================================================================

const createCardTokens = (
  theme: ThemeMode
): {
  variants: Record<
    string,
    {
      backgroundColor: string;
      borderRadius: number;
      padding: number;
      shadow?: object;
      borderWidth?: number;
      borderColor?: string;
    }
  >;
  gap: number;
  marginBottom: number;
} => {
  const colors = createSemanticColors(theme);
  const isLight = theme === THEME_MODE.LIGHT;

  return {
    variants: {
      default: {
        backgroundColor: colors.background.surface,
        borderRadius: semanticBorder.radius.card,
        padding: spacingPrimitives.lg,
        shadow: {
          ...shadowPrimitives.md,
          shadowColor: colors.shadow.default,
          shadowOpacity: isLight ? 0.18 : 0.4,
        },
      },
      elevated: {
        backgroundColor: colors.background.surfaceElevated,
        borderRadius: semanticBorder.radius.card,
        padding: spacingPrimitives.lg,
        shadow: {
          ...shadowPrimitives.xl,
          shadowColor: colors.shadow.default,
          shadowOpacity: isLight ? 0.2 : 0.5,
        },
      },
      outlined: {
        backgroundColor: colors.background.surface,
        borderRadius: semanticBorder.radius.card,
        padding: spacingPrimitives.lg,
        borderWidth: borderWidthPrimitives.thin,
        borderColor: colors.border.default,
        shadow: {
          ...shadowPrimitives.sm,
          shadowColor: colors.shadow.subtle,
          shadowOpacity: isLight ? 0.12 : 0.25,
        },
      },
      flat: {
        backgroundColor: BORDERS.COLOR.TRANSPARENT,
        borderRadius: semanticBorder.radius.card,
        padding: spacingPrimitives.lg,
      },
    },
    gap: spacingPrimitives.md,
    marginBottom: spacingPrimitives.md,
  } as const;
};

// ============================================================================
// INPUT TOKENS
// ============================================================================

const createInputTokens = (
  theme: ThemeMode
): {
  default: {
    backgroundColor: string;
    borderColor: string;
    borderRadius: number;
    borderWidth: number;
    paddingVertical: number;
    paddingHorizontal: number;
    minHeight: number;
    fontSize: number;
    color: string;
    placeholderColor: string;
  };
  states: Record<string, { borderColor?: string; backgroundColor?: string; opacity?: number }>;
  iconSize: number;
  labelSpacing: number;
  helperSpacing: number;
} => {
  const colors = createSemanticColors(theme);

  return {
    default: {
      backgroundColor: colors.background.input,
      borderColor: colors.border.default,
      borderRadius: semanticBorder.radius.input,
      borderWidth: borderWidthPrimitives.thin,
      paddingVertical: spacingPrimitives.md,
      paddingHorizontal: spacingPrimitives.md,
      minHeight: sizePrimitives.touchTarget.comfortable,
      fontSize: semanticTypography.body.medium.fontSize,
      color: colors.text.primary,
      placeholderColor: colors.text.placeholder,
    },
    states: {
      focus: {
        borderColor: colors.border.focus,
        backgroundColor: colors.background.inputFocused,
      },
      error: {
        borderColor: colors.border.error,
      },
      success: {
        borderColor: colors.border.success,
      },
      disabled: {
        backgroundColor: colors.background.disabled,
        borderColor: colors.border.disabled,
        opacity: opacityPrimitives.disabled,
      },
    },
    iconSize: sizePrimitives.icon.md,
    labelSpacing: spacingPrimitives.sm,
    helperSpacing: spacingPrimitives.xs,
  } as const;
};

// ============================================================================
// MODAL TOKENS
// ============================================================================

const createModalTokens = (
  theme: ThemeMode
): {
  container: {
    backgroundColor: string;
    borderRadius: number;
    padding: number;
    maxWidth: number;
    shadow: object;
  };
  overlay: { backgroundColor: string };
  header: { marginBottom: number };
  content: { gap: number };
  footer: { marginTop: number; gap: number };
} => {
  const colors = createSemanticColors(theme);
  const isLight = theme === THEME_MODE.LIGHT;

  return {
    container: {
      backgroundColor: colors.background.surface,
      borderRadius: semanticBorder.radius.modal,
      padding: spacingPrimitives.xl,
      maxWidth: 500,
      shadow: {
        ...shadowPrimitives['3xl'],
        shadowColor: colors.shadow.strong,
        shadowOpacity: isLight ? 0.25 : 0.5,
      },
    },
    overlay: {
      backgroundColor: colors.background.overlay,
    },
    header: {
      marginBottom: spacingPrimitives.lg,
    },
    content: {
      gap: spacingPrimitives.md,
    },
    footer: {
      marginTop: spacingPrimitives.xl,
      gap: spacingPrimitives.sm,
    },
  } as const;
};

// ============================================================================
// BADGE TOKENS
// ============================================================================

const createBadgeTokens = (
  theme: ThemeMode
): {
  base: {
    paddingVertical: number;
    paddingHorizontal: number;
    borderRadius: number;
    fontSize: number;
    fontWeight: TextStyle['fontWeight'];
    letterSpacing: number;
  };
  variants: Record<string, { backgroundColor: string; color: string }>;
  sizes: Record<string, { paddingVertical: number; paddingHorizontal: number; fontSize: number }>;
} => {
  const colors = createSemanticColors(theme);

  return {
    base: {
      borderRadius: semanticBorder.radius.badge,
      paddingVertical: spacingPrimitives.xs,
      paddingHorizontal: spacingPrimitives.sm,
      fontSize: semanticTypography.ui.badge.fontSize,
      fontWeight: semanticTypography.ui.badge.fontWeight as TextStyle['fontWeight'],
      letterSpacing: semanticTypography.ui.badge.letterSpacing ?? 0,
    },
    variants: {
      default: {
        backgroundColor: colors.background.secondary,
        color: colors.text.secondary,
      },
      primary: {
        backgroundColor: colors.brand.primarySubtle,
        color: colors.brand.primary,
      },
      secondary: {
        backgroundColor: colors.brand.secondarySubtle,
        color: colors.brand.secondary,
      },
      success: {
        backgroundColor: colors.feedback.successSubtle,
        color: colors.feedback.successText,
      },
      warning: {
        backgroundColor: colors.feedback.warningSubtle,
        color: colors.feedback.warningText,
      },
      error: {
        backgroundColor: colors.feedback.errorSubtle,
        color: colors.feedback.errorText,
      },
      info: {
        backgroundColor: colors.feedback.infoSubtle,
        color: colors.feedback.infoText,
      },
    },
    sizes: {
      small: {
        paddingVertical: spacingPrimitives.xxs,
        paddingHorizontal: spacingPrimitives.xs,
        fontSize: typographyPrimitives.fontSize['2xs'],
      },
      medium: {
        paddingVertical: spacingPrimitives.xs,
        paddingHorizontal: spacingPrimitives.sm,
        fontSize: semanticTypography.ui.badge.fontSize,
      },
      large: {
        paddingVertical: spacingPrimitives.sm,
        paddingHorizontal: spacingPrimitives.md,
        fontSize: typographyPrimitives.fontSize.sm,
      },
    },
  } as const;
};

// ============================================================================
// AVATAR TOKENS
// ============================================================================

const createAvatarTokens = (
  theme: ThemeMode
): {
  sizes: typeof sizePrimitives.avatar;
  borderRadius: number;
  backgroundColor: string;
  textColor: string;
  borderWidth: number;
  borderColor: string;
  fontSize: Record<string, number>;
} => {
  const colors = createSemanticColors(theme);

  return {
    sizes: sizePrimitives.avatar,
    borderRadius: semanticBorder.radius.avatar,
    backgroundColor: colors.brand.primarySubtle,
    textColor: colors.brand.primary,
    borderWidth: borderWidthPrimitives.medium,
    borderColor: colors.border.default,
    fontSize: {
      xs: typographyPrimitives.fontSize['2xs'],
      sm: typographyPrimitives.fontSize.xs,
      md: typographyPrimitives.fontSize.lg,
      lg: typographyPrimitives.fontSize['2xl'],
      xl: typographyPrimitives.fontSize['4xl'],
      '2xl': typographyPrimitives.fontSize['6xl'],
      '3xl': typographyPrimitives.fontSize['7xl'],
    },
  } as const;
};

// ============================================================================
// LIST TOKENS
// ============================================================================

const createListTokens = (
  theme: ThemeMode
): {
  gap: number;
  item: {
    padding: number;
    borderRadius: number;
    minHeight: number;
    backgroundColor: string;
    activeBackgroundColor: string;
  };
  separator: { color: string; thickness: number };
  section: { headerPadding: number; headerColor: string; headerFontSize: number };
} => {
  const colors = createSemanticColors(theme);

  return {
    gap: spacingPrimitives.md,
    item: {
      padding: spacingPrimitives.lg,
      borderRadius: semanticBorder.radius.card,
      minHeight: 72,
      backgroundColor: colors.background.surface,
      activeBackgroundColor: colors.background.pressed,
    },
    separator: {
      color: colors.divider.default,
      thickness: borderWidthPrimitives.thin,
    },
    section: {
      headerPadding: spacingPrimitives.md,
      headerColor: colors.text.secondary,
      headerFontSize: semanticTypography.label.small.fontSize,
    },
  } as const;
};

// ============================================================================
// DIVIDER TOKENS
// ============================================================================

const createDividerTokens = (
  theme: ThemeMode
): {
  color: string;
  thickness: number;
  spacing: number;
} => {
  const colors = createSemanticColors(theme);

  return {
    color: colors.divider.default,
    thickness: borderWidthPrimitives.thin,
    spacing: spacingPrimitives.md,
  } as const;
};

// ============================================================================
// TAB TOKENS
// ============================================================================

const createTabTokens = (
  theme: ThemeMode
): {
  bar: {
    backgroundColor: string;
    borderTopWidth: number;
    borderTopColor: string;
    height: number;
    paddingBottom: number;
  };
  item: { activeColor: string; inactiveColor: string; iconSize: number; fontSize: number };
  indicator: { color: string; height: number; borderRadius: number };
} => {
  const colors = createSemanticColors(theme);

  return {
    bar: {
      backgroundColor: colors.background.surface,
      borderTopWidth: borderWidthPrimitives.thin,
      borderTopColor: colors.border.subtle,
      height: 56,
      paddingBottom: spacingPrimitives.sm,
    },
    item: {
      activeColor: colors.brand.primary,
      inactiveColor: colors.text.tertiary,
      iconSize: sizePrimitives.icon.lg,
      fontSize: semanticTypography.caption.regular.fontSize,
    },
    indicator: {
      color: colors.brand.primary,
      height: 3,
      borderRadius: 2,
    },
  } as const;
};

// ============================================================================
// ICON BUTTON TOKENS
// ============================================================================

const createIconButtonTokens = (
  theme: ThemeMode
): {
  sizes: Record<string, { size: number; iconSize: number; borderRadius: number }>;
  variants: Record<string, { backgroundColor: string; color: string }>;
  states: { disabled: { opacity: number } };
} => {
  const colors = createSemanticColors(theme);

  return {
    sizes: {
      small: {
        size: 36,
        iconSize: sizePrimitives.icon.sm,
        borderRadius: semanticBorder.radius.md,
      },
      medium: {
        size: sizePrimitives.touchTarget.comfortable,
        iconSize: sizePrimitives.icon.md,
        borderRadius: semanticBorder.radius.md,
      },
      large: {
        size: sizePrimitives.touchTarget.spacious,
        iconSize: sizePrimitives.icon.lg,
        borderRadius: semanticBorder.radius.lg,
      },
    },
    variants: {
      default: {
        backgroundColor: BORDERS.COLOR.TRANSPARENT,
        color: colors.icon.primary,
      },
      primary: {
        backgroundColor: colors.brand.primarySubtle,
        color: colors.brand.primary,
      },
      filled: {
        backgroundColor: colors.brand.primary,
        color: colors.icon.onPrimary,
      },
    },
    states: {
      disabled: {
        opacity: opacityPrimitives.disabled,
      },
    },
  } as const;
};

// ============================================================================
// SCREEN LAYOUT TOKENS
// ============================================================================

const createLayoutTokens = (
  theme: ThemeMode
): {
  screen: { backgroundColor: string; paddingHorizontal: number; paddingVertical: number };
  header: {
    backgroundColor: string;
    height: number;
    paddingHorizontal: number;
    borderBottomWidth: number;
    borderBottomColor: string;
  };
  section: { marginBottom: number; gap: number };
  container: { maxWidth: number; paddingHorizontal: number };
} => {
  const colors = createSemanticColors(theme);

  return {
    screen: {
      backgroundColor: colors.background.secondary,
      paddingHorizontal: spacingPrimitives.lg,
      paddingVertical: spacingPrimitives.lg,
    },
    header: {
      backgroundColor: colors.background.surface,
      height: 56,
      paddingHorizontal: spacingPrimitives.lg,
      borderBottomWidth: borderWidthPrimitives.thin,
      borderBottomColor: colors.border.subtle,
    },
    section: {
      marginBottom: spacingPrimitives['2xl'],
      gap: spacingPrimitives.lg,
    },
    container: {
      maxWidth: 1200,
      paddingHorizontal: spacingPrimitives.lg,
    },
  } as const;
};

// ============================================================================
// TOAST TOKENS
// ============================================================================

const createToastTokens = (
  theme: ThemeMode
): {
  container: {
    borderRadius: number;
    padding: number;
    shadow: object;
    minWidth: number;
    maxWidth: string;
  };
  variants: Record<string, { backgroundColor: string; color: string }>;
  iconSize: number;
  gap: number;
} => {
  const colors = createSemanticColors(theme);
  const isLight = theme === THEME_MODE.LIGHT;

  return {
    container: {
      borderRadius: semanticBorder.radius.lg,
      padding: spacingPrimitives.lg,
      shadow: shadowPrimitives.xl,
      minWidth: 280,
      maxWidth: '90%',
    },
    variants: {
      default: {
        backgroundColor: isLight ? colors.background.surfaceElevated : colors.background.secondary,
        color: colors.text.primary,
      },
      success: {
        backgroundColor: colors.feedback.success,
        color: colors.text.onPrimary,
      },
      warning: {
        backgroundColor: colors.feedback.warning,
        color: colors.text.onAccent,
      },
      error: {
        backgroundColor: colors.feedback.error,
        color: colors.text.onPrimary,
      },
      info: {
        backgroundColor: colors.feedback.info,
        color: colors.text.onPrimary,
      },
    },
    iconSize: sizePrimitives.icon.md,
    gap: spacingPrimitives.sm,
  } as const;
};

// ============================================================================
// EMPTY STATE TOKENS
// ============================================================================

const createEmptyStateTokens = (
  theme: ThemeMode
): {
  container: { padding: number; gap: number };
  icon: {
    size: number;
    color: string;
    containerSize: number;
    containerRadius: number;
    containerBackground: string;
  };
  title: object;
  description: object;
  action: { marginTop: number };
} => {
  const colors = createSemanticColors(theme);

  return {
    container: {
      padding: spacingPrimitives['3xl'],
      gap: spacingPrimitives.lg,
    },
    icon: {
      size: sizePrimitives.icon['4xl'],
      color: colors.icon.tertiary,
      containerSize: 96,
      containerRadius: semanticBorder.radius.full,
      containerBackground: colors.background.secondary,
    },
    title: {
      ...semanticTypography.heading.h3,
      color: colors.text.primary,
    },
    description: {
      ...semanticTypography.body.medium,
      color: colors.text.secondary,
    },
    action: {
      marginTop: spacingPrimitives.lg,
    },
  } as const;
};

// ============================================================================
// CREATE COMPONENT TOKENS FUNCTION
// ============================================================================

export const createComponentTokens = (
  theme: ThemeMode
): {
  button: ReturnType<typeof createButtonTokens>;
  card: ReturnType<typeof createCardTokens>;
  input: ReturnType<typeof createInputTokens>;
  modal: ReturnType<typeof createModalTokens>;
  badge: ReturnType<typeof createBadgeTokens>;
  avatar: ReturnType<typeof createAvatarTokens>;
  list: ReturnType<typeof createListTokens>;
  divider: ReturnType<typeof createDividerTokens>;
  tab: ReturnType<typeof createTabTokens>;
  iconButton: ReturnType<typeof createIconButtonTokens>;
  layout: ReturnType<typeof createLayoutTokens>;
  toast: ReturnType<typeof createToastTokens>;
  emptyState: ReturnType<typeof createEmptyStateTokens>;
} => ({
  button: createButtonTokens(theme),
  card: createCardTokens(theme),
  input: createInputTokens(theme),
  modal: createModalTokens(theme),
  badge: createBadgeTokens(theme),
  avatar: createAvatarTokens(theme),
  list: createListTokens(theme),
  divider: createDividerTokens(theme),
  tab: createTabTokens(theme),
  iconButton: createIconButtonTokens(theme),
  layout: createLayoutTokens(theme),
  toast: createToastTokens(theme),
  emptyState: createEmptyStateTokens(theme),
});

export type ComponentTokens = ReturnType<typeof createComponentTokens>;
