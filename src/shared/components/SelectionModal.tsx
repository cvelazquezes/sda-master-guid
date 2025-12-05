/**
 * SelectionModal Component
 * Reusable modal for selecting items from a list
 * Supports dynamic theming (light/dark mode)
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { StandardModal } from './StandardModal';
import { mobileTypography, mobileIconSizes, designTokens, layoutConstants } from '../theme';
import { A11Y_ROLE, ICONS, TOUCH_OPACITY } from '../constants';
import { flexValues, dimensionValues } from '../constants/layoutConstants';

export interface SelectionItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  badge?: string;
  badgeColor?: string;
  disabled?: boolean;
  avatar?: string;
}

interface SelectionModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  items: SelectionItem[];
  onSelectItem: (item: SelectionItem) => void;
  selectedItemId?: string;
  emptyMessage?: string;
  searchable?: boolean;
  multiSelect?: boolean;
}

export const SelectionModal: React.FC<SelectionModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  items,
  onSelectItem,
  selectedItemId,
  emptyMessage,
  searchable = false,
  multiSelect = false,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const displayEmptyMessage = emptyMessage || t('placeholders.noItemsAvailable');

  const renderItem = ({ item }: { item: SelectionItem }) => {
    const isSelected = item.id === selectedItemId;
    const isDisabled = item.disabled;
    const iconColor = item.iconColor || colors.primary;

    return (
      <TouchableOpacity
        style={[
          styles.item,
          { backgroundColor: colors.surfaceLight },
          isSelected && { backgroundColor: colors.successLight, borderWidth: designTokens.borderWidth.medium, borderColor: colors.success },
          isDisabled && styles.itemDisabled,
        ]}
        onPress={() => !isDisabled && onSelectItem(item)}
        disabled={isDisabled}
        activeOpacity={TOUCH_OPACITY.default}
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={`${item.title}${item.subtitle ? `. ${item.subtitle}` : ''}`}
        accessibilityState={{ selected: isSelected, disabled: isDisabled }}
      >
        {/* Icon or Avatar */}
        {item.icon && (
          <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
            <MaterialCommunityIcons
              name={item.icon as any}
              size={mobileIconSizes.medium}
              color={iconColor}
            />
          </View>
        )}

        {item.avatar && (
          <View style={[styles.avatar, { backgroundColor: iconColor }]}>
            <Text style={styles.avatarText}>{item.avatar}</Text>
          </View>
        )}

        {/* Content */}
        <View style={styles.itemContent}>
          <Text style={[
            styles.itemTitle, 
            { color: colors.textPrimary },
            isDisabled && { color: colors.textTertiary }
          ]}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={[
              styles.itemSubtitle, 
              { color: colors.textSecondary },
              isDisabled && { color: colors.textTertiary }
            ]}>
              {item.subtitle}
            </Text>
          )}
          {item.badge && (
            <View style={[styles.badge, { backgroundColor: `${item.badgeColor || colors.primary}20` }]}>
              <MaterialCommunityIcons
                name={ICONS.CHECK_CIRCLE}
                size={mobileIconSizes.tiny}
                color={item.badgeColor || colors.primary}
              />
              <Text style={[styles.badgeText, { color: item.badgeColor || colors.primary }]}>
                {item.badge}
              </Text>
            </View>
          )}
        </View>

        {/* Selection Indicator */}
        <MaterialCommunityIcons
          name={isSelected ? ICONS.CHECK_CIRCLE : ICONS.CHEVRON_RIGHT}
          size={mobileIconSizes.medium}
          color={isSelected ? colors.success : colors.textTertiary}
        />
      </TouchableOpacity>
    );
  };

  return (
    <StandardModal
      visible={visible}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      scrollable={false}
      maxHeight={dimensionValues.maxHeightPercent.eightyFive}
    >
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name={ICONS.INBOX} size={designTokens.iconSize['3xl']} color={colors.textTertiary} />
          <Text style={[styles.emptyText, { color: colors.textTertiary }]}>{displayEmptyMessage}</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      )}
    </StandardModal>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: flexValues.one,
  },
  listContent: {
    padding: designTokens.spacing.md,
  },
  item: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.sm,
    minHeight: dimensionValues.minHeight.selectionItem,
  },
  itemDisabled: {
    opacity: designTokens.opacity.medium,
  },
  iconContainer: {
    width: designTokens.componentSizes.iconContainer.md,
    height: designTokens.componentSizes.iconContainer.md,
    borderRadius: designTokens.borderRadius.xxl,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    marginRight: designTokens.spacing.md,
  },
  avatar: {
    width: designTokens.componentSizes.iconContainer.md,
    height: designTokens.componentSizes.iconContainer.md,
    borderRadius: designTokens.borderRadius.xxl,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    marginRight: designTokens.spacing.md,
  },
  avatarText: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.white,
  },
  itemContent: {
    flex: flexValues.one,
    marginRight: designTokens.spacing.md,
  },
  itemTitle: {
    ...mobileTypography.bodyMediumBold,
  },
  itemSubtitle: {
    ...mobileTypography.caption,
    marginTop: designTokens.spacing.xs,
  },
  badge: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    marginTop: designTokens.spacing.sm,
    alignSelf: layoutConstants.alignSelf.flexStart,
  },
  badgeText: {
    ...mobileTypography.caption,
    fontWeight: designTokens.fontWeight.semibold,
  },
  emptyContainer: {
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    padding: designTokens.spacing['6xl'],
  },
  emptyText: {
    ...mobileTypography.bodyMedium,
    marginTop: designTokens.spacing.lg,
    textAlign: layoutConstants.textAlign.center,
  },
});
