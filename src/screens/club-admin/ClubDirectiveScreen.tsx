import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { User, UserRole } from '../../types';
import { mobileTypography, mobileIconSizes, layoutConstants } from '../../shared/theme';
import { designTokens } from '../../shared/theme/designTokens';
import { SelectionModal, Text } from '../../shared/components';
import { logger } from '../../shared/utils/logger';
import {
  ALERT_BUTTON_STYLE,
  DIRECTIVE_POSITION_IDS,
  ICONS,
  LOG_MESSAGES,
  MESSAGES,
  borderValues,
  dimensionValues,
  flexValues,
  shadowOffsetValues,
  typographyValues,
} from '../../shared/constants';

// Directive positions that can be assigned
interface DirectivePosition {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  color: string;
  memberId?: string;
  memberName?: string;
  memberEmail?: string;
}

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
interface UseDirectiveDataReturn {
  positions: DirectivePosition[];
  setPositions: React.Dispatch<React.SetStateAction<DirectivePosition[]>>;
  clubMembers: User[];
  refreshing: boolean;
  onRefresh: () => void;
}

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
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_DIRECTIVE);
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
    <View style={styles.summaryBanner}>
      <View style={styles.summaryItem}>
        <MaterialCommunityIcons
          name={ICONS.ACCOUNT_CHECK}
          size={mobileIconSizes.medium}
          color={designTokens.colors.success}
        />
        <Text style={styles.summaryText}>
          <Text style={styles.summaryBold}>{assignedCount}</Text>{' '}
          {t('screens.clubDirective.assigned')}
        </Text>
      </View>
      <View style={styles.summarySeparator} />
      <View style={styles.summaryItem}>
        <MaterialCommunityIcons
          name={ICONS.ACCOUNT_CLOCK}
          size={mobileIconSizes.medium}
          color={designTokens.colors.warning}
        />
        <Text style={styles.summaryText}>
          <Text style={styles.summaryBold}>{vacantCount}</Text> {t('screens.clubDirective.vacant')}
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
    <View style={styles.positionCard}>
      <View style={[styles.positionIcon, { backgroundColor: `${position.color}20` }]}>
        <MaterialCommunityIcons
          name={position.icon as typeof ICONS.CHECK}
          size={mobileIconSizes.xlarge}
          color={position.color}
        />
      </View>
      <View style={styles.positionContent}>
        <View style={styles.positionHeader}>
          <Text style={styles.positionTitle}>{t(position.titleKey)}</Text>
        </View>
        <View style={styles.memberCard}>
          <View style={[styles.memberAvatar, { backgroundColor: position.color }]}>
            <Text style={styles.memberAvatarText}>
              {position.memberName?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{position.memberName}</Text>
            <Text style={styles.memberEmail}>{position.memberEmail}</Text>
          </View>
          <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
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
    <View style={styles.positionCard}>
      <View style={[styles.positionIcon, { backgroundColor: `${position.color}20` }]}>
        <MaterialCommunityIcons
          name={position.icon as typeof ICONS.CHECK}
          size={mobileIconSizes.xlarge}
          color={position.color}
        />
      </View>
      <View style={styles.positionContent}>
        <View style={styles.positionHeader}>
          <Text style={styles.positionTitle}>{t(position.titleKey)}</Text>
        </View>
        <Text style={styles.positionDescription}>{t(position.descriptionKey)}</Text>
        <TouchableOpacity style={styles.assignButton} onPress={onAssign}>
          <MaterialCommunityIcons
            name={ICONS.ACCOUNT_PLUS}
            size={mobileIconSizes.small}
            color={designTokens.colors.primary}
          />
          <Text style={styles.assignButtonText}>{t('screens.clubDirective.assignMember')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Custom hook for directive handlers
interface UseDirectiveHandlersReturn {
  selectMemberModalVisible: boolean;
  currentPosition: DirectivePosition | null;
  assignedPositions: DirectivePosition[];
  vacantPositions: DirectivePosition[];
  handleAssignMember: (pos: DirectivePosition) => void;
  handleSelectMember: (member: User) => void;
  handleRemoveMember: (pos: DirectivePosition) => void;
  handleSaveDirective: () => void;
  closeModal: () => void;
}

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
        MESSAGES.TITLES.MEMBER_ASSIGNED_TO_POSITION,
        `${member.name} assigned as ${t(currentPosition.titleKey)}.`
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
        Alert.alert(
          MESSAGES.TITLES.MEMBER_ALREADY_ASSIGNED,
          MESSAGES.WARNINGS.MEMBER_ALREADY_IN_POSITION,
          [
            { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
            { text: t('screens.clubDirective.reassign'), onPress: onReassign },
          ]
        );
        return;
      }
      assignMemberToPosition(member);
    },
    [currentPosition, positions, t, clearPosition, assignMemberToPosition]
  );

  const handleRemoveMember = useCallback(
    (pos: DirectivePosition): void => {
      Alert.alert(MESSAGES.TITLES.REMOVE_MEMBER, MESSAGES.WARNINGS.CONFIRM_REMOVE_MEMBER, [
        { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
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

interface PositionSectionProps {
  positions: DirectivePosition[];
  titleKey: string;
  renderCard: (pos: DirectivePosition) => React.JSX.Element;
  t: TranslationFn;
}

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
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t(titleKey)}</Text>
      {positions.map(renderCard)}
    </View>
  );
}

function InfoBanner({ t }: { t: TranslationFn }): React.JSX.Element {
  return (
    <View style={styles.infoBanner}>
      <MaterialCommunityIcons
        name={ICONS.INFORMATION}
        size={mobileIconSizes.medium}
        color={designTokens.colors.info}
      />
      <Text style={styles.infoText}>{t('screens.clubDirective.infoText')}</Text>
    </View>
  );
}

function SaveFooter({ onSave, t }: { onSave: () => void; t: TranslationFn }): React.JSX.Element {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <MaterialCommunityIcons
          name={ICONS.CONTENT_SAVE}
          size={mobileIconSizes.large}
          color={designTokens.colors.textInverse}
        />
        <Text style={styles.saveButtonText}>{t('screens.clubDirective.saveDirective')}</Text>
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
      Alert.alert(MESSAGES.TITLES.NO_ASSIGNMENTS, t('screens.clubDirective.assignAtLeastOne'));
      return;
    }
    const msg = t('screens.clubDirective.saveSuccess', { count: h.assignedPositions.length });
    Alert.alert(MESSAGES.TITLES.DIRECTIVE_SAVED_TITLE, msg);
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('screens.clubDirective.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('screens.clubDirective.subtitle')}</Text>
      </View>
      <SummaryBanner
        assignedCount={h.assignedPositions.length}
        vacantCount={h.vacantPositions.length}
        t={t}
      />
      <ScrollView
        style={styles.content}
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
              onRemove={(): void => h.handleRemoveMember(pos)}
              t={t}
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
              onAssign={(): void => h.handleAssignMember(pos)}
              t={t}
            />
          )}
        />
        <InfoBanner t={t} />
      </ScrollView>
      {h.assignedPositions.length > 0 && <SaveFooter onSave={handleSave} t={t} />}
      <SelectionModal
        visible={h.selectMemberModalVisible}
        onClose={h.closeModal}
        title={t('screens.clubDirective.assignMember')}
        subtitle={h.currentPosition ? t(h.currentPosition.titleKey) : undefined}
        items={modalItems}
        onSelectItem={(item): void => {
          const m = clubMembers.find((x) => x.id === item.id);
          if (m) {
            h.handleSelectMember(m);
          }
        }}
        emptyMessage={t('screens.clubDirective.noAvailableMembers')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  header: {
    backgroundColor: designTokens.colors.backgroundPrimary,
    paddingHorizontal: designTokens.spacing.xl,
    paddingTop: designTokens.spacing.xl,
    paddingBottom: designTokens.spacing.lg,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  headerTitle: {
    ...mobileTypography.heading1,
  },
  headerSubtitle: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.xs,
  },
  summaryBanner: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.spaceAround,
    backgroundColor: designTokens.colors.backgroundPrimary,
    paddingVertical: designTokens.spacing.lg,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  summaryItem: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.sm,
  },
  summaryText: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
  },
  summaryBold: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.textPrimary,
  },
  summarySeparator: {
    width: borderValues.width.thin,
    height: dimensionValues.height.divider,
    backgroundColor: designTokens.colors.borderLight,
  },
  content: {
    flex: flexValues.one,
  },
  section: {
    padding: designTokens.spacing.xl,
  },
  sectionTitle: {
    ...mobileTypography.heading3,
    marginBottom: designTokens.spacing.lg,
  },
  positionCard: {
    flexDirection: layoutConstants.flexDirection.row,
    backgroundColor: designTokens.colors.backgroundPrimary,
    padding: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    shadowColor: designTokens.colors.textPrimary,
    shadowOffset: shadowOffsetValues.md,
    shadowOpacity: designTokens.shadows.sm.shadowOpacity,
    shadowRadius: designTokens.shadows.sm.shadowRadius,
    elevation: designTokens.shadows.sm.elevation,
  },
  positionIcon: {
    width: dimensionValues.size.avatarMedium,
    height: dimensionValues.size.avatarMedium,
    borderRadius: designTokens.borderRadius['4xl'],
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    marginRight: designTokens.spacing.md,
  },
  positionContent: {
    flex: flexValues.one,
  },
  positionHeader: {
    marginBottom: designTokens.spacing.sm,
  },
  positionTitle: {
    ...mobileTypography.bodyLargeBold,
  },
  positionDescription: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.md,
  },
  memberCard: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.inputBackground,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.xl,
    marginTop: designTokens.spacing.sm,
  },
  memberAvatar: {
    width: dimensionValues.size.iconButtonSmall,
    height: dimensionValues.size.iconButtonSmall,
    borderRadius: designTokens.borderRadius['3xl'],
    backgroundColor: designTokens.colors.primary,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    marginRight: designTokens.spacing.md,
  },
  memberAvatarText: {
    ...mobileTypography.bodyMediumBold,
    color: designTokens.colors.textInverse,
  },
  memberInfo: {
    flex: flexValues.one,
  },
  memberName: {
    ...mobileTypography.bodyMediumBold,
  },
  memberEmail: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.xxs,
  },
  removeButton: {
    padding: designTokens.spacing.sm,
  },
  assignButton: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.md,
    borderWidth: designTokens.borderWidth.thin,
    borderColor: designTokens.colors.primary,
    borderStyle: borderValues.style.dashed,
    gap: designTokens.spacing.sm,
    marginTop: designTokens.spacing.sm,
  },
  assignButtonText: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.primary,
  },
  infoBanner: {
    flexDirection: layoutConstants.flexDirection.row,
    backgroundColor: designTokens.colors.infoLight,
    padding: designTokens.spacing.lg,
    margin: designTokens.spacing.xl,
    borderRadius: designTokens.borderRadius.xl,
    gap: designTokens.spacing.md,
    borderLeftWidth: borderValues.width.medium,
    borderLeftColor: designTokens.colors.info,
  },
  infoText: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.info,
    flex: flexValues.one,
    lineHeight: typographyValues.lineHeight.lg,
  },
  footer: {
    padding: designTokens.spacing.xl,
    backgroundColor: designTokens.colors.backgroundPrimary,
    borderTopWidth: designTokens.borderWidth.thin,
    borderTopColor: designTokens.colors.borderLight,
  },
  saveButton: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    backgroundColor: designTokens.colors.primary,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.xl,
    gap: designTokens.spacing.md,
  },
  saveButtonText: {
    ...mobileTypography.button,
    color: designTokens.colors.textInverse,
  },
});

export default ClubDirectiveScreen;
