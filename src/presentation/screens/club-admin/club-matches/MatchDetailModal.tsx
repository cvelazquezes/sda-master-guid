import React, { useMemo } from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { createModalStyles } from './styles';
import { COMPONENT_VARIANT, ICONS } from '../../../../shared/constants';
import { MatchStatus } from '../../../../types';
import { Text, Modal, Button } from '../../../components/primitives';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { useTheme } from '../../../state/ThemeContext';
import type { Match, User } from '../../../../types';

type ModalLabels = {
  title: string;
  subtitle: string;
  status: string;
  adminActions: string;
  notify: string;
  scheduled: string;
  completed: string;
  cancel: string;
};

type MatchDetailModalProps = {
  visible: boolean;
  match: Match | null;
  participants: User[];
  onClose: () => void;
  onNotify: (match: Match) => void;
  onUpdateStatus: (matchId: string, status: MatchStatus) => Promise<void>;
  labels: ModalLabels;
};

function ParticipantRow({
  participant,
  styles,
}: {
  participant: User;
  styles: ReturnType<typeof createModalStyles>;
}): React.JSX.Element {
  const avatarInitial = participant.name.charAt(0).toUpperCase();
  return (
    <View style={styles.participantRow}>
      <View style={styles.participantAvatar}>
        <Text style={styles.participantAvatarText}>{avatarInitial}</Text>
      </View>
      <View style={styles.participantInfo}>
        <Text style={styles.participantName}>{participant.name}</Text>
        <Text style={styles.participantEmail}>{participant.email}</Text>
        {participant.whatsappNumber && (
          <Text style={styles.participantPhone}>📱 {participant.whatsappNumber}</Text>
        )}
      </View>
    </View>
  );
}

function StatusBadge({
  status,
  styles,
}: {
  status: MatchStatus;
  styles: ReturnType<typeof createModalStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  const { getStatusColor } = useThemeColor();
  const config = getStatusColor(status);
  const displayText = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <View style={[styles.statusBadge, { backgroundColor: config.light }]}>
      <MaterialCommunityIcons
        name={(config.icon || ICONS.CLOCK_OUTLINE) as typeof ICONS.CHECK}
        size={iconSizes.md}
        color={config.text}
      />
      <Text style={[styles.statusText, { color: config.text }]}>{displayText}</Text>
    </View>
  );
}

type ActionButtonsProps = {
  match: Match;
  onNotify: (match: Match) => void;
  onUpdateStatus: (matchId: string, status: MatchStatus) => Promise<void>;
  labels: ModalLabels;
  styles: ReturnType<typeof createModalStyles>;
};

function ActionButtons({
  match,
  onNotify,
  onUpdateStatus,
  labels,
  styles,
}: ActionButtonsProps): React.JSX.Element {
  const isPending = match.status === MatchStatus.PENDING;
  const isScheduled = match.status === MatchStatus.SCHEDULED;
  const toScheduled = (): Promise<void> => onUpdateStatus(match.id, MatchStatus.SCHEDULED);
  const toCompleted = (): Promise<void> => onUpdateStatus(match.id, MatchStatus.COMPLETED);
  const toCancel = (): Promise<void> => onUpdateStatus(match.id, MatchStatus.CANCELLED);
  return (
    <View style={styles.modalSection}>
      <Text style={styles.modalSectionTitle}>{labels.adminActions}</Text>
      <Button
        fullWidth
        title={labels.notify}
        icon={ICONS.WHATSAPP}
        variant={COMPONENT_VARIANT.secondary}
        onPress={(): void => onNotify(match)}
      />
      {isPending && (
        <Button
          fullWidth
          title={labels.scheduled}
          icon={ICONS.CALENDAR_CHECK}
          variant={COMPONENT_VARIANT.primary}
          onPress={toScheduled}
        />
      )}
      {isScheduled && (
        <Button
          fullWidth
          title={labels.completed}
          icon={ICONS.CHECK_CIRCLE}
          variant={COMPONENT_VARIANT.primary}
          onPress={toCompleted}
        />
      )}
      {(isPending || isScheduled) && (
        <Button
          fullWidth
          title={labels.cancel}
          icon={ICONS.CLOSE_CIRCLE}
          variant={COMPONENT_VARIANT.danger}
          onPress={toCancel}
        />
      )}
    </View>
  );
}

export function MatchDetailModal({
  visible,
  match,
  participants,
  onClose,
  onNotify,
  onUpdateStatus,
  labels,
}: MatchDetailModalProps): React.JSX.Element | null {
  const { colors, spacing, radii, typography } = useTheme();
  const styles = useMemo(
    () => createModalStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const { t } = useTranslation();
  if (!match) {
    return null;
  }
  return (
    <Modal
      visible={visible}
      title={labels.title}
      subtitle={labels.subtitle}
      icon={ICONS.ACCOUNT_HEART}
      iconColor={colors.primary}
      iconBackgroundColor={colors.primaryLight}
      onClose={onClose}
    >
      <View style={styles.modalContent}>
        <View style={styles.modalSection}>
          <Text style={styles.modalSectionTitle}>{labels.status}</Text>
          <StatusBadge status={match.status} styles={styles} />
        </View>
        <View style={styles.modalSection}>
          <Text style={styles.modalSectionTitle}>
            {t('screens.clubMatches.participants', { count: participants.length })}
          </Text>
          {participants.map((p) => (
            <ParticipantRow key={p.id} participant={p} styles={styles} />
          ))}
        </View>
        <ActionButtons
          match={match}
          labels={labels}
          onNotify={onNotify}
          onUpdateStatus={onUpdateStatus}
          styles={styles}
        />
      </View>
    </Modal>
  );
}
