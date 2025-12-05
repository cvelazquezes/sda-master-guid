import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { PATHFINDER_CLASSES, PathfinderClass } from '../types';
import { mobileTypography, mobileFontSizes, designTokens, layoutConstants } from '../shared/theme';
import { MESSAGES, ICONS, ANIMATION, A11Y_ROLE } from '../shared/constants';
import { CLASS_SELECTION } from '../shared/constants/businessRules';
import { flexValues } from '../shared/constants/layoutConstants';

interface ClassSelectionModalProps {
  visible: boolean;
  initialClasses: PathfinderClass[];
  onSave: (classes: PathfinderClass[]) => void;
  onClose: () => void;
}

export const ClassSelectionModal: React.FC<ClassSelectionModalProps> = ({
  visible,
  initialClasses,
  onSave,
  onClose,
}) => {
  const [selectedClasses, setSelectedClasses] = useState<PathfinderClass[]>(initialClasses);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  useEffect(() => {
    // Only reset when modal becomes visible, not when initialClasses changes
    if (visible) {
      setSelectedClasses(initialClasses);
    }
  }, [visible]); // Removed initialClasses from dependencies

  // Calculate responsive modal width
  const getModalWidth = () => {
    if (windowWidth > designTokens.breakpoints.desktop) {
      return Math.min(designTokens.responsiveScale.maxWidth.modal, windowWidth * designTokens.responsiveScale.modal.desktop);
    } else if (windowWidth > designTokens.breakpoints.tablet) {
      return Math.min(designTokens.responsiveScale.maxWidth.modalSmall, windowWidth * designTokens.responsiveScale.modal.tablet);
    } else if (windowWidth > designTokens.breakpoints.mobile) {
      return windowWidth * designTokens.responsiveScale.modal.mobileLarge;
    } else {
      return windowWidth * designTokens.responsiveScale.modal.mobile;
    }
  };

  const modalWidth = getModalWidth();
  const modalMaxHeight = windowHeight * designTokens.responsiveScale.maxHeight.modal;

  const toggleClass = (pathfinderClass: PathfinderClass) => {
    if (selectedClasses.includes(pathfinderClass)) {
      // Remove class - but ensure at least 1 remains
      if (selectedClasses.length === CLASS_SELECTION.minimum) {
        Alert.alert(MESSAGES.TITLES.MINIMUM_REQUIRED, MESSAGES.ERRORS.MINIMUM_ONE_CLASS_REQUIRED);
        return;
      }
      setSelectedClasses(selectedClasses.filter((c) => c !== pathfinderClass));
    } else {
      // Add class - but don't exceed maximum
      if (selectedClasses.length === CLASS_SELECTION.maximum) {
        Alert.alert(MESSAGES.TITLES.MAXIMUM_REACHED, MESSAGES.ERRORS.MAXIMUM_CLASSES_REACHED);
        return;
      }
      setSelectedClasses([...selectedClasses, pathfinderClass]);
    }
  };

  const handleSave = () => {
    if (selectedClasses.length === CLASS_SELECTION.empty) {
      Alert.alert(MESSAGES.TITLES.REQUIRED, MESSAGES.ERRORS.PLEASE_SELECT_ONE_CLASS);
      return;
    }
    onSave(selectedClasses);
    onClose();
  };

  const isSelected = (pathfinderClass: PathfinderClass) => {
    return selectedClasses.includes(pathfinderClass);
  };

  const { t } = useTranslation();

  return (
    <Modal visible={visible} animationType={ANIMATION.SLIDE} transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { width: modalWidth, maxHeight: modalMaxHeight }]}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons name={ICONS.SCHOOL} size={designTokens.iconSize.lg} color={designTokens.colors.primary} />
              <Text style={styles.title}>{t('classes.selectClasses')}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} accessibilityRole={A11Y_ROLE.BUTTON} accessibilityLabel={t('accessibility.closeModal')}>
              <MaterialCommunityIcons name={ICONS.CLOSE} size={designTokens.iconSize.lg} color={designTokens.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <MaterialCommunityIcons name={ICONS.INFORMATION} size={designTokens.iconSize.md} color={designTokens.colors.primary} />
            <Text style={styles.infoText}>
              {t('classes.classInfo')} {selectedClasses.length}/{CLASS_SELECTION.maximum}
            </Text>
          </View>

          <ScrollView style={styles.classList}>
            {PATHFINDER_CLASSES.map((pathfinderClass) => (
              <TouchableOpacity
                key={pathfinderClass}
                style={[
                  styles.classOption,
                  isSelected(pathfinderClass) && styles.classOptionSelected,
                ]}
                onPress={() => toggleClass(pathfinderClass)}
              >
                <View style={styles.classOptionContent}>
                  <View
                    style={[
                      styles.checkbox,
                      isSelected(pathfinderClass) && styles.checkboxSelected,
                    ]}
                  >
                    {isSelected(pathfinderClass) && (
                      <MaterialCommunityIcons name={ICONS.CHECK} size={designTokens.iconSize.sm} color={designTokens.colors.textInverse} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.classOptionText,
                      isSelected(pathfinderClass) && styles.classOptionTextSelected,
                    ]}
                  >
                    {pathfinderClass}
                  </Text>
                </View>
                {isSelected(pathfinderClass) && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>
                      {selectedClasses.indexOf(pathfinderClass) + 1}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose} accessibilityRole={A11Y_ROLE.BUTTON}>
              <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} accessibilityRole={A11Y_ROLE.BUTTON}>
              <MaterialCommunityIcons name={ICONS.CHECK} size={designTokens.iconSize.md} color={designTokens.colors.textInverse} />
              <Text style={styles.saveButtonText}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: flexValues.one,
    backgroundColor: designTokens.overlay.darkMedium,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    paddingVertical: designTokens.spacing.xl,
    paddingHorizontal: designTokens.spacing.lg,
  },
  modalContent: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius['2xl'],
  },
  header: {
    flexDirection: layoutConstants.flexDirection.row,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.xl,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  headerLeft: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.md,
  },
  title: {
    fontSize: mobileFontSizes.xl,
    fontWeight: designTokens.fontWeight.bold,
    color: designTokens.colors.textPrimary,
  },
  closeButton: {
    padding: designTokens.spacing.xs,
  },
  infoCard: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.primaryLight,
    margin: designTokens.spacing.lg,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    gap: designTokens.spacing.md,
  },
  infoText: {
    flex: flexValues.one,
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.primary,
    lineHeight: designTokens.lineHeights.bodyLarge,
  },
  classList: {
    flex: flexValues.one,
    paddingHorizontal: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.lg,
  },
  classOption: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderWidth: designTokens.borderWidth.medium,
    borderColor: designTokens.colors.transparent,
  },
  classOptionSelected: {
    backgroundColor: designTokens.colors.primaryLight,
    borderColor: designTokens.colors.primary,
  },
  classOptionContent: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.md,
  },
  checkbox: {
    width: designTokens.componentSizes.checkbox.md,
    height: designTokens.componentSizes.checkbox.md,
    borderRadius: designTokens.borderRadius.sm,
    borderWidth: designTokens.borderWidth.medium,
    borderColor: designTokens.colors.textTertiary,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  checkboxSelected: {
    backgroundColor: designTokens.colors.primary,
    borderColor: designTokens.colors.primary,
  },
  classOptionText: {
    fontSize: mobileFontSizes.lg,
    color: designTokens.colors.textPrimary,
    fontWeight: designTokens.fontWeight.medium,
  },
  classOptionTextSelected: {
    color: designTokens.colors.primary,
    fontWeight: designTokens.fontWeight.semibold,
  },
  selectedBadge: {
    width: designTokens.componentSizes.badge.md,
    height: designTokens.componentSizes.badge.md,
    borderRadius: designTokens.borderRadius['2xl'],
    backgroundColor: designTokens.colors.primary,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  selectedBadgeText: {
    color: designTokens.colors.textInverse,
    fontSize: mobileFontSizes.sm,
    fontWeight: designTokens.fontWeight.bold,
  },
  footer: {
    flexDirection: layoutConstants.flexDirection.row,
    padding: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
  },
  cancelButton: {
    flex: flexValues.one,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.backgroundSecondary,
    alignItems: layoutConstants.alignItems.center,
  },
  cancelButtonText: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textSecondary,
  },
  saveButton: {
    flex: flexValues.one,
    flexDirection: layoutConstants.flexDirection.row,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.primary,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    gap: designTokens.spacing.sm,
  },
  saveButtonText: {
    fontSize: mobileFontSizes.lg,
    fontWeight: designTokens.fontWeight.semibold,
    color: designTokens.colors.textInverse,
  },
});
