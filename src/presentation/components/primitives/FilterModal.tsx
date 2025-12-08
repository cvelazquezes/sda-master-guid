/**
 * FilterModal Component
 * Reusable modal for filtering with sections and options
 * Supports dynamic theming (light/dark mode)
 */

import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../state/ThemeContext';
import { mobileTypography, designTokens, layoutConstants } from '../../theme';
import { A11Y_ROLE, ANIMATION_TYPE, EMPTY_VALUE, ICONS, BORDERS, DIMENSIONS, FLEX } from '../../../shared/constants';

export interface FilterOption {
  id: string;
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
}

export interface FilterSection {
  id: string;
  title: string;
  options: FilterOption[];
  selectedValue?: string | string[];
  multiSelect?: boolean;
  infoBanner?: {
    icon: string;
    text: string;
  };
}

interface FilterModalProps {
  visible: boolean;
  title?: string;
  sections: FilterSection[];
  onClose: () => void;
  onClear: () => void;
  onApply: () => void;
  onSelectOption: (sectionId: string, value: string) => void;
  children?: ReactNode;
  /** Label for close button (pass translated string from screen) */
  closeLabel?: string;
  /** Label for cancel/clear button (pass translated string from screen) */
  cancelLabel?: string;
  /** Label for apply/filter button (pass translated string from screen) */
  applyLabel?: string;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  title,
  sections,
  onClose,
  onClear,
  onApply,
  onSelectOption,
  children,
  closeLabel,
  cancelLabel,
  applyLabel,
}) => {
  const displayTitle = title || EMPTY_VALUE;
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < designTokens.breakpoints.tablet;

  const isOptionSelected = (sectionId: string, value: string): boolean => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) {
      return false;
    }

    if (Array.isArray(section.selectedValue)) {
      return section.selectedValue.includes(value);
    }
    return section.selectedValue === value;
  };

  return (
    <Modal
      visible={visible}
      animationType={isMobile ? ANIMATION_TYPE.SLIDE : ANIMATION_TYPE.FADE}
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, isMobile && styles.overlayMobile]}>
        <View
          style={[
            styles.content,
            { backgroundColor: colors.surface },
            isMobile && styles.contentMobile,
          ]}
        >
          {/* Drag Handle - Mobile Only */}
          {isMobile && <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />}

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{displayTitle}</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessible
              accessibilityRole={A11Y_ROLE.BUTTON}
              accessibilityLabel={closeLabel}
            >
              <MaterialCommunityIcons
                name={ICONS.CLOSE}
                size={designTokens.icon.sizes.lg}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Body - Scrollable Sections */}
          <ScrollView style={styles.body}>
            {sections.map((section) => (
              <View key={section.id} style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  {section.title}
                </Text>

                {/* Info Banner (optional) */}
                {section.infoBanner && (
                  <View style={[styles.infoBanner, { backgroundColor: colors.primaryAlpha10 }]}>
                    <MaterialCommunityIcons
                      name={section.infoBanner.icon as typeof ICONS.CHECK}
                      size={designTokens.icon.sizes.sm}
                      color={colors.primary}
                    />
                    <Text style={[styles.infoBannerText, { color: colors.primary }]}>
                      {section.infoBanner.text}
                    </Text>
                  </View>
                )}

                {/* Options */}
                {section.options.map((option) => {
                  const isSelected = isOptionSelected(section.id, option.value.toString());

                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.option,
                        { backgroundColor: colors.surfaceLight },
                        isSelected && {
                          backgroundColor: colors.primaryAlpha10,
                          borderWidth: designTokens.borderWidth.medium,
                          borderColor: colors.primary,
                        },
                      ]}
                      onPress={() => onSelectOption(section.id, option.value.toString())}
                      accessible
                      accessibilityRole={A11Y_ROLE.BUTTON}
                      accessibilityLabel={option.label}
                      accessibilityState={{ selected: isSelected }}
                    >
                      <View style={styles.optionContent}>
                        {option.icon && (
                          <MaterialCommunityIcons
                            name={option.icon as typeof ICONS.CHECK}
                            size={designTokens.icon.sizes.md}
                            color={
                              isSelected ? colors.primary : option.color || colors.textSecondary
                            }
                          />
                        )}
                        <Text
                          style={[
                            styles.optionText,
                            { color: colors.textSecondary },
                            isSelected && {
                              color: colors.primary,
                              fontWeight: designTokens.fontWeight.semibold,
                            },
                          ]}
                        >
                          {option.label}
                        </Text>
                      </View>
                      {isSelected && (
                        <MaterialCommunityIcons
                          name={ICONS.CHECK}
                          size={designTokens.icon.sizes.md}
                          color={colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}

            {/* Custom children content */}
            {children}
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.clearButton, { backgroundColor: colors.surfaceLight }]}
              onPress={onClear}
              accessible
              accessibilityRole={A11Y_ROLE.BUTTON}
              accessibilityLabel={cancelLabel}
            >
              <MaterialCommunityIcons
                name={ICONS.FILTER}
                size={designTokens.iconSize.md}
                color={colors.textSecondary}
              />
              <Text style={[styles.clearButtonText, { color: colors.textSecondary }]}>
                {cancelLabel}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: colors.primary }]}
              onPress={onApply}
              accessible
              accessibilityRole={A11Y_ROLE.BUTTON}
              accessibilityLabel={applyLabel}
            >
              <Text style={[styles.applyButtonText, { color: colors.textOnPrimary }]}>
                {applyLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: FLEX.ONE,
    backgroundColor: designTokens.overlay.darkMedium,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.lg,
  },
  overlayMobile: {
    justifyContent: layoutConstants.justifyContent.flexEnd,
    padding: designTokens.spacing.none,
  },
  content: {
    borderRadius: designTokens.borderRadius['2xl'],
    width: DIMENSIONS.WIDTH.FULL,
    maxWidth: DIMENSIONS.MAX_WIDTH.MODAL,
    maxHeight: DIMENSIONS.MAX_HEIGHT.MODAL_PERCENT,
  },
  contentMobile: {
    maxWidth: DIMENSIONS.MAX_WIDTH_PERCENT.FULL,
    borderBottomLeftRadius: BORDERS.RADIUS.NONE,
    borderBottomRightRadius: BORDERS.RADIUS.NONE,
    borderTopLeftRadius: designTokens.borderRadius['2xl'],
    borderTopRightRadius: designTokens.borderRadius['2xl'],
  },
  dragHandle: {
    width: designTokens.componentSizes.handleBar.width,
    height: designTokens.componentSizes.handleBar.height,
    borderRadius: designTokens.borderRadius.full,
    alignSelf: layoutConstants.alignSelf.center,
    marginTop: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.xs,
  },
  header: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    borderBottomWidth: designTokens.borderWidth.thin,
  },
  title: {
    ...mobileTypography.heading2,
  },
  closeButton: {
    padding: designTokens.spacing.xs,
  },
  body: {
    maxHeight: DIMENSIONS.MAX_HEIGHT.MODAL_BODY_MEDIUM,
  },
  section: {
    padding: designTokens.spacing.lg,
  },
  sectionTitle: {
    ...mobileTypography.heading4,
    marginBottom: designTokens.spacing.md,
  },
  infoBanner: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.flexStart,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    marginBottom: designTokens.spacing.md,
    gap: designTokens.spacing.sm,
  },
  infoBannerText: {
    flex: FLEX.ONE,
    ...mobileTypography.bodySmall,
    lineHeight: designTokens.lineHeights.body,
  },
  option: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.sm,
  },
  optionContent: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.md,
    flex: FLEX.ONE,
  },
  optionText: {
    ...mobileTypography.bodyLarge,
  },
  footer: {
    flexDirection: layoutConstants.flexDirection.row,
    padding: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
    borderTopWidth: designTokens.borderWidth.thin,
  },
  clearButton: {
    flex: FLEX.ONE,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    alignItems: layoutConstants.alignItems.center,
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.center,
    gap: designTokens.spacing.xs,
    minHeight: DIMENSIONS.MIN_HEIGHT.SELECT_ITEM,
  },
  clearButtonText: {
    fontSize: designTokens.typography.fontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
  },
  applyButton: {
    flex: FLEX.ONE,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    minHeight: DIMENSIONS.MIN_HEIGHT.SELECT_ITEM,
  },
  applyButtonText: {
    fontSize: designTokens.typography.fontSizes.md,
    fontWeight: designTokens.fontWeight.semibold,
  },
});

export default FilterModal;
