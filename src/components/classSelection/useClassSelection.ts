import { useState, useEffect } from 'react';
import { Alert, useWindowDimensions } from 'react-native';
import { PathfinderClass } from '../../types';
import { designTokens } from '../../shared/theme';
import { CLASS_SELECTION, MESSAGES } from '../../shared/constants';

interface UseClassSelectionProps {
  visible: boolean;
  initialClasses: PathfinderClass[];
}

interface UseClassSelectionReturn {
  selectedClasses: PathfinderClass[];
  modalWidth: number;
  modalMaxHeight: number;
  toggleClass: (pathfinderClass: PathfinderClass) => void;
  handleSave: (onSave: (classes: PathfinderClass[]) => void, onClose: () => void) => void;
  isSelected: (pathfinderClass: PathfinderClass) => boolean;
}

export const useClassSelection = ({
  visible,
  initialClasses,
}: UseClassSelectionProps): UseClassSelectionReturn => {
  const [selectedClasses, setSelectedClasses] = useState<PathfinderClass[]>(initialClasses);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  useEffect(() => {
    if (visible) {
      setSelectedClasses(initialClasses);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const getModalWidth = (): number => {
    const { breakpoints, responsiveScale } = designTokens;
    if (windowWidth > breakpoints.desktop) {
      return Math.min(responsiveScale.maxWidth.modal, windowWidth * responsiveScale.modal.desktop);
    } else if (windowWidth > breakpoints.tablet) {
      return Math.min(
        responsiveScale.maxWidth.modalSmall,
        windowWidth * responsiveScale.modal.tablet
      );
    } else if (windowWidth > breakpoints.mobile) {
      return windowWidth * responsiveScale.modal.mobileLarge;
    }
    return windowWidth * responsiveScale.modal.mobile;
  };

  const toggleClass = (pathfinderClass: PathfinderClass): void => {
    if (selectedClasses.includes(pathfinderClass)) {
      if (selectedClasses.length === CLASS_SELECTION.minimum) {
        Alert.alert(MESSAGES.TITLES.MINIMUM_REQUIRED, MESSAGES.ERRORS.MINIMUM_ONE_CLASS_REQUIRED);
        return;
      }
      setSelectedClasses(selectedClasses.filter((c) => c !== pathfinderClass));
    } else {
      if (selectedClasses.length === CLASS_SELECTION.maximum) {
        Alert.alert(MESSAGES.TITLES.MAXIMUM_REACHED, MESSAGES.ERRORS.MAXIMUM_CLASSES_REACHED);
        return;
      }
      setSelectedClasses([...selectedClasses, pathfinderClass]);
    }
  };

  const handleSave = (onSave: (classes: PathfinderClass[]) => void, onClose: () => void): void => {
    if (selectedClasses.length === CLASS_SELECTION.empty) {
      Alert.alert(MESSAGES.TITLES.REQUIRED, MESSAGES.ERRORS.PLEASE_SELECT_ONE_CLASS);
      return;
    }
    onSave(selectedClasses);
    onClose();
  };

  const isSelected = (pathfinderClass: PathfinderClass): boolean => {
    return selectedClasses.includes(pathfinderClass);
  };

  return {
    selectedClasses,
    modalWidth: getModalWidth(),
    modalMaxHeight: windowHeight * designTokens.responsiveScale.maxHeight.modal,
    toggleClass,
    handleSave,
    isSelected,
  };
};
