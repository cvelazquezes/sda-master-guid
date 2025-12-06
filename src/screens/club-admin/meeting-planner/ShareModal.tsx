import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { mobileIconSizes, designTokens, layoutConstants } from '../../../shared/theme';
import { ANIMATION, DATE_LOCALE_OPTIONS, ICONS } from '../../../shared/constants';
import { modalStyles, shareModalStyles } from './styles';
import { AgendaItem } from './types';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  shareModalWidth: number;
  meetingDate: Date;
  totalTime: number;
  agendaItems: AgendaItem[];
  clubMembersCount: number;
  onConfirmShare: () => void;
  t: (key: string, opts?: Record<string, unknown>) => string;
}

export function ShareModal({
  visible,
  onClose,
  shareModalWidth,
  meetingDate,
  totalTime,
  agendaItems,
  clubMembersCount,
  onConfirmShare,
  t,
}: ShareModalProps): React.JSX.Element {
  const overlayStyle = [
    modalStyles.overlay,
    { justifyContent: layoutConstants.justifyContent.center },
  ];
  const contentStyle = [shareModalStyles.content, { width: shareModalWidth }];

  return (
    <Modal visible={visible} animationType={ANIMATION.FADE} transparent onRequestClose={onClose}>
      <View style={overlayStyle}>
        <View style={contentStyle}>
          <ShareHeader membersCount={clubMembersCount} t={t} />
          <ShareInfo
            meetingDate={meetingDate}
            totalTime={totalTime}
            itemsCount={agendaItems.length}
            t={t}
          />
          <ShareActions onClose={onClose} onConfirmShare={onConfirmShare} t={t} />
        </View>
      </View>
    </Modal>
  );
}

interface ShareHeaderProps {
  membersCount: number;
  t: (key: string, opts?: Record<string, unknown>) => string;
}

function ShareHeader({ membersCount, t }: ShareHeaderProps): React.JSX.Element {
  return (
    <View style={shareModalStyles.header}>
      <View style={shareModalStyles.iconContainer}>
        <MaterialCommunityIcons
          name={ICONS.SHARE_VARIANT}
          size={designTokens.iconSize.xxl}
          color={designTokens.colors.primary}
        />
      </View>
      <Text style={shareModalStyles.title}>{t('screens.meetingPlanner.shareMeetingPlan')}</Text>
      <Text style={shareModalStyles.subtitle}>
        {t('screens.meetingPlanner.sendAgendaToMembers', { count: membersCount })}
      </Text>
    </View>
  );
}

interface ShareInfoProps {
  meetingDate: Date;
  totalTime: number;
  itemsCount: number;
  t: (key: string) => string;
}

function ShareInfo({ meetingDate, totalTime, itemsCount, t }: ShareInfoProps): React.JSX.Element {
  const dateStr = meetingDate.toLocaleDateString(undefined, DATE_LOCALE_OPTIONS.DATE_WITHOUT_YEAR);
  return (
    <View style={shareModalStyles.info}>
      <InfoRow
        icon={ICONS.CALENDAR}
        label={t('screens.meetingPlanner.meetingDate')}
        value={dateStr}
      />
      <InfoRow
        icon={ICONS.CLOCK_OUTLINE}
        label={t('screens.meetingPlanner.totalDuration')}
        value={`${totalTime} minutes`}
      />
      <InfoRow
        icon={ICONS.FORMAT_LIST_NUMBERED}
        label={t('screens.meetingPlanner.activities')}
        value={`${itemsCount} items`}
      />
    </View>
  );
}

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps): React.JSX.Element {
  return (
    <View style={shareModalStyles.infoRow}>
      <MaterialCommunityIcons
        name={icon as typeof ICONS.CALENDAR}
        size={mobileIconSizes.medium}
        color={designTokens.colors.primary}
      />
      <View style={shareModalStyles.infoText}>
        <Text style={shareModalStyles.infoLabel}>{label}</Text>
        <Text style={shareModalStyles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

interface ShareActionsProps {
  onClose: () => void;
  onConfirmShare: () => void;
  t: (key: string) => string;
}

function ShareActions({ onClose, onConfirmShare, t }: ShareActionsProps): React.JSX.Element {
  const confirmStyle = [
    modalStyles.button,
    modalStyles.confirmButton,
    shareModalStyles.confirmButton,
  ];
  return (
    <View style={shareModalStyles.actions}>
      <TouchableOpacity style={[modalStyles.button, modalStyles.cancelButton]} onPress={onClose}>
        <Text style={modalStyles.cancelButtonText}>{t('common.cancel')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={confirmStyle} onPress={onConfirmShare}>
        <MaterialCommunityIcons
          name={ICONS.SEND}
          size={mobileIconSizes.medium}
          color={designTokens.colors.textInverse}
        />
        <Text style={modalStyles.confirmButtonText}>{t('screens.meetingPlanner.sendToAll')}</Text>
      </TouchableOpacity>
    </View>
  );
}
