/**
 * FilterModal Component
 * Reusable modal for filtering with sections and options
 * Supports dynamic theming (light/dark mode)
 */

import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { designTokens } from '../theme/designTokens';
import { mobileTypography } from '../theme/mobileTypography';

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
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  title = 'Filters',
  sections,
  onClose,
  onClear,
  onApply,
  onSelectOption,
  children,
}) => {
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 768;

  const isOptionSelected = (sectionId: string, value: string): boolean => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return false;
    
    if (Array.isArray(section.selectedValue)) {
      return section.selectedValue.includes(value);
    }
    return section.selectedValue === value;
  };

  return (
    <Modal
      visible={visible}
      animationType={isMobile ? "slide" : "fade"}
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, isMobile && styles.overlayMobile]}>
        <View style={[styles.content, { backgroundColor: colors.surface }, isMobile && styles.contentMobile]}>
          {/* Drag Handle - Mobile Only */}
          {isMobile && (
            <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />
          )}

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Close filters"
            >
              <MaterialCommunityIcons
                name="close"
                size={designTokens.icon.sizes.lg}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Body - Scrollable Sections */}
          <ScrollView style={styles.body}>
            {sections.map((section) => (
              <View key={section.id} style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{section.title}</Text>
                
                {/* Info Banner (optional) */}
                {section.infoBanner && (
                  <View style={[styles.infoBanner, { backgroundColor: colors.primaryAlpha10 }]}>
                    <MaterialCommunityIcons
                      name={section.infoBanner.icon as any}
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
                        isSelected && { backgroundColor: colors.primaryAlpha10, borderWidth: 2, borderColor: colors.primary },
                      ]}
                      onPress={() => onSelectOption(section.id, option.value.toString())}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={option.label}
                      accessibilityState={{ selected: isSelected }}
                    >
                      <View style={styles.optionContent}>
                        {option.icon && (
                          <MaterialCommunityIcons
                            name={option.icon as any}
                            size={designTokens.icon.sizes.md}
                            color={isSelected ? colors.primary : (option.color || colors.textSecondary)}
                          />
                        )}
                        <Text
                          style={[
                            styles.optionText,
                            { color: colors.textSecondary },
                            isSelected && { color: colors.primary, fontWeight: '600' },
                          ]}
                        >
                          {option.label}
                        </Text>
                      </View>
                      {isSelected && (
                        <MaterialCommunityIcons
                          name="check"
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
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Clear all filters"
            >
              <MaterialCommunityIcons name="filter-off" size={20} color={colors.textSecondary} />
              <Text style={[styles.clearButtonText, { color: colors.textSecondary }]}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: colors.primary }]}
              onPress={onApply}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Apply filters"
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: designTokens.spacing.lg,
  },
  overlayMobile: {
    justifyContent: 'flex-end',
    padding: 0,
  },
  content: {
    borderRadius: designTokens.borderRadius.xxl,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  contentMobile: {
    maxWidth: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: designTokens.borderRadius.xxl,
    borderTopRightRadius: designTokens.borderRadius.xxl,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: designTokens.borderRadius.full,
    alignSelf: 'center',
    marginTop: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    maxHeight: 500,
  },
  section: {
    padding: designTokens.spacing.lg,
  },
  sectionTitle: {
    ...mobileTypography.heading4,
    marginBottom: designTokens.spacing.md,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    marginBottom: designTokens.spacing.md,
    gap: designTokens.spacing.sm,
  },
  infoBannerText: {
    flex: 1,
    ...mobileTypography.bodySmall,
    lineHeight: 18,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.sm,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.md,
    flex: 1,
  },
  optionText: {
    ...mobileTypography.bodyLarge,
  },
  footer: {
    flexDirection: 'row',
    padding: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
    borderTopWidth: designTokens.borderWidth.thin,
  },
  clearButton: {
    flex: 1,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: designTokens.spacing.xs,
    minHeight: 48,
  },
  clearButtonText: {
    fontSize: designTokens.typography.fontSizes.md,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  applyButtonText: {
    fontSize: designTokens.typography.fontSizes.md,
    fontWeight: '600',
    color: '#fff',
  },
});

export default FilterModal;

