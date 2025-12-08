import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/primitives';
import { Match, MatchStatus, User } from '../../../../types';
import { Modal, Button } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import { COMPONENT_VARIANT, ICONS } from '../../../../shared/constants';
import { modalStyles as styles } from './styles';

interface ModalLabels {
  title: string;
  subtitle: string;
  status: string;
  adminActions: string;
  notify: string;
  scheduled: string;
  completed: string;
  cancel: string;
}

interface MatchDetailModalProps {
  visible: boolean;
  match: Match | null;
  participants: User[];
  onClose: () => void;
  onNotify: (match: Match) => void;
  onUpdateStatus: (matchId: string, status: MatchStatus) => Promise<void>;
  labels: ModalLabels;
}

function ParticipantRow({ participant }: { participant: User }): React.JSX.Element {
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

function StatusBadge({ status }: { status: MatchStatus }): React.JSX.Element {
  const { colors, iconSizes } = useTheme();
  const config = colors.status[status] || colors.status.pending;
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

interface ActionButtonsProps {
  match: Match;
  onNotify: (match: Match) => void;
  onUpdateStatus: (matchId: string, status: MatchStatus) => Promise<void>;
  labels: ModalLabels;
}

function ActionButtons({
  match,
  onNotify,
  onUpdateStatus,
  labels,
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
        title={labels.notify}
        icon={ICONS.WHATSAPP}
        variant={COMPONENT_VARIANT.secondary}
        fullWidth
        onPress={(): void => onNotify(match)}
      />
      {isPending && (
        <Button
          title={labels.scheduled}
          icon={ICONS.CALENDAR_CHECK}
          variant={COMPONENT_VARIANT.primary}
          fullWidth
          onPress={toScheduled}
        />
      )}
      {isScheduled && (
        <Button
          title={labels.completed}
          icon={ICONS.CHECK_CIRCLE}
          variant={COMPONENT_VARIANT.primary}
          fullWidth
          onPress={toCompleted}
        />
      )}
      {(isPending || isScheduled) && (
        <Button
          title={labels.cancel}
          icon={ICONS.CLOSE_CIRCLE}
          variant={COMPONENT_VARIANT.danger}
          fullWidth
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
  const { colors } = useTheme();
  if (!match) {
    return null;
  }
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={labels.title}
      subtitle={labels.subtitle}
      icon={ICONS.ACCOUNT_HEART}
      iconColor={colors.primary}
      iconBackgroundColor={colors.primaryLight}
    >
      <View style={styles.modalContent}>
        <View style={styles.modalSection}>
          <Text style={styles.modalSectionTitle}>{labels.status}</Text>
          <StatusBadge status={match.status} />
        </View>
        <View style={styles.modalSection}>
          <Text style={styles.modalSectionTitle}>Participants ({participants.length})</Text>
          {participants.map((p) => (
            <ParticipantRow key={p.id} participant={p} />
          ))}
        </View>
        <ActionButtons
          match={match}
          onNotify={onNotify}
          onUpdateStatus={onUpdateStatus}
          labels={labels}
        />
      </View>
    </Modal>
  );
}
