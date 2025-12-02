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
import { useTheme } from '../../contexts/ThemeContext';
import { StandardModal } from './StandardModal';
import { mobileTypography, mobileIconSizes } from '../theme';
import { designTokens } from '../theme/designTokens';

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
  emptyMessage = 'No items available',
  searchable = false,
  multiSelect = false,
}) => {
  const { colors } = useTheme();

  const renderItem = ({ item }: { item: SelectionItem }) => {
    const isSelected = item.id === selectedItemId;
    const isDisabled = item.disabled;
    const iconColor = item.iconColor || colors.primary;

    return (
      <TouchableOpacity
        style={[
          styles.item,
          { backgroundColor: colors.surfaceLight },
          isSelected && { backgroundColor: colors.successLight, borderWidth: 2, borderColor: colors.success },
          isDisabled && styles.itemDisabled,
        ]}
        onPress={() => !isDisabled && onSelectItem(item)}
        disabled={isDisabled}
        activeOpacity={0.7}
        accessibilityRole="button"
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
                name="check-circle"
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
          name={isSelected ? 'check-circle' : 'chevron-right'}
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
      maxHeight="85%"
    >
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="inbox" size={64} color={colors.textTertiary} />
          <Text style={[styles.emptyText, { color: colors.textTertiary }]}>{emptyMessage}</Text>
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
    flex: 1,
  },
  listContent: {
    padding: designTokens.spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.sm,
    minHeight: 60,
  },
  itemDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: designTokens.borderRadius.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: designTokens.borderRadius.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    ...mobileTypography.bodyMediumBold,
    color: '#fff',
  },
  itemContent: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    ...mobileTypography.bodyMediumBold,
  },
  itemSubtitle: {
    ...mobileTypography.caption,
    marginTop: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: designTokens.borderRadius.lg,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    ...mobileTypography.caption,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
  },
  emptyText: {
    ...mobileTypography.bodyMedium,
    marginTop: 16,
    textAlign: 'center',
  },
});
