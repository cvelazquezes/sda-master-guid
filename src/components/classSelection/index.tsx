import React from 'react';
import { View, Modal, ScrollView } from 'react-native';
import { PATHFINDER_CLASSES, PathfinderClass } from '../../types';
import { ANIMATION } from '../../shared/constants';
import { useClassSelection } from './useClassSelection';
import { ModalHeader } from './ModalHeader';
import { ModalFooter } from './ModalFooter';
import { InfoCard } from './InfoCard';
import { ClassOptionItem } from './ClassOptionItem';
import { styles } from './styles';

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
  const { selectedClasses, modalWidth, modalMaxHeight, toggleClass, handleSave, isSelected } =
    useClassSelection({ visible, initialClasses });

  return (
    <Modal visible={visible} animationType={ANIMATION.SLIDE} transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { width: modalWidth, maxHeight: modalMaxHeight }]}>
          <ModalHeader onClose={onClose} />
          <InfoCard selectedCount={selectedClasses.length} />
          <ScrollView style={styles.classList}>
            {PATHFINDER_CLASSES.map((pathfinderClass) => (
              <ClassOptionItem
                key={pathfinderClass}
                pathfinderClass={pathfinderClass}
                isSelected={isSelected(pathfinderClass)}
                selectionIndex={selectedClasses.indexOf(pathfinderClass)}
                onToggle={toggleClass}
              />
            ))}
          </ScrollView>
          <ModalFooter onCancel={onClose} onSave={() => handleSave(onSave, onClose)} />
        </View>
      </View>
    </Modal>
  );
};
