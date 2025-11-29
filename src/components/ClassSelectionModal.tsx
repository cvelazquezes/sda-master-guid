import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PATHFINDER_CLASSES, PathfinderClass } from '../types';

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

  useEffect(() => {
    setSelectedClasses(initialClasses);
  }, [initialClasses, visible]);

  const toggleClass = (pathfinderClass: PathfinderClass) => {
    if (selectedClasses.includes(pathfinderClass)) {
      // Remove class - but ensure at least 1 remains
      if (selectedClasses.length === 1) {
        Alert.alert('Minimum Required', 'At least one class must be selected');
        return;
      }
      setSelectedClasses(selectedClasses.filter((c) => c !== pathfinderClass));
    } else {
      // Add class - but don't exceed 3
      if (selectedClasses.length === 3) {
        Alert.alert('Maximum Reached', 'You can select up to 3 classes');
        return;
      }
      setSelectedClasses([...selectedClasses, pathfinderClass]);
    }
  };

  const handleSave = () => {
    if (selectedClasses.length === 0) {
      Alert.alert('Required', 'Please select at least one class');
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
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons name="school" size={24} color="#6200ee" />
              <Text style={styles.title}>Select Classes</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="information" size={20} color="#6200ee" />
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
                      <MaterialCommunityIcons name="check" size={18} color="#fff" />
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
              <MaterialCommunityIcons name="check" size={20} color="#fff" />
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
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0e6ff',
    margin: 16,
    padding: 12,
    borderRadius: 12,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#6200ee',
    lineHeight: 20,
  },
  classList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  classOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  classOptionSelected: {
    backgroundColor: '#f0e6ff',
    borderColor: '#6200ee',
  },
  classOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  classOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  classOptionTextSelected: {
    color: '#6200ee',
    fontWeight: '600',
  },
  selectedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#6200ee',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
