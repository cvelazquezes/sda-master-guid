import React from 'react';
import { View, Modal, ScrollView } from 'react-native';
import { ClassOptionItem } from './ClassOptionItem';
import { InfoCard } from './InfoCard';
import { ModalFooter } from './ModalFooter';
import { ModalHeader } from './ModalHeader';
import { styles } from './styles';
import { useClassSelection } from './useClassSelection';
import { ANIMATION_TYPE } from '../../../../shared/constants';
import { PATHFINDER_CLASSES, type PathfinderClass } from '../../../../types';
import { useTheme } from '../../../state/ThemeContext';

type ClassSelectionModalProps = {
  visible: boolean;
  initialClasses: PathfinderClass[];
  onSave: (classes: PathfinderClass[]) => void;
  onClose: () => void;
};

export const ClassSelectionModal: React.FC<ClassSelectionModalProps> = ({
  visible,
  initialClasses,
  onSave,
  onClose,
}) => {
  const { colors } = useTheme();
  const { selectedClasses, modalWidth, modalMaxHeight, toggleClass, handleSave, isSelected } =
    useClassSelection({ visible, initialClasses });

  return (
    <Modal
      transparent
      accessibilityViewIsModal
      visible={visible}
      animationType={ANIMATION_TYPE.SLIDE}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { width: modalWidth, maxHeight: modalMaxHeight, backgroundColor: colors.surface },
          ]}
        >
          <ModalHeader colors={colors} onClose={onClose} />
          <InfoCard selectedCount={selectedClasses.length} colors={colors} />
          <ScrollView style={styles.classList}>
            {PATHFINDER_CLASSES.map((pathfinderClass) => (
              <ClassOptionItem
                key={pathfinderClass}
                pathfinderClass={pathfinderClass}
                isSelected={isSelected(pathfinderClass)}
                selectionIndex={selectedClasses.indexOf(pathfinderClass)}
                colors={colors}
                onToggle={toggleClass}
              />
            ))}
          </ScrollView>
          <ModalFooter
            colors={colors}
            onCancel={onClose}
            onSave={() => handleSave(onSave, onClose)}
          />
        </View>
      </View>
    </Modal>
  );
};
