/**
 * Design Token Type Definitions
 *
 * Comprehensive TypeScript types for the design token system.
 * Use these types to ensure type-safe token consumption throughout the app.
 */

import type { BehaviorTokens } from './behavior';
import type { ComponentTokens } from './components';
import type { LayoutTokens } from './layout';
import type { MotionTokens } from './motion';
import type {
  PrimitiveTokens,
  colorPrimitives,
  spacingPrimitives,
  radiusPrimitives,
  typographyPrimitives,
} from './primitives';
import type { SemanticTokens, SemanticColors, ThemeMode } from './semantic';
import type { TextStyle } from 'react-native';

// ============================================================================
// THEME TYPES
// ============================================================================

// ThemeMode is exported from semantic.ts to avoid duplicate exports

export type ActiveTheme = 'light' | 'dark';

export type ThemeConfig = {
  mode: ThemeMode;
  activeTheme: ActiveTheme;
};

// ============================================================================
// COLOR TYPES
// ============================================================================

export type ColorScale = keyof typeof colorPrimitives.blue;

export type BrandColorKey =
  | 'primary'
  | 'primaryHover'
  | 'primaryActive'
  | 'primarySubtle'
  | 'primaryMuted'
  | 'secondary'
  | 'secondaryHover'
  | 'secondaryActive'
  | 'secondarySubtle'
  | 'secondaryMuted'
  | 'accent'
  | 'accentHover'
  | 'accentActive'
  | 'accentSubtle'
  | 'accentMuted';

export type FeedbackColorKey =
  | 'success'
  | 'successSubtle'
  | 'successMuted'
  | 'successText'
  | 'warning'
  | 'warningSubtle'
  | 'warningMuted'
  | 'warningText'
  | 'error'
  | 'errorSubtle'
  | 'errorMuted'
  | 'errorText'
  | 'info'
  | 'infoSubtle'
  | 'infoMuted'
  | 'infoText';

export type TextColorKey =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'quaternary'
  | 'disabled'
  | 'placeholder'
  | 'inverse'
  | 'onPrimary'
  | 'onSecondary'
  | 'onAccent'
  | 'onSurface'
  | 'link'
  | 'linkHover';

export type BackgroundColorKey =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'surface'
  | 'surfaceElevated'
  | 'surfaceSubdued'
  | 'hover'
  | 'pressed'
  | 'selected'
  | 'disabled'
  | 'input'
  | 'inputFocused'
  | 'overlay'
  | 'backdrop'
  | 'scrim';

export type BorderColorKey =
  | 'default'
  | 'subtle'
  | 'muted'
  | 'strong'
  | 'focus'
  | 'error'
  | 'success'
  | 'warning'
  | 'disabled';

// ============================================================================
// SPACING TYPES
// ============================================================================

export type SpacingKey = keyof typeof spacingPrimitives.px;

export type SemanticSpacingKey =
  | 'none'
  | 'xxs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | '8xl';

// ============================================================================
// TYPOGRAPHY TYPES
// ============================================================================

export type FontSizeKey = keyof typeof typographyPrimitives.fontSize;

export type FontWeightKey = keyof typeof typographyPrimitives.fontWeight;

export type LineHeightKey = keyof typeof typographyPrimitives.lineHeight;

export type LetterSpacingKey = keyof typeof typographyPrimitives.letterSpacing;

export type TypographyStyle = {
  fontSize: number;
  fontWeight: TextStyle['fontWeight'];
  lineHeight?: number | TextStyle['lineHeight'];
  letterSpacing?: number;
  fontFamily?: string;
};

// ============================================================================
// BORDER TYPES
// ============================================================================

export type BorderRadiusKey = keyof typeof radiusPrimitives;

export type BorderStyle = {
  borderWidth: number;
  borderColor: string;
  borderRadius?: number;
};

// ============================================================================
// SHADOW TYPES
// ============================================================================

export type ShadowStyle = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

export type ShadowKey = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

// ============================================================================
// COMPONENT TYPES
// ============================================================================

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'danger'
  | 'success'
  | 'outline'
  | 'ghost';

export type ButtonSize = 'small' | 'medium' | 'large';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export type BadgeSize = 'small' | 'medium' | 'large';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export type ToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

// ============================================================================
// MOTION TYPES
// ============================================================================

export type DurationKey =
  | 'instant'
  | 'ultraFast'
  | 'fast'
  | 'normal'
  | 'slow'
  | 'slower'
  | 'slowest'
  | 'micro'
  | 'short'
  | 'medium'
  | 'long';

export type EasingKey =
  | 'linear'
  | 'ease'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'standard'
  | 'decelerate'
  | 'accelerate'
  | 'sharp'
  | 'overshoot'
  | 'bounce'
  | 'elastic'
  | 'spring'
  | 'iosSpring';

export type SpringPreset = 'gentle' | 'default' | 'stiff' | 'bouncy' | 'modal' | 'press';

export type SpringConfig = {
  damping: number;
  mass: number;
  stiffness: number;
  overshootClamping: boolean;
  restSpeedThreshold: number;
  restDisplacementThreshold: number;
};

// ============================================================================
// STATUS & ROLE TYPES
// ============================================================================

export type UserRole = 'admin' | 'clubAdmin' | 'user';

export type Status =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'paused'
  | 'completed'
  | 'scheduled'
  | 'skipped'
  | 'cancelled';

export type HierarchyLevel = 'division' | 'union' | 'association' | 'church' | 'club';

export type StatusColors = {
  primary: string;
  subtle: string;
  text: string;
};

// ============================================================================
// RESOLVED TOKENS INTERFACE
// ============================================================================

export type ResolvedDesignTokens = {
  // Theme info
  theme: ActiveTheme;
  isDark: boolean;

  // Token categories
  primitives: PrimitiveTokens;
  semantic: SemanticTokens;
  components: ComponentTokens;
  motion: MotionTokens;
  layout: LayoutTokens;
  behavior: BehaviorTokens;

  // Convenience accessors
  colors: SemanticColors;
};

// ============================================================================
// TOKEN PATH TYPES (for token resolution)
// ============================================================================

export type TokenPath = string;

export type TokenValue = string | number | Record<string, unknown>;

// ============================================================================
// STYLE BUILDER TYPES
// ============================================================================

export type StyleTokens = {
  spacing: (key: SemanticSpacingKey) => number;
  color: (path: string) => string;
  typography: (style: keyof typeof typographyPrimitives.fontSize) => TypographyStyle;
  shadow: (key: ShadowKey) => ShadowStyle;
  radius: (key: BorderRadiusKey) => number;
};

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Helper type to extract keys from nested objects
 */
export type NestedKeyOf<T> = {
  [K in keyof T & string]: T[K] extends object ? `${K}` | `${K}.${NestedKeyOf<T[K]>}` : `${K}`;
}[keyof T & string];
