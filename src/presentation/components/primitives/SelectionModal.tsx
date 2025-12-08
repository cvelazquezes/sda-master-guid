/**
 * SelectionModal Component
 * Reusable modal for selecting items from a list
 * Supports dynamic theming (light/dark mode)
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../state/ThemeContext';
import { StandardModal as Modal } from './StandardModal';
import { mobileIconSizes, designTokens, layoutConstants } from '../../theme';
import {
  A11Y_ROLE,
  EMPTY_VALUE,
  ICONS,
  TOUCH_OPACITY,
  DIMENSIONS,
  FLEX,
  TEXT_VARIANT,
  TEXT_COLOR,
  TEXT_WEIGHT,
  TEXT_ALIGN,
} from '../../../shared/constants';
import { Text } from './Text';

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
  /** Empty state message (pass translated string from screen) */
  emptyMessage?: string;
  searchable?: boolean;
  multiSelect?: boolean;
  /** Accessibility label for close button (pass translated string from screen) */
  closeButtonLabel?: string;
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
  searchable: _searchable = false,
  multiSelect: _multiSelect = false,
  closeButtonLabel,
}) => {
  const { colors } = useTheme();
  const displayEmptyMessage = emptyMessage || EMPTY_VALUE;

  const renderItem = ({ item }: { item: SelectionItem }): React.JSX.Element => {
    const isSelected = item.id === selectedItemId;
    const isDisabled = item.disabled;
    const iconColor = item.iconColor || colors.primary;

    return (
      <TouchableOpacity
        style={[
          styles.item,
          { backgroundColor: colors.surfaceLight },
          isSelected && {
            backgroundColor: colors.successLight,
            borderWidth: designTokens.borderWidth.medium,
            borderColor: colors.success,
          },
          isDisabled && styles.itemDisabled,
        ]}
        onPress={() => !isDisabled && onSelectItem(item)}
        disabled={isDisabled}
        activeOpacity={TOUCH_OPACITY.default}
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={`${item.title}${item.subtitle ? `. ${item.subtitle}` : EMPTY_VALUE}`}
        accessibilityState={{ selected: isSelected, disabled: isDisabled }}
      >
        {/* Icon or Avatar */}
        {item.icon && (
          <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
            <MaterialCommunityIcons
              name={item.icon as typeof ICONS.CHECK}
              size={mobileIconSizes.medium}
              color={iconColor}
            />
          </View>
        )}

        {item.avatar && (
          <View style={[styles.avatar, { backgroundColor: iconColor }]}>
            <Text
              variant={TEXT_VARIANT.BODY}
              weight={TEXT_WEIGHT.BOLD}
              color={TEXT_COLOR.ON_PRIMARY}
            >
              {item.avatar}
            </Text>
          </View>
        )}

        {/* Content */}
        <View style={styles.itemContent}>
          <Text
            variant={TEXT_VARIANT.BODY}
            weight={TEXT_WEIGHT.BOLD}
            color={isDisabled ? TEXT_COLOR.TERTIARY : TEXT_COLOR.PRIMARY}
          >
            {item.title}
          </Text>
          {item.subtitle && (
            <Text
              variant={TEXT_VARIANT.CAPTION}
              color={isDisabled ? TEXT_COLOR.TERTIARY : TEXT_COLOR.SECONDARY}
              style={styles.itemSubtitle}
            >
              {item.subtitle}
            </Text>
          )}
          {item.badge && (
            <View
              style={[styles.badge, { backgroundColor: `${item.badgeColor || colors.primary}20` }]}
            >
              <MaterialCommunityIcons
                name={ICONS.CHECK_CIRCLE}
                size={mobileIconSizes.tiny}
                color={item.badgeColor || colors.primary}
              />
              <Text
                variant={TEXT_VARIANT.CAPTION}
                weight={TEXT_WEIGHT.SEMIBOLD}
                style={{ color: item.badgeColor || colors.primary }}
              >
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
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      scrollable={false}
      maxHeight={DIMENSIONS.MAX_HEIGHT_PERCENT.EIGHTY_FIVE}
      closeButtonLabel={closeButtonLabel}
    >
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name={ICONS.INBOX}
            size={designTokens.iconSize['3xl']}
            color={colors.textTertiary}
          />
          <Text
            variant={TEXT_VARIANT.BODY}
            color={TEXT_COLOR.TERTIARY}
            align={TEXT_ALIGN.CENTER}
            style={styles.emptyText}
          >
            {displayEmptyMessage}
          </Text>
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: FLEX.ONE,
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
    minHeight: DIMENSIONS.MIN_HEIGHT.SELECTION_ITEM,
  },
  itemDisabled: {
    opacity: designTokens.opacity.medium,
  },
  iconContainer: {
    width: designTokens.componentSizes.iconContainer.md,
    height: designTokens.componentSizes.iconContainer.md,
    borderRadius: designTokens.borderRadius['2xl'],
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    marginRight: designTokens.spacing.md,
  },
  avatar: {
    width: designTokens.componentSizes.iconContainer.md,
    height: designTokens.componentSizes.iconContainer.md,
    borderRadius: designTokens.borderRadius['2xl'],
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    marginRight: designTokens.spacing.md,
  },
  itemContent: {
    flex: FLEX.ONE,
    marginRight: designTokens.spacing.md,
  },
  itemSubtitle: {
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
  emptyContainer: {
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    padding: designTokens.spacing['6xl'],
  },
  emptyText: {
    marginTop: designTokens.spacing.lg,
  },
});
