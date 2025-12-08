import { useState, useEffect } from 'react';
import { Alert, useWindowDimensions } from 'react-native';
import { PathfinderClass } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { CLASS_SELECTION } from '../../shared/constants';

type TranslationFn = (key: string, options?: Record<string, unknown>) => string;

interface UseClassSelectionProps {
  visible: boolean;
  initialClasses: PathfinderClass[];
  t: TranslationFn;
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
  t,
}: UseClassSelectionProps): UseClassSelectionReturn => {
  const { breakpoints, responsiveScale } = useTheme();
  const [selectedClasses, setSelectedClasses] = useState<PathfinderClass[]>(initialClasses);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  useEffect(() => {
    if (visible) {
      setSelectedClasses(initialClasses);
    }
  }, [visible, initialClasses]);

  const getModalWidth = (): number => {
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
      if (selectedClasses.length === CLASS_SELECTION.MIN) {
        Alert.alert(t('titles.minimumRequired'), t('errors.minimumOneClassRequired'));
        return;
      }
      setSelectedClasses(selectedClasses.filter((c) => c !== pathfinderClass));
    } else {
      if (selectedClasses.length === CLASS_SELECTION.MAX) {
        Alert.alert(t('titles.maximumReached'), t('errors.maximumClassesReached'));
        return;
      }
      setSelectedClasses([...selectedClasses, pathfinderClass]);
    }
  };

  const handleSave = (onSave: (classes: PathfinderClass[]) => void, onClose: () => void): void => {
    if (selectedClasses.length === CLASS_SELECTION.EMPTY) {
      Alert.alert(t('titles.required'), t('errors.pleaseSelectOneClass'));
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
    modalMaxHeight: windowHeight * responsiveScale.maxHeight.modal,
    toggleClass,
    handleSave,
    isSelected,
  };
};
