import React, { useMemo } from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createModalStyles, createShareModalStyles } from './styles';
import { ANIMATION_TYPE, DATE_LOCALE_OPTIONS, ICONS } from '../../../../shared/constants';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import type { AgendaItem } from './types';

type ShareModalProps = {
  visible: boolean;
  onClose: () => void;
  shareModalWidth: number;
  meetingDate: Date;
  totalTime: number;
  agendaItems: AgendaItem[];
  clubMembersCount: number;
  onConfirmShare: () => void;
  t: (key: string, opts?: Record<string, unknown>) => string;
};

type ModalStylesType = ReturnType<typeof createModalStyles>;
type ShareModalStylesType = ReturnType<typeof createShareModalStyles>;

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
  const { colors, spacing, radii, typography } = useTheme();

  const modalStyles = useMemo(
    () => createModalStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const shareModalStyles = useMemo(
    () => createShareModalStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );

  const overlayStyle = [modalStyles.overlay, { justifyContent: 'center' as const }];
  const contentStyle = [shareModalStyles.content, { width: shareModalWidth }];

  return (
    <Modal
      transparent
      accessibilityViewIsModal
      visible={visible}
      animationType={ANIMATION_TYPE.FADE}
      onRequestClose={onClose}
    >
      <View style={overlayStyle}>
        <View style={contentStyle}>
          <ShareHeader membersCount={clubMembersCount} t={t} shareModalStyles={shareModalStyles} />
          <ShareInfo
            meetingDate={meetingDate}
            totalTime={totalTime}
            itemsCount={agendaItems.length}
            t={t}
            shareModalStyles={shareModalStyles}
          />
          <ShareActions
            t={t}
            modalStyles={modalStyles}
            shareModalStyles={shareModalStyles}
            onClose={onClose}
            onConfirmShare={onConfirmShare}
          />
        </View>
      </View>
    </Modal>
  );
}

type ShareHeaderProps = {
  membersCount: number;
  t: (key: string, opts?: Record<string, unknown>) => string;
  shareModalStyles: ShareModalStylesType;
};

function ShareHeader({ membersCount, t, shareModalStyles }: ShareHeaderProps): React.JSX.Element {
  const { iconSizes, colors } = useTheme();
  return (
    <View style={shareModalStyles.header}>
      <View style={shareModalStyles.iconContainer}>
        <MaterialCommunityIcons
          name={ICONS.SHARE_VARIANT}
          size={iconSizes.xxl}
          color={colors.primary}
        />
      </View>
      <Text style={shareModalStyles.title}>{t('screens.meetingPlanner.shareMeetingPlan')}</Text>
      <Text style={shareModalStyles.subtitle}>
        {t('screens.meetingPlanner.sendAgendaToMembers', { count: membersCount })}
      </Text>
    </View>
  );
}

type ShareInfoProps = {
  meetingDate: Date;
  totalTime: number;
  itemsCount: number;
  t: (key: string) => string;
  shareModalStyles: ShareModalStylesType;
};

function ShareInfo({
  meetingDate,
  totalTime,
  itemsCount,
  t,
  shareModalStyles,
}: ShareInfoProps): React.JSX.Element {
  const dateStr = meetingDate.toLocaleDateString(undefined, DATE_LOCALE_OPTIONS.DATE_WITHOUT_YEAR);
  return (
    <View style={shareModalStyles.info}>
      <InfoRow
        icon={ICONS.CALENDAR}
        label={t('screens.meetingPlanner.meetingDate')}
        value={dateStr}
        shareModalStyles={shareModalStyles}
      />
      <InfoRow
        icon={ICONS.CLOCK_OUTLINE}
        label={t('screens.meetingPlanner.totalDuration')}
        value={`${totalTime} minutes`}
        shareModalStyles={shareModalStyles}
      />
      <InfoRow
        icon={ICONS.FORMAT_LIST_NUMBERED}
        label={t('screens.meetingPlanner.activities')}
        value={`${itemsCount} items`}
        shareModalStyles={shareModalStyles}
      />
    </View>
  );
}

type InfoRowProps = {
  icon: string;
  label: string;
  value: string;
  shareModalStyles: ShareModalStylesType;
};

function InfoRow({ icon, label, value, shareModalStyles }: InfoRowProps): React.JSX.Element {
  const { iconSizes, colors } = useTheme();
  return (
    <View style={shareModalStyles.infoRow}>
      <MaterialCommunityIcons
        name={icon as typeof ICONS.CALENDAR}
        size={iconSizes.md}
        color={colors.primary}
      />
      <View style={shareModalStyles.infoText}>
        <Text style={shareModalStyles.infoLabel}>{label}</Text>
        <Text style={shareModalStyles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

type ShareActionsProps = {
  onClose: () => void;
  onConfirmShare: () => void;
  t: (key: string) => string;
  modalStyles: ModalStylesType;
  shareModalStyles: ShareModalStylesType;
};

function ShareActions({
  onClose,
  onConfirmShare,
  t,
  modalStyles,
  shareModalStyles,
}: ShareActionsProps): React.JSX.Element {
  const { iconSizes, colors } = useTheme();
  const confirmStyle = [
    modalStyles.button,
    modalStyles.confirmButton,
    shareModalStyles.confirmButton,
  ];
  return (
    <View style={shareModalStyles.actions}>
      <TouchableOpacity
        style={[modalStyles.button, modalStyles.cancelButton]}
        accessibilityRole="button"
        accessibilityLabel="Cancel"
        onPress={onClose}
      >
        <Text style={modalStyles.cancelButtonText}>{t('common.cancel')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={confirmStyle}
        accessibilityRole="button"
        accessibilityLabel="Send to all members"
        onPress={onConfirmShare}
      >
        <MaterialCommunityIcons name={ICONS.SEND} size={iconSizes.md} color={colors.textInverse} />
        <Text style={modalStyles.confirmButtonText}>{t('screens.meetingPlanner.sendToAll')}</Text>
      </TouchableOpacity>
    </View>
  );
}
