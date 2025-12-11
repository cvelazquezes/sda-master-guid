/**
 * Formatters - Utility functions for formatting data
 *
 * This module provides consistent formatting functions for displaying
 * data throughout the application, with i18n support.
 */

import type { TFunction } from 'i18next';

/**
 * Format match frequency with i18n support
 * @param frequency - The frequency key (e.g., 'bi_weekly', 'weekly', 'monthly')
 * @param t - i18next translation function
 * @returns Translated frequency string or fallback with dashes instead of underscores
 */
export const formatMatchFrequency = (frequency: string, t: TFunction): string => {
  const key = `club.matchFrequency.${frequency}`;
  const translated = t(key);

  // If translation exists and is not the key itself, return it
  if (translated && translated !== key) {
    return translated;
  }

  // Fallback: replace underscores with dashes
  return frequency.replace(/_/g, '-');
};

/**
 * Format members count with i18n support
 * @param count - Number of members
 * @param t - i18next translation function
 * @returns Translated members count string
 */
export const formatMembersCount = (count: number, t: TFunction): string => {
  return t('club.membersCount', { count });
};

/**
 * Format group size with i18n support
 * @param size - Group size number
 * @param t - i18next translation function
 * @returns Formatted group size string (e.g., "5/group")
 */
export const formatGroupSize = (size: number, t: TFunction): string => {
  return `${size}${t('club.perGroup')}`;
};

/**
 * Format accessibility label for view details
 * @param name - Name of the item
 * @param t - i18next translation function
 * @returns Translated accessibility label
 */
export const formatViewDetailsLabel = (name: string, t: TFunction): string => {
  return t('accessibility.viewDetailsFor', { name });
};

/**
 * Format accessibility label for delete action
 * @param name - Name of the item to delete
 * @param t - i18next translation function
 * @returns Translated accessibility label
 */
export const formatDeleteLabel = (name: string, t: TFunction): string => {
  return t('accessibility.deleteItem', { name });
};

/**
 * Format accessibility label for activate/deactivate action
 * @param item - Name of the item
 * @param isActive - Current active state
 * @param t - i18next translation function
 * @returns Translated accessibility label
 */
export const formatToggleStatusLabel = (item: string, isActive: boolean, t: TFunction): string => {
  return isActive
    ? t('accessibility.deactivateItem', { item })
    : t('accessibility.activateItem', { item });
};
