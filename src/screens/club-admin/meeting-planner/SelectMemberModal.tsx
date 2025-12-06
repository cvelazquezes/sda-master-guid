import React from 'react';
import { View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { User } from '../../../types';
import { mobileIconSizes, designTokens, layoutConstants } from '../../../shared/theme';
import { ANIMATION, ICONS } from '../../../shared/constants';
import { MODAL_OPACITY } from '../../../shared/constants/http';
import { modalStyles } from './styles';

interface SelectMemberModalProps {
  visible: boolean;
  onClose: () => void;
  modalWidth: number;
  windowHeight: number;
  clubMembers: User[];
  onSelectMember: (member: User) => void;
  t: (key: string) => string;
}

const MODAL_HEIGHT_MULTIPLIER = MODAL_OPACITY.BACKDROP;

export function SelectMemberModal({
  visible,
  onClose,
  modalWidth,
  windowHeight,
  clubMembers,
  onSelectMember,
  t,
}: SelectMemberModalProps): React.JSX.Element {
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
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>{t('screens.meetingPlanner.assignResponsible')}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons
                name={ICONS.CLOSE}
                size={mobileIconSizes.large}
                color={designTokens.colors.textSecondary}
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
                />
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

interface MemberOptionProps {
  member: User;
  onSelect: () => void;
}

function MemberOption({ member, onSelect }: MemberOptionProps): React.JSX.Element {
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
        size={mobileIconSizes.medium}
        color={designTokens.colors.borderLight}
      />
    </TouchableOpacity>
  );
}
