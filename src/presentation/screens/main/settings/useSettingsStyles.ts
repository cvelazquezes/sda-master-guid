/**
 * Settings Screen Styles Hook
 *
 * ✅ COMPLIANT: Provides memoized styles using useTheme() values
 *
 * Usage:
 * ```
 * const { styles, quickActionStyles, sectionStyles, menuItemStyles, skeletonStyles } = useSettingsStyles();
 * ```
 */
import { useMemo } from 'react';
import {
  createMenuItemStyles,
  createQuickActionStyles,
  createSectionStyles,
  createSkeletonStyles,
  createStyles,
} from './styles';
import { useTheme } from '../../../state/ThemeContext';

export function useSettingsStyles(): {
  styles: ReturnType<typeof createStyles>;
  quickActionStyles: ReturnType<typeof createQuickActionStyles>;
  sectionStyles: ReturnType<typeof createSectionStyles>;
  menuItemStyles: ReturnType<typeof createMenuItemStyles>;
  skeletonStyles: ReturnType<typeof createSkeletonStyles>;
} {
  const theme = useTheme();

  const styles = useMemo(
    () => createStyles(theme),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- theme object parts are sufficient
    [
      theme.spacing,
      theme.radii,
      theme.typography,
      theme.shadows,
      theme.componentSizes,
      theme.avatarSizes,
      theme.borderWidths,
      theme.lineHeights,
    ]
  );

  const quickActionStyles = useMemo(
    () => createQuickActionStyles(theme),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- theme object parts are sufficient
    [
      theme.spacing,
      theme.radii,
      theme.typography,
      theme.shadows,
      theme.componentSizes,
      theme.avatarSizes,
      theme.borderWidths,
      theme.lineHeights,
    ]
  );

  const sectionStyles = useMemo(
    () => createSectionStyles(theme),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- theme object parts are sufficient
    [
      theme.spacing,
      theme.radii,
      theme.typography,
      theme.shadows,
      theme.componentSizes,
      theme.avatarSizes,
      theme.borderWidths,
      theme.lineHeights,
    ]
  );

  const menuItemStyles = useMemo(
    () => createMenuItemStyles(theme),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- theme object parts are sufficient
    [
      theme.spacing,
      theme.radii,
      theme.typography,
      theme.shadows,
      theme.componentSizes,
      theme.avatarSizes,
      theme.borderWidths,
      theme.lineHeights,
    ]
  );

  const skeletonStyles = useMemo(
    () => createSkeletonStyles(theme),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- theme object parts are sufficient
    [
      theme.spacing,
      theme.radii,
      theme.typography,
      theme.shadows,
      theme.componentSizes,
      theme.avatarSizes,
      theme.borderWidths,
      theme.lineHeights,
    ]
  );

  return {
    styles,
    quickActionStyles,
    sectionStyles,
    menuItemStyles,
    skeletonStyles,
  };
}
