import React from 'react';
// eslint-disable-next-line no-restricted-imports -- TextInput needed for complex form input with custom styling
import { View, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { mobileIconSizes, designTokens, layoutConstants } from '../../../shared/theme';
import { ANIMATION, ICONS, KEYBOARD_TYPE, TEXT_INPUT } from '../../../shared/constants';
import { MODAL_OPACITY } from '../../../shared/constants/http';
import { modalStyles } from './styles';
import { AgendaItem } from './types';

interface EditItemModalProps {
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
}

const MODAL_HEIGHT_MULTIPLIER = MODAL_OPACITY.BACKDROP;

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
  const isEditing = currentItem && agendaItems.find((i) => i.id === currentItem.id);
  const modalTitle = isEditing
    ? t('screens.meetingPlanner.editActivity')
    : t('screens.meetingPlanner.addActivity');
  const contentStyle = [
    modalStyles.content,
    {
      width: modalWidth,
      maxHeight: windowHeight * MODAL_HEIGHT_MULTIPLIER,
      alignSelf: layoutConstants.alignSelf.center,
    },
  ];

  return (
    <Modal visible={visible} animationType={ANIMATION.SLIDE} transparent onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={contentStyle}>
          <ModalHeader title={modalTitle} onClose={onClose} />
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
          <ModalFooter onClose={onClose} onSave={onSave} t={t} />
        </View>
      </View>
    </Modal>
  );
}

function ModalHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}): React.JSX.Element {
  return (
    <View style={modalStyles.header}>
      <Text style={modalStyles.title}>{title}</Text>
      <TouchableOpacity onPress={onClose}>
        <MaterialCommunityIcons
          name={ICONS.CLOSE}
          size={mobileIconSizes.large}
          color={designTokens.colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
}

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboardType?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  numberOfLines,
}: InputFieldProps): React.JSX.Element {
  const inputStyle = multiline ? [modalStyles.input, modalStyles.textArea] : modalStyles.input;
  return (
    <>
      <Text style={modalStyles.inputLabel}>{label}</Text>
      <TextInput
        style={inputStyle}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType as typeof KEYBOARD_TYPE.NUMERIC}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </>
  );
}

interface ModalFooterProps {
  onClose: () => void;
  onSave: () => void;
  t: (key: string) => string;
}

function ModalFooter({ onClose, onSave, t }: ModalFooterProps): React.JSX.Element {
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
