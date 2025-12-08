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
import { useTheme } from '../../../state/ThemeContext';
import {
  createStyles,
  createQuickActionStyles,
  createSectionStyles,
  createMenuItemStyles,
  createSkeletonStyles,
} from './styles';

export function useSettingsStyles() {
  const theme = useTheme();

  const styles = useMemo(
    () => createStyles(theme),
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

