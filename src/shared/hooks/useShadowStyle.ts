/**
 * useShadowStyle Hook
 *
 * Centralized shadow style generation for themed components.
 * Provides consistent shadow styles that adapt to light/dark themes.
 *
 * @example
 * const { getShadow } = useShadowStyle();
 *
 * const cardShadow = getShadow('card');
 * const modalShadow = getShadow('modal');
 */

import { useMemo, useCallback } from 'react';
import { ViewStyle, Platform } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../theme/designTokens';
import { ShadowPreset } from '../types/theme';

interface ShadowConfig {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

/* eslint-disable no-magic-numbers */
// Shadow constants - these are design tokens for shadow presets
const SHADOW_OFFSET = {
  subtle: 1,
  card: 2,
  elevated: 4,
  modal: 8,
} as const;

const SHADOW_RADIUS = {
  subtle: 2,
  card: 4,
  elevated: 8,
  modal: 16,
} as const;

const SHADOW_OPACITY = {
  modal_light: 0.25,
  modal_dark: 0.5,
} as const;

const MODAL_ELEVATION = 24;
/* eslint-enable no-magic-numbers */

interface UseShadowStyleReturn {
  /** Get shadow style by preset name */
  getShadow: (preset: ShadowPreset) => ViewStyle;

  /** Get raw shadow configuration by preset */
  getShadowConfig: (preset: ShadowPreset) => ShadowConfig;

  /** Whether dark mode is active (shadows are stronger in dark mode) */
  isDark: boolean;
}

// Shadow presets with light/dark variants
const SHADOW_PRESETS: Record<ShadowPreset, { light: ShadowConfig; dark: ShadowConfig }> = {
  none: {
    light: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    dark: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
  },
  subtle: {
    light: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: SHADOW_OFFSET.subtle },
      shadowOpacity: designTokens.shadowConfig.lightSubtle.opacity,
      shadowRadius: SHADOW_RADIUS.subtle,
      elevation: designTokens.shadowConfig.lightSubtle.elevation,
    },
    dark: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: SHADOW_OFFSET.subtle },
      shadowOpacity: designTokens.shadowConfig.darkSubtle.opacity,
      shadowRadius: SHADOW_RADIUS.subtle,
      elevation: designTokens.shadowConfig.darkSubtle.elevation,
    },
  },
  card: {
    light: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: SHADOW_OFFSET.card },
      shadowOpacity: designTokens.shadowConfig.light.opacity,
      shadowRadius: SHADOW_RADIUS.card,
      elevation: designTokens.shadowConfig.light.elevation,
    },
    dark: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: SHADOW_OFFSET.card },
      shadowOpacity: designTokens.shadowConfig.dark.opacity,
      shadowRadius: SHADOW_RADIUS.card,
      elevation: designTokens.shadowConfig.dark.elevation,
    },
  },
  elevated: {
    light: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: SHADOW_OFFSET.elevated },
      shadowOpacity: designTokens.shadowConfig.lightStrong.opacity,
      shadowRadius: SHADOW_RADIUS.elevated,
      elevation: designTokens.shadowConfig.lightStrong.elevation,
    },
    dark: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: SHADOW_OFFSET.elevated },
      shadowOpacity: designTokens.shadowConfig.darkStrong.opacity,
      shadowRadius: SHADOW_RADIUS.elevated,
      elevation: designTokens.shadowConfig.darkStrong.elevation,
    },
  },
  modal: {
    light: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: SHADOW_OFFSET.modal },
      shadowOpacity: SHADOW_OPACITY.modal_light,
      shadowRadius: SHADOW_RADIUS.modal,
      elevation: MODAL_ELEVATION,
    },
    dark: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: SHADOW_OFFSET.modal },
      shadowOpacity: SHADOW_OPACITY.modal_dark,
      shadowRadius: SHADOW_RADIUS.modal,
      elevation: MODAL_ELEVATION,
    },
  },
};

/**
 * Hook for centralized shadow style generation
 * Shadows automatically adapt to light/dark theme
 */
export const useShadowStyle = (): UseShadowStyleReturn => {
  const { colors, isDark } = useTheme();

  /**
   * Get the raw shadow configuration for a preset
   */
  const getShadowConfig = useCallback(
    (preset: ShadowPreset): ShadowConfig => {
      const presetConfig = SHADOW_PRESETS[preset];
      const config = isDark ? presetConfig.dark : presetConfig.light;

      // Use theme shadow color if available, otherwise fallback to default
      return {
        ...config,
        shadowColor: colors.shadow || config.shadowColor,
      };
    },
    [isDark, colors.shadow]
  );

  /**
   * Get shadow style as ViewStyle object
   * Handles platform differences (iOS uses shadow*, Android uses elevation)
   */
  const getShadow = useCallback(
    (preset: ShadowPreset): ViewStyle => {
      const config = getShadowConfig(preset);

      // For Android, elevation is the primary shadow mechanism
      // For iOS, we use the full shadow properties
      if (Platform.OS === 'android') {
        return {
          elevation: config.elevation,
          // Android needs shadowColor for elevation tint
          shadowColor: config.shadowColor,
        };
      }

      return {
        shadowColor: config.shadowColor,
        shadowOffset: config.shadowOffset,
        shadowOpacity: config.shadowOpacity,
        shadowRadius: config.shadowRadius,
        // Still include elevation for compatibility
        elevation: config.elevation,
      };
    },
    [getShadowConfig]
  );

  return useMemo(
    () => ({
      getShadow,
      getShadowConfig,
      isDark,
    }),
    [getShadow, getShadowConfig, isDark]
  );
};

export default useShadowStyle;
