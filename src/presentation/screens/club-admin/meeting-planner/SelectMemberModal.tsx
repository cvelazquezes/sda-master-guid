import React, { useMemo } from 'react';
import { View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import { ANIMATION_TYPE, ICONS } from '../../../../shared/constants';
import { MODAL_HEIGHT_RATIO } from '../../../../shared/constants/components';
import { createModalStyles } from './styles';
import type { User } from '../../../../types';

type ModalStylesType = ReturnType<typeof createModalStyles>;

type SelectMemberModalProps = {
  visible: boolean;
  onClose: () => void;
  modalWidth: number;
  windowHeight: number;
  clubMembers: User[];
  onSelectMember: (member: User) => void;
  t: (key: string) => string;
};

export function SelectMemberModal({
  visible,
  onClose,
  modalWidth,
  windowHeight,
  clubMembers,
  onSelectMember,
  t,
}: SelectMemberModalProps): React.JSX.Element {
  const { iconSizes, colors, spacing, radii, typography } = useTheme();

  const modalStyles = useMemo(
    () => createModalStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );

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
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>{t('screens.meetingPlanner.assignResponsible')}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons
                name={ICONS.CLOSE}
                size={iconSizes.lg}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          <ScrollView style={modalStyles.body}>
            {clubMembers.length === 0 ? (
              <Text style={modalStyles.noMembersText}>
                {t('screens.meetingPlanner.noMembersAvailable')}
              </Text>
            ) : (
              clubMembers.map((member) => (
                <MemberOption
                  key={member.id}
                  member={member}
                  onSelect={(): void => onSelectMember(member)}
                  modalStyles={modalStyles}
                />
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

type MemberOptionProps = {
  member: User;
  onSelect: () => void;
  modalStyles: ModalStylesType;
};

function MemberOption({ member, onSelect, modalStyles }: MemberOptionProps): React.JSX.Element {
  const { iconSizes, colors } = useTheme();
  return (
    <TouchableOpacity style={modalStyles.memberOption} onPress={onSelect}>
      <View style={modalStyles.memberAvatar}>
        <Text style={modalStyles.memberAvatarText}>{member.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={modalStyles.memberInfo}>
        <Text style={modalStyles.memberOptionName}>{member.name}</Text>
        <Text style={modalStyles.memberOptionEmail}>{member.email}</Text>
      </View>
      <MaterialCommunityIcons
        name={ICONS.CHEVRON_RIGHT}
        size={iconSizes.md}
        color={colors.borderLight}
      />
    </TouchableOpacity>
  );
}
