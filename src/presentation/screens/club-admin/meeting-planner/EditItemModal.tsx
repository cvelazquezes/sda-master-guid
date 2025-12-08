import React, { useMemo } from 'react';
import { View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, Input } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import { ANIMATION_TYPE, ICONS, KEYBOARD_TYPE, TEXT_INPUT } from '../../../../shared/constants';
import { MODAL_HEIGHT_RATIO } from '../../../../shared/constants/components';
import { createModalStyles } from './styles';
import type { AgendaItem } from './types';

type ModalStylesType = ReturnType<typeof createModalStyles>;

type EditItemModalProps = {
  visible: boolean;
  onClose: () => void;
  modalWidth: number;
  windowHeight: number;
  currentItem: AgendaItem | null;
  agendaItems: AgendaItem[];
  editedTitle: string;
  setEditedTitle: (t: string) => void;
  editedMinutes: string;
  setEditedMinutes: (m: string) => void;
  editedDescription: string;
  setEditedDescription: (d: string) => void;
  onSave: () => void;
  t: (key: string) => string;
};

export function EditItemModal({
  visible,
  onClose,
  modalWidth,
  windowHeight,
  currentItem,
  agendaItems,
  editedTitle,
  setEditedTitle,
  editedMinutes,
  setEditedMinutes,
  editedDescription,
  setEditedDescription,
  onSave,
  t,
}: EditItemModalProps): React.JSX.Element {
  const { colors, spacing, radii, typography } = useTheme();

  const modalStyles = useMemo(
    () => createModalStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );

  const isEditing = currentItem && agendaItems.find((i) => i.id === currentItem.id);
  const modalTitle = isEditing
    ? t('screens.meetingPlanner.editActivity')
    : t('screens.meetingPlanner.addActivity');
  const contentStyle = [
    modalStyles.content,
    {
      width: modalWidth,
      maxHeight: windowHeight * MODAL_HEIGHT_RATIO,
      alignSelf: 'center' as const,
    },
  ];

  return (
    <Modal visible={visible} animationType={ANIMATION_TYPE.SLIDE} transparent onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={contentStyle}>
          <ModalHeader title={modalTitle} onClose={onClose} modalStyles={modalStyles} />
          <ScrollView style={modalStyles.body}>
            <InputField
              label={t('screens.meetingPlanner.activityTitleLabel')}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder={t('screens.meetingPlanner.activityTitlePlaceholder')}
            />
            <InputField
              label={t('screens.meetingPlanner.estimatedTime')}
              value={editedMinutes}
              onChangeText={setEditedMinutes}
              placeholder={t('screens.meetingPlanner.minutesPlaceholder')}
              keyboardType={KEYBOARD_TYPE.NUMERIC}
            />
            <InputField
              label={t('screens.meetingPlanner.descriptionOptional')}
              value={editedDescription}
              onChangeText={setEditedDescription}
              placeholder={t('screens.meetingPlanner.notesPlaceholder')}
              multiline
              numberOfLines={TEXT_INPUT.NUMBER_OF_LINES.MULTI}
            />
          </ScrollView>
          <ModalFooter onClose={onClose} onSave={onSave} t={t} modalStyles={modalStyles} />
        </View>
      </View>
    </Modal>
  );
}

function ModalHeader({
  title,
  onClose,
  modalStyles,
}: {
  title: string;
  onClose: () => void;
  modalStyles: ModalStylesType;
}): React.JSX.Element {
  const { iconSizes, colors } = useTheme();
  return (
    <View style={modalStyles.header}>
      <Text style={modalStyles.title}>{title}</Text>
      <TouchableOpacity onPress={onClose}>
        <MaterialCommunityIcons
          name={ICONS.CLOSE}
          size={iconSizes.lg}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
}

type InputFieldProps = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboardType?: string;
  multiline?: boolean;
  numberOfLines?: number;
};

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  numberOfLines,
}: InputFieldProps): React.JSX.Element {
  return (
    <Input
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType as typeof KEYBOARD_TYPE.NUMERIC}
      multiline={multiline}
      numberOfLines={numberOfLines}
    />
  );
}

type ModalFooterProps = {
  onClose: () => void;
  onSave: () => void;
  t: (key: string) => string;
  modalStyles: ModalStylesType;
};

function ModalFooter({ onClose, onSave, t, modalStyles }: ModalFooterProps): React.JSX.Element {
  return (
    <View style={modalStyles.footer}>
      <TouchableOpacity style={[modalStyles.button, modalStyles.cancelButton]} onPress={onClose}>
        <Text style={modalStyles.cancelButtonText}>{t('common.cancel')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[modalStyles.button, modalStyles.confirmButton]} onPress={onSave}>
        <Text style={modalStyles.confirmButtonText}>{t('common.save')}</Text>
      </TouchableOpacity>
    </View>
  );
}
