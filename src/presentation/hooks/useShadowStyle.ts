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
import { useTheme } from '../state/ThemeContext';
import { designTokens } from '../theme/designTokens';
import { ShadowPreset } from '../../shared/types/theme';
import {
  SHADOW_HEIGHT,
  SHADOW_BLUR,
  SHADOW_OPACITY,
  MODAL_ELEVATION,
  SHADOW_COLOR,
} from '../../shared/constants/numbers';
import { PLATFORM_OS } from '../../shared/constants/app';

interface ShadowConfig {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

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
      shadowColor: SHADOW_COLOR.NONE,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    dark: {
      shadowColor: SHADOW_COLOR.NONE,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
  },
  subtle: {
    light: {
      shadowColor: SHADOW_COLOR.DEFAULT,
      shadowOffset: { width: 0, height: SHADOW_HEIGHT.SUBTLE },
      shadowOpacity: designTokens.shadowConfig.lightSubtle.opacity,
      shadowRadius: SHADOW_BLUR.SUBTLE,
      elevation: designTokens.shadowConfig.lightSubtle.elevation,
    },
    dark: {
      shadowColor: SHADOW_COLOR.DEFAULT,
      shadowOffset: { width: 0, height: SHADOW_HEIGHT.SUBTLE },
      shadowOpacity: designTokens.shadowConfig.darkSubtle.opacity,
      shadowRadius: SHADOW_BLUR.SUBTLE,
      elevation: designTokens.shadowConfig.darkSubtle.elevation,
    },
  },
  card: {
    light: {
      shadowColor: SHADOW_COLOR.DEFAULT,
      shadowOffset: { width: 0, height: SHADOW_HEIGHT.CARD },
      shadowOpacity: designTokens.shadowConfig.light.opacity,
      shadowRadius: SHADOW_BLUR.CARD,
      elevation: designTokens.shadowConfig.light.elevation,
    },
    dark: {
      shadowColor: SHADOW_COLOR.DEFAULT,
      shadowOffset: { width: 0, height: SHADOW_HEIGHT.CARD },
      shadowOpacity: designTokens.shadowConfig.dark.opacity,
      shadowRadius: SHADOW_BLUR.CARD,
      elevation: designTokens.shadowConfig.dark.elevation,
    },
  },
  elevated: {
    light: {
      shadowColor: SHADOW_COLOR.DEFAULT,
      shadowOffset: { width: 0, height: SHADOW_HEIGHT.ELEVATED },
      shadowOpacity: designTokens.shadowConfig.lightStrong.opacity,
      shadowRadius: SHADOW_BLUR.ELEVATED,
      elevation: designTokens.shadowConfig.lightStrong.elevation,
    },
    dark: {
      shadowColor: SHADOW_COLOR.DEFAULT,
      shadowOffset: { width: 0, height: SHADOW_HEIGHT.ELEVATED },
      shadowOpacity: designTokens.shadowConfig.darkStrong.opacity,
      shadowRadius: SHADOW_BLUR.ELEVATED,
      elevation: designTokens.shadowConfig.darkStrong.elevation,
    },
  },
  modal: {
    light: {
      shadowColor: SHADOW_COLOR.DEFAULT,
      shadowOffset: { width: 0, height: SHADOW_HEIGHT.MODAL },
      shadowOpacity: SHADOW_OPACITY.MODAL_LIGHT,
      shadowRadius: SHADOW_BLUR.MODAL,
      elevation: MODAL_ELEVATION,
    },
    dark: {
      shadowColor: SHADOW_COLOR.DEFAULT,
      shadowOffset: { width: 0, height: SHADOW_HEIGHT.MODAL },
      shadowOpacity: SHADOW_OPACITY.MODAL_DARK,
      shadowRadius: SHADOW_BLUR.MODAL,
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
      if (Platform.OS === PLATFORM_OS.ANDROID) {
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
