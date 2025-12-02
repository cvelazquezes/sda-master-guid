import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PATHFINDER_CLASSES, PathfinderClass } from '../types';
import { designTokens } from '../shared/theme/designTokens';
import { mobileTypography, mobileFontSizes } from '../shared/theme/mobileTypography';
import { MESSAGES } from '../shared/constants';

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
    if (windowWidth > 1200) {
      return Math.min(600, windowWidth * 0.4);
    } else if (windowWidth > 768) {
      return Math.min(550, windowWidth * 0.65);
    } else if (windowWidth > 480) {
      return windowWidth * 0.85;
    } else {
      return windowWidth * 0.9;
    }
  };

  const modalWidth = getModalWidth();
  const modalMaxHeight = windowHeight * 0.85;

  const toggleClass = (pathfinderClass: PathfinderClass) => {
    if (selectedClasses.includes(pathfinderClass)) {
      // Remove class - but ensure at least 1 remains
      if (selectedClasses.length === 1) {
        Alert.alert(MESSAGES.TITLES.MINIMUM_REQUIRED, MESSAGES.ERRORS.MINIMUM_ONE_CLASS_REQUIRED);
        return;
      }
      setSelectedClasses(selectedClasses.filter((c) => c !== pathfinderClass));
    } else {
      // Add class - but don't exceed 3
      if (selectedClasses.length === 3) {
        Alert.alert(MESSAGES.TITLES.MAXIMUM_REACHED, MESSAGES.ERRORS.MAXIMUM_CLASSES_REACHED);
        return;
      }
      setSelectedClasses([...selectedClasses, pathfinderClass]);
    }
  };

  const handleSave = () => {
    if (selectedClasses.length === 0) {
      Alert.alert(MESSAGES.TITLES.REQUIRED, MESSAGES.ERRORS.PLEASE_SELECT_ONE_CLASS);
      return;
    }
    onSave(selectedClasses);
    onClose();
  };

  const isSelected = (pathfinderClass: PathfinderClass) => {
    return selectedClasses.includes(pathfinderClass);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { width: modalWidth, maxHeight: modalMaxHeight }]}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons name="school" size={24} color={designTokens.colors.primary} />
              <Text style={styles.title}>Select Classes</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color={designTokens.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="information" size={20} color={designTokens.colors.primary} />
            <Text style={styles.infoText}>
              Select between 1 and 3 Pathfinder classes. Selected: {selectedClasses.length}/3
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
                      <MaterialCommunityIcons name="check" size={18} color={designTokens.colors.textInverse} />
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
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <MaterialCommunityIcons name="check" size={20} color={designTokens.colors.textInverse} />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderRadius: designTokens.borderRadius.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: designTokens.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: mobileFontSizes.xl,
    fontWeight: 'bold',
    color: designTokens.colors.textPrimary,
  },
  closeButton: {
    padding: designTokens.spacing.xs,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.primaryLight,
    margin: 16,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: mobileFontSizes.sm,
    color: designTokens.colors.primary,
    lineHeight: 20,
  },
  classList: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  classOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: 12,
    backgroundColor: designTokens.colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  classOptionSelected: {
    backgroundColor: designTokens.colors.primaryLight,
    borderColor: designTokens.colors.primary,
  },
  classOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: designTokens.borderRadius.sm,
    borderWidth: 2,
    borderColor: designTokens.colors.textTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: designTokens.colors.primary,
    borderColor: designTokens.colors.primary,
  },
  classOptionText: {
    fontSize: mobileFontSizes.lg,
    color: designTokens.colors.textPrimary,
    fontWeight: '500',
  },
  classOptionTextSelected: {
    color: designTokens.colors.primary,
    fontWeight: '600',
  },
  selectedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: designTokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: designTokens.colors.textInverse,
    fontSize: mobileFontSizes.sm,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    padding: designTokens.spacing.lg,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: designTokens.colors.borderLight,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.backgroundSecondary,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '600',
    color: designTokens.colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: designTokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveButtonText: {
    fontSize: mobileFontSizes.lg,
    fontWeight: '600',
    color: designTokens.colors.textInverse,
  },
});
