import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  screenStyles,
  summaryStyles,
  sectionStyles,
  positionCardStyles,
  memberCardStyles,
  assignButtonStyles,
  infoBannerStyles,
  footerStyles,
} from './directive/styles';
import { userService } from '../../../infrastructure/repositories/userService';
import {
  ALERT_BUTTON_STYLE,
  DIRECTIVE_POSITION_IDS,
  ICONS,
  LOG_MESSAGES,
  SINGLE_SPACE,
} from '../../../shared/constants';
import { logger } from '../../../shared/utils/logger';
import { UserRole } from '../../../types';
import { SelectionModal, Text, PageHeader } from '../../components/primitives';
import { useAuth } from '../../state/AuthContext';
import { mobileIconSizes } from '../../theme';
import { designTokens } from '../../theme/designTokens';
import type { User } from '../../../types';

// Directive positions that can be assigned
type DirectivePosition = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  color: string;
  memberId?: string;
  memberName?: string;
  memberEmail?: string;
};

// Position configuration with i18n keys
const DIRECTIVE_POSITION_CONFIG = [
  {
    id: DIRECTIVE_POSITION_IDS.VICE_DIRECTOR,
    titleKey: 'screens.clubDirective.positions.viceDirector',
    descriptionKey: 'screens.clubDirective.positions.viceDirectorDesc',
    icon: ICONS.ACCOUNT_STAR,
    color: designTokens.colors.warning,
  },
  {
    id: DIRECTIVE_POSITION_IDS.ASSOCIATE_DIRECTOR,
    titleKey: 'screens.clubDirective.positions.associateDirector',
    descriptionKey: 'screens.clubDirective.positions.associateDirectorDesc',
    icon: ICONS.ACCOUNT_SUPERVISOR,
    color: designTokens.colors.info,
  },
  {
    id: DIRECTIVE_POSITION_IDS.TREASURER,
    titleKey: 'screens.clubDirective.positions.treasurer',
    descriptionKey: 'screens.clubDirective.positions.treasurerDesc',
    icon: ICONS.CASH_MULTIPLE,
    color: designTokens.colors.success,
  },
  {
    id: DIRECTIVE_POSITION_IDS.COUNSELOR,
    titleKey: 'screens.clubDirective.positions.counselor',
    descriptionKey: 'screens.clubDirective.positions.counselorDesc',
    icon: ICONS.ACCOUNT_HEART,
    color: designTokens.colors.primary,
  },
  {
    id: DIRECTIVE_POSITION_IDS.SECRETARY,
    titleKey: 'screens.clubDirective.positions.secretary',
    descriptionKey: 'screens.clubDirective.positions.secretaryDesc',
    icon: ICONS.CLIPBOARD_TEXT,
    color: designTokens.colors.info,
  },
  {
    id: DIRECTIVE_POSITION_IDS.EVENTS_COORDINATOR,
    titleKey: 'screens.clubDirective.positions.eventsCoordinator',
    descriptionKey: 'screens.clubDirective.positions.eventsCoordinatorDesc',
    icon: ICONS.CALENDAR_STAR,
    color: designTokens.colors.error,
  },
] as const;

type TranslationFn = ReturnType<typeof useTranslation>['t'];

// Custom hook for directive data
type UseDirectiveDataReturn = {
  positions: DirectivePosition[];
  setPositions: React.Dispatch<React.SetStateAction<DirectivePosition[]>>;
  clubMembers: User[];
  refreshing: boolean;
  onRefresh: () => void;
};

function useDirectiveData(clubId?: string): UseDirectiveDataReturn {
  const [positions, setPositions] = useState<DirectivePosition[]>([]);
  const [clubMembers, setClubMembers] = useState<User[]>([]);
  const [, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (): Promise<void> => {
    try {
      const initialPositions = DIRECTIVE_POSITION_CONFIG.map((pos) => ({ ...pos }));
      setPositions(initialPositions);
      if (clubId) {
        const members = await userService.getUsersByClub(clubId);
        const eligibleMembers = members.filter((m) => m.isActive && m.role === UserRole.USER);
        setClubMembers(eligibleMembers);
      }
    } catch (error) {
      logger.error(LOG_MESSAGES.SCREENS.CLUB_DIRECTIVE.FAILED_TO_LOAD_DATA, error as Error);
      Alert.alert(i18next.t('common.error'), i18next.t('errors.failedToLoadDirective'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [clubId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = (): void => {
    setRefreshing(true);
    loadData();
  };

  return { positions, setPositions, clubMembers, refreshing, onRefresh };
}

// Summary banner component
function SummaryBanner({
  assignedCount,
  vacantCount,
  t,
}: {
  assignedCount: number;
  vacantCount: number;
  t: TranslationFn;
}): React.JSX.Element {
  return (
    <View style={summaryStyles.banner}>
      <View style={summaryStyles.item}>
        <MaterialCommunityIcons
          name={ICONS.ACCOUNT_CHECK}
          size={mobileIconSizes.medium}
          color={designTokens.colors.success}
        />
        <Text style={summaryStyles.text}>
          <Text style={summaryStyles.bold}>{assignedCount}</Text>
          {SINGLE_SPACE}
          {t('screens.clubDirective.assigned')}
        </Text>
      </View>
      <View style={summaryStyles.separator} />
      <View style={summaryStyles.item}>
        <MaterialCommunityIcons
          name={ICONS.ACCOUNT_CLOCK}
          size={mobileIconSizes.medium}
          color={designTokens.colors.warning}
        />
        <Text style={summaryStyles.text}>
          <Text style={summaryStyles.bold}>{vacantCount}</Text>
          {SINGLE_SPACE}
          {t('screens.clubDirective.vacant')}
        </Text>
      </View>
    </View>
  );
}

// Assigned position card
function AssignedPositionCard({
  position,
  onRemove,
  t,
}: {
  position: DirectivePosition;
  onRemove: () => void;
  t: TranslationFn;
}): React.JSX.Element {
  return (
    <View style={positionCardStyles.card}>
      <View style={[positionCardStyles.icon, { backgroundColor: `${position.color}20` }]}>
        <MaterialCommunityIcons
          name={position.icon as typeof ICONS.CHECK}
          size={mobileIconSizes.xlarge}
          color={position.color}
        />
      </View>
      <View style={positionCardStyles.content}>
        <View style={positionCardStyles.header}>
          <Text style={positionCardStyles.title}>{t(position.titleKey)}</Text>
        </View>
        <View style={memberCardStyles.card}>
          <View style={[memberCardStyles.avatar, { backgroundColor: position.color }]}>
            <Text style={memberCardStyles.avatarText}>
              {position.memberName?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={memberCardStyles.info}>
            <Text style={memberCardStyles.name}>{position.memberName}</Text>
            <Text style={memberCardStyles.email}>{position.memberEmail}</Text>
          </View>
          <TouchableOpacity style={memberCardStyles.removeButton} onPress={onRemove}>
            <MaterialCommunityIcons
              name={ICONS.CLOSE_CIRCLE}
              size={mobileIconSizes.medium}
              color={designTokens.colors.error}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Vacant position card
function VacantPositionCard({
  position,
  onAssign,
  t,
}: {
  position: DirectivePosition;
  onAssign: () => void;
  t: TranslationFn;
}): React.JSX.Element {
  return (
    <View style={positionCardStyles.card}>
      <View style={[positionCardStyles.icon, { backgroundColor: `${position.color}20` }]}>
        <MaterialCommunityIcons
          name={position.icon as typeof ICONS.CHECK}
          size={mobileIconSizes.xlarge}
          color={position.color}
        />
      </View>
      <View style={positionCardStyles.content}>
        <View style={positionCardStyles.header}>
          <Text style={positionCardStyles.title}>{t(position.titleKey)}</Text>
        </View>
        <Text style={positionCardStyles.description}>{t(position.descriptionKey)}</Text>
        <TouchableOpacity style={assignButtonStyles.button} onPress={onAssign}>
          <MaterialCommunityIcons
            name={ICONS.ACCOUNT_PLUS}
            size={mobileIconSizes.small}
            color={designTokens.colors.primary}
          />
          <Text style={assignButtonStyles.text}>{t('screens.clubDirective.assignMember')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Custom hook for directive handlers
type UseDirectiveHandlersReturn = {
  selectMemberModalVisible: boolean;
  currentPosition: DirectivePosition | null;
  assignedPositions: DirectivePosition[];
  vacantPositions: DirectivePosition[];
  handleAssignMember: (pos: DirectivePosition) => void;
  handleSelectMember: (member: User) => void;
  handleRemoveMember: (pos: DirectivePosition) => void;
  handleSaveDirective: () => void;
  closeModal: () => void;
};

// Helper: clear position data
const clearPositionData = (
  setPositions: React.Dispatch<React.SetStateAction<DirectivePosition[]>>,
  positionId: string
): void => {
  setPositions((prev) =>
    prev.map((pos) =>
      pos.id === positionId
        ? { ...pos, memberId: undefined, memberName: undefined, memberEmail: undefined }
        : pos
    )
  );
};

function useDirectiveHandlers(
  positions: DirectivePosition[],
  setPositions: React.Dispatch<React.SetStateAction<DirectivePosition[]>>,
  t: TranslationFn
): UseDirectiveHandlersReturn {
  const [selectMemberModalVisible, setSelectMemberModalVisible] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<DirectivePosition | null>(null);

  const assignedPositions = positions.filter((pos) => pos.memberId);
  const vacantPositions = positions.filter((pos) => !pos.memberId);
  const closeModal = (): void => setSelectMemberModalVisible(false);

  const clearPosition = useCallback(
    (id: string): void => clearPositionData(setPositions, id),
    [setPositions]
  );

  const assignMemberToPosition = useCallback(
    (member: User): void => {
      if (!currentPosition) {
        return;
      }
      setPositions((prev) =>
        prev.map((pos) =>
          pos.id === currentPosition.id
            ? { ...pos, memberId: member.id, memberName: member.name, memberEmail: member.email }
            : pos
        )
      );
      setSelectMemberModalVisible(false);
      Alert.alert(
        t('titles.memberAssigned'),
        t('screens.clubDirective.memberAssignedMessage', {
          memberName: member.name,
          positionTitle: t(currentPosition.titleKey),
        })
      );
      setCurrentPosition(null);
    },
    [currentPosition, setPositions, t]
  );

  const handleAssignMember = useCallback((pos: DirectivePosition): void => {
    setCurrentPosition(pos);
    setSelectMemberModalVisible(true);
  }, []);

  const handleSelectMember = useCallback(
    (member: User): void => {
      if (!currentPosition) {
        return;
      }
      const existing = positions.find(
        (p) => p.memberId === member.id && p.id !== currentPosition.id
      );
      if (existing) {
        const onReassign = (): void => {
          clearPosition(existing.id);
          assignMemberToPosition(member);
        };
        Alert.alert(t('titles.memberAlreadyAssigned'), t('warnings.memberAlreadyInPosition'), [
          { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
          { text: t('screens.clubDirective.reassign'), onPress: onReassign },
        ]);
        return;
      }
      assignMemberToPosition(member);
    },
    [currentPosition, positions, t, clearPosition, assignMemberToPosition]
  );

  const handleRemoveMember = useCallback(
    (pos: DirectivePosition): void => {
      Alert.alert(t('titles.removeMember'), t('warnings.confirmRemoveMember'), [
        { text: t('common.cancel'), style: ALERT_BUTTON_STYLE.CANCEL },
        {
          text: t('screens.clubDirective.remove'),
          style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
          onPress: (): void => clearPosition(pos.id),
        },
      ]);
    },
    [t, clearPosition]
  );

  return {
    selectMemberModalVisible,
    currentPosition,
    assignedPositions,
    vacantPositions,
    handleAssignMember,
    handleSelectMember,
    handleRemoveMember,
    closeModal,
  };
}

type PositionSectionProps = {
  positions: DirectivePosition[];
  titleKey: string;
  renderCard: (pos: DirectivePosition) => React.JSX.Element;
  t: TranslationFn;
};

function PositionSection({
  positions,
  titleKey,
  renderCard,
  t,
}: PositionSectionProps): React.JSX.Element | null {
  if (positions.length === 0) {
    return null;
  }
  return (
    <View style={sectionStyles.section}>
      <Text style={sectionStyles.title}>{t(titleKey)}</Text>
      {positions.map(renderCard)}
    </View>
  );
}

function InfoBanner({ t }: { t: TranslationFn }): React.JSX.Element {
  return (
    <View style={infoBannerStyles.banner}>
      <MaterialCommunityIcons
        name={ICONS.INFORMATION}
        size={mobileIconSizes.medium}
        color={designTokens.colors.info}
      />
      <Text style={infoBannerStyles.text}>{t('screens.clubDirective.infoText')}</Text>
    </View>
  );
}

function SaveFooter({ onSave, t }: { onSave: () => void; t: TranslationFn }): React.JSX.Element {
  return (
    <View style={footerStyles.footer}>
      <TouchableOpacity style={footerStyles.saveButton} onPress={onSave}>
        <MaterialCommunityIcons
          name={ICONS.CONTENT_SAVE}
          size={mobileIconSizes.large}
          color={designTokens.colors.textInverse}
        />
        <Text style={footerStyles.saveButtonText}>{t('screens.clubDirective.saveDirective')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const ClubDirectiveScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { positions, setPositions, clubMembers, refreshing, onRefresh } = useDirectiveData(
    user?.clubId
  );
  const h = useDirectiveHandlers(positions, setPositions, t);

  const handleSave = (): void => {
    if (h.assignedPositions.length === 0) {
      Alert.alert(t('titles.noAssignments'), t('screens.clubDirective.assignAtLeastOne'));
      return;
    }
    const msg = t('screens.clubDirective.saveSuccess', { count: h.assignedPositions.length });
    Alert.alert(t('titles.directiveSaved'), msg);
  };

  const modalItems = clubMembers.map((m) => {
    const ap = positions.find((p) => p.memberId === m.id);
    return {
      id: m.id,
      title: m.name,
      subtitle: m.email,
      avatar: m.name.charAt(0).toUpperCase(),
      iconColor: ap?.color || designTokens.colors.primary,
      badge: ap ? t(ap.titleKey) : undefined,
      badgeColor: ap?.color,
      disabled: ap?.id === h.currentPosition?.id,
    };
  });

  return (
    <View style={screenStyles.container}>
      <PageHeader
        showActions
        title={t('screens.clubDirective.title')}
        subtitle={t('screens.clubDirective.subtitle')}
      />
      <SummaryBanner
        assignedCount={h.assignedPositions.length}
        vacantCount={h.vacantPositions.length}
        t={t}
      />
      <ScrollView
        style={screenStyles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <PositionSection
          positions={h.assignedPositions}
          titleKey="screens.clubDirective.assignedPositions"
          t={t}
          renderCard={(pos): React.JSX.Element => (
            <AssignedPositionCard
              key={pos.id}
              position={pos}
              t={t}
              onRemove={(): void => h.handleRemoveMember(pos)}
            />
          )}
        />
        <PositionSection
          positions={h.vacantPositions}
          titleKey="screens.clubDirective.vacantPositions"
          t={t}
          renderCard={(pos): React.JSX.Element => (
            <VacantPositionCard
              key={pos.id}
              position={pos}
              t={t}
              onAssign={(): void => h.handleAssignMember(pos)}
            />
          )}
        />
        <InfoBanner t={t} />
      </ScrollView>
      {h.assignedPositions.length > 0 && <SaveFooter t={t} onSave={handleSave} />}
      <SelectionModal
        visible={h.selectMemberModalVisible}
        title={t('screens.clubDirective.assignMember')}
        subtitle={h.currentPosition ? t(h.currentPosition.titleKey) : undefined}
        items={modalItems}
        emptyMessage={t('screens.clubDirective.noAvailableMembers')}
        onClose={h.closeModal}
        onSelectItem={(item): void => {
          const m = clubMembers.find((x) => x.id === item.id);
          if (m) {
            h.handleSelectMember(m);
          }
        }}
      />
    </View>
  );
};

export default ClubDirectiveScreen;
