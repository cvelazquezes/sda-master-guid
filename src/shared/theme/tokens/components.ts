/**
 * Component Design Tokens
 *
 * Pre-composed tokens for specific UI components.
 * These tokens combine semantic tokens into ready-to-use component configurations.
 *
 * USAGE:
 * const tokens = useDesignTokens();
 * const buttonStyle = tokens.components.button.primary;
 */

import { TextStyle } from 'react-native';
import { createSemanticColors, semanticTypography, semanticBorder, ThemeMode } from './semantic';
import {
  spacingPrimitives,
  shadowPrimitives,
  opacityPrimitives,
  sizePrimitives,
  borderWidthPrimitives,
} from './primitives';

// ============================================================================
// BUTTON TOKENS
// ============================================================================

const createButtonTokens = (theme: ThemeMode) => {
  const colors = createSemanticColors(theme);

  return {
    sizes: {
      small: {
        paddingVertical: spacingPrimitives.sm,
        paddingHorizontal: spacingPrimitives.md,
        minHeight: 36,
        fontSize: 14,
        iconSize: sizePrimitives.icon.sm,
        borderRadius: semanticBorder.radius.button,
      },
      medium: {
        paddingVertical: spacingPrimitives.md,
        paddingHorizontal: spacingPrimitives.lg,
        minHeight: sizePrimitives.touchTarget.comfortable,
        fontSize: 16,
        iconSize: sizePrimitives.icon.md,
        borderRadius: semanticBorder.radius.button,
      },
      large: {
        paddingVertical: spacingPrimitives.lg,
        paddingHorizontal: spacingPrimitives.xl,
        minHeight: sizePrimitives.touchTarget.spacious,
        fontSize: 18,
        iconSize: sizePrimitives.icon.lg,
        borderRadius: semanticBorder.radius.button,
      },
    },
    variants: {
      primary: {
        backgroundColor: colors.brand.primary,
        color: colors.text.onPrimary,
        borderColor: 'transparent',
      },
      secondary: {
        backgroundColor: colors.brand.secondary,
        color: colors.text.onSecondary,
        borderColor: 'transparent',
      },
      accent: {
        backgroundColor: colors.brand.accent,
        color: colors.text.onAccent,
        borderColor: 'transparent',
      },
      danger: {
        backgroundColor: colors.feedback.error,
        color: colors.text.onPrimary,
        borderColor: 'transparent',
      },
      success: {
        backgroundColor: colors.feedback.success,
        color: colors.text.onPrimary,
        borderColor: 'transparent',
      },
      outline: {
        backgroundColor: 'transparent',
        color: colors.brand.primary,
        borderColor: colors.brand.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.brand.primary,
        borderColor: 'transparent',
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

const createCardTokens = (theme: ThemeMode) => {
  const colors = createSemanticColors(theme);
  const isLight = theme === 'light';

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
        backgroundColor: 'transparent',
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

const createInputTokens = (theme: ThemeMode) => {
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

const createModalTokens = (theme: ThemeMode) => {
  const colors = createSemanticColors(theme);
  const isLight = theme === 'light';

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

const createBadgeTokens = (theme: ThemeMode) => {
  const colors = createSemanticColors(theme);

  return {
    base: {
      borderRadius: semanticBorder.radius.badge,
      paddingVertical: spacingPrimitives.xs,
      paddingHorizontal: spacingPrimitives.sm,
      fontSize: semanticTypography.ui.badge.fontSize,
      fontWeight: semanticTypography.ui.badge.fontWeight as TextStyle['fontWeight'],
      letterSpacing: semanticTypography.ui.badge.letterSpacing,
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
        fontSize: 10,
      },
      medium: {
        paddingVertical: spacingPrimitives.xs,
        paddingHorizontal: spacingPrimitives.sm,
        fontSize: semanticTypography.ui.badge.fontSize,
      },
      large: {
        paddingVertical: spacingPrimitives.sm,
        paddingHorizontal: spacingPrimitives.md,
        fontSize: 14,
      },
    },
  } as const;
};

// ============================================================================
// AVATAR TOKENS
// ============================================================================

const createAvatarTokens = (theme: ThemeMode) => {
  const colors = createSemanticColors(theme);

  return {
    sizes: sizePrimitives.avatar,
    borderRadius: semanticBorder.radius.avatar,
    backgroundColor: colors.brand.primarySubtle,
    textColor: colors.brand.primary,
    borderWidth: borderWidthPrimitives.medium,
    borderColor: colors.border.default,
    fontSize: {
      xs: 10,
      sm: 13,
      md: 16,
      lg: 20,
      xl: 28,
      '2xl': 36,
      '3xl': 40,
    },
  } as const;
};

// ============================================================================
// LIST TOKENS
// ============================================================================

const createListTokens = (theme: ThemeMode) => {
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

const createDividerTokens = (theme: ThemeMode) => {
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

const createTabTokens = (theme: ThemeMode) => {
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

const createIconButtonTokens = (theme: ThemeMode) => {
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
        backgroundColor: 'transparent',
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

const createLayoutTokens = (theme: ThemeMode) => {
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

const createToastTokens = (theme: ThemeMode) => {
  const colors = createSemanticColors(theme);
  const isLight = theme === 'light';

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

const createEmptyStateTokens = (theme: ThemeMode) => {
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
    message: {
      ...semanticTypography.body.medium,
      color: colors.text.secondary,
    },
  } as const;
};

// ============================================================================
// CREATE COMPONENT TOKENS FUNCTION
// ============================================================================

export const createComponentTokens = (theme: ThemeMode) => ({
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
