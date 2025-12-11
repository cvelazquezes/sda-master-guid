/* eslint-disable max-lines -- Club directive screen with comprehensive position management */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { t as i18nT } from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  createScreenStyles,
  createSummaryStyles,
  createSectionStyles,
  createPositionCardStyles,
  createMemberCardStyles,
  createAssignButtonStyles,
  createInfoBannerStyles,
  createFooterStyles,
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
import { type User, UserRole } from '../../../types';
import { SelectionModal, Text, PageHeader } from '../../components/primitives';
import { useAuth } from '../../state/AuthContext';
import { useTheme } from '../../state/ThemeContext';

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

type TranslationFn = ReturnType<typeof useTranslation>['t'];

// Hook to create all styles
function useDirectiveStyles(): {
  screenStyles: ReturnType<typeof createScreenStyles>;
  summaryStyles: ReturnType<typeof createSummaryStyles>;
  sectionStyles: ReturnType<typeof createSectionStyles>;
  positionCardStyles: ReturnType<typeof createPositionCardStyles>;
  memberCardStyles: ReturnType<typeof createMemberCardStyles>;
  assignButtonStyles: ReturnType<typeof createAssignButtonStyles>;
  infoBannerStyles: ReturnType<typeof createInfoBannerStyles>;
  footerStyles: ReturnType<typeof createFooterStyles>;
  colors: ReturnType<typeof useTheme>['colors'];
  iconSizes: ReturnType<typeof useTheme>['iconSizes'];
} {
  const { colors, spacing, radii, typography, iconSizes } = useTheme();

  const screenStyles = useMemo(() => createScreenStyles(colors), [colors]);
  const summaryStyles = useMemo(
    () => createSummaryStyles(colors, spacing, typography),
    [colors, spacing, typography]
  );
  const sectionStyles = useMemo(
    () => createSectionStyles(spacing, typography, colors),
    [spacing, typography, colors]
  );
  const positionCardStyles = useMemo(
    () => createPositionCardStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const memberCardStyles = useMemo(
    () => createMemberCardStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const assignButtonStyles = useMemo(
    () => createAssignButtonStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const infoBannerStyles = useMemo(
    () => createInfoBannerStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const footerStyles = useMemo(
    () => createFooterStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );

  return {
    screenStyles,
    summaryStyles,
    sectionStyles,
    positionCardStyles,
    memberCardStyles,
    assignButtonStyles,
    infoBannerStyles,
    footerStyles,
    colors,
    iconSizes,
  };
}

// Custom hook for directive data
type UseDirectiveDataReturn = {
  positions: DirectivePosition[];
  setPositions: React.Dispatch<React.SetStateAction<DirectivePosition[]>>;
  clubMembers: User[];
  refreshing: boolean;
  onRefresh: () => void;
};

function useDirectiveData(
  clubId: string | undefined,
  colors: ReturnType<typeof useTheme>['colors']
): UseDirectiveDataReturn {
  const [positions, setPositions] = useState<DirectivePosition[]>([]);
  const [clubMembers, setClubMembers] = useState<User[]>([]);
  // eslint-disable-next-line react/hook-use-state, @typescript-eslint/naming-convention -- setter used for side effects only
  const [_loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Position configuration with i18n keys
  const positionConfig = useMemo(
    () => [
      {
        id: DIRECTIVE_POSITION_IDS.VICE_DIRECTOR,
        titleKey: 'screens.clubDirective.positions.viceDirector',
        descriptionKey: 'screens.clubDirective.positions.viceDirectorDesc',
        icon: ICONS.ACCOUNT_STAR,
        color: colors.warning,
      },
      {
        id: DIRECTIVE_POSITION_IDS.ASSOCIATE_DIRECTOR,
        titleKey: 'screens.clubDirective.positions.associateDirector',
        descriptionKey: 'screens.clubDirective.positions.associateDirectorDesc',
        icon: ICONS.ACCOUNT_SUPERVISOR,
        color: colors.info,
      },
      {
        id: DIRECTIVE_POSITION_IDS.TREASURER,
        titleKey: 'screens.clubDirective.positions.treasurer',
        descriptionKey: 'screens.clubDirective.positions.treasurerDesc',
        icon: ICONS.CASH_MULTIPLE,
        color: colors.success,
      },
      {
        id: DIRECTIVE_POSITION_IDS.COUNSELOR,
        titleKey: 'screens.clubDirective.positions.counselor',
        descriptionKey: 'screens.clubDirective.positions.counselorDesc',
        icon: ICONS.ACCOUNT_HEART,
        color: colors.primary,
      },
      {
        id: DIRECTIVE_POSITION_IDS.SECRETARY,
        titleKey: 'screens.clubDirective.positions.secretary',
        descriptionKey: 'screens.clubDirective.positions.secretaryDesc',
        icon: ICONS.CLIPBOARD_TEXT,
        color: colors.info,
      },
      {
        id: DIRECTIVE_POSITION_IDS.EVENTS_COORDINATOR,
        titleKey: 'screens.clubDirective.positions.eventsCoordinator',
        descriptionKey: 'screens.clubDirective.positions.eventsCoordinatorDesc',
        icon: ICONS.CALENDAR_STAR,
        color: colors.error,
      },
    ],
    [colors]
  );

  const loadData = useCallback(async (): Promise<void> => {
    try {
      const initialPositions = positionConfig.map((pos) => ({ ...pos }));
      setPositions(initialPositions);
      if (clubId) {
        const members = await userService.getUsersByClub(clubId);
        const eligibleMembers = members.filter((m) => m.isActive && m.role === UserRole.USER);
        setClubMembers(eligibleMembers);
      }
    } catch (error) {
      logger.error(LOG_MESSAGES.SCREENS.CLUB_DIRECTIVE.FAILED_TO_LOAD_DATA, error as Error);
      Alert.alert(i18nT('common.error'), i18nT('errors.failedToLoadDirective'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [clubId, positionConfig]);

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
type SummaryBannerProps = {
  assignedCount: number;
  vacantCount: number;
  t: TranslationFn;
  styles: ReturnType<typeof createSummaryStyles>;
  colors: ReturnType<typeof useTheme>['colors'];
  iconSizes: ReturnType<typeof useTheme>['iconSizes'];
};

function SummaryBanner({
  assignedCount,
  vacantCount,
  t,
  styles,
  colors,
  iconSizes,
}: SummaryBannerProps): React.JSX.Element {
  return (
    <View style={styles.banner}>
      <View style={styles.item}>
        <MaterialCommunityIcons
          name={ICONS.ACCOUNT_CHECK}
          size={iconSizes.md}
          color={colors.success}
        />
        <Text style={styles.text}>
          <Text style={styles.bold}>{assignedCount}</Text>
          {SINGLE_SPACE}
          {t('screens.clubDirective.assigned')}
        </Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.item}>
        <MaterialCommunityIcons
          name={ICONS.ACCOUNT_CLOCK}
          size={iconSizes.md}
          color={colors.warning}
        />
        <Text style={styles.text}>
          <Text style={styles.bold}>{vacantCount}</Text>
          {SINGLE_SPACE}
          {t('screens.clubDirective.vacant')}
        </Text>
      </View>
    </View>
  );
}

// Assigned position card
type AssignedPositionCardProps = {
  position: DirectivePosition;
  onRemove: () => void;
  t: TranslationFn;
  positionStyles: ReturnType<typeof createPositionCardStyles>;
  memberStyles: ReturnType<typeof createMemberCardStyles>;
  colors: ReturnType<typeof useTheme>['colors'];
  iconSizes: ReturnType<typeof useTheme>['iconSizes'];
};

function AssignedPositionCard({
  position,
  onRemove,
  t,
  positionStyles,
  memberStyles,
  colors,
  iconSizes,
}: AssignedPositionCardProps): React.JSX.Element {
  return (
    <View style={positionStyles.card}>
      <View style={[positionStyles.icon, { backgroundColor: `${position.color}20` }]}>
        <MaterialCommunityIcons
          name={position.icon as typeof ICONS.CHECK}
          size={iconSizes.xl}
          color={position.color}
        />
      </View>
      <View style={positionStyles.content}>
        <View style={positionStyles.header}>
          <Text style={positionStyles.title}>{t(position.titleKey)}</Text>
        </View>
        <View style={memberStyles.card}>
          <View style={[memberStyles.avatar, { backgroundColor: position.color }]}>
            <Text style={memberStyles.avatarText}>
              {position.memberName?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={memberStyles.info}>
            <Text style={memberStyles.name}>{position.memberName}</Text>
            <Text style={memberStyles.email}>{position.memberEmail}</Text>
          </View>
          <TouchableOpacity
            style={memberStyles.removeButton}
            accessibilityRole="button"
            accessibilityLabel="Remove member"
            onPress={onRemove}
          >
            <MaterialCommunityIcons
              name={ICONS.CLOSE_CIRCLE}
              size={iconSizes.md}
              color={colors.error}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Vacant position card
type VacantPositionCardProps = {
  position: DirectivePosition;
  onAssign: () => void;
  t: TranslationFn;
  positionStyles: ReturnType<typeof createPositionCardStyles>;
  assignStyles: ReturnType<typeof createAssignButtonStyles>;
  colors: ReturnType<typeof useTheme>['colors'];
  iconSizes: ReturnType<typeof useTheme>['iconSizes'];
};

function VacantPositionCard({
  position,
  onAssign,
  t,
  positionStyles,
  assignStyles,
  colors,
  iconSizes,
}: VacantPositionCardProps): React.JSX.Element {
  return (
    <View style={positionStyles.card}>
      <View style={[positionStyles.icon, { backgroundColor: `${position.color}20` }]}>
        <MaterialCommunityIcons
          name={position.icon as typeof ICONS.CHECK}
          size={iconSizes.xl}
          color={position.color}
        />
      </View>
      <View style={positionStyles.content}>
        <View style={positionStyles.header}>
          <Text style={positionStyles.title}>{t(position.titleKey)}</Text>
        </View>
        <Text style={positionStyles.description}>{t(position.descriptionKey)}</Text>
        <TouchableOpacity
          style={assignStyles.button}
          accessibilityRole="button"
          accessibilityLabel="Assign member"
          onPress={onAssign}
        >
          <MaterialCommunityIcons
            name={ICONS.ACCOUNT_PLUS}
            size={iconSizes.sm}
            color={colors.primary}
          />
          <Text style={assignStyles.text}>{t('screens.clubDirective.assignMember')}</Text>
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
  styles: ReturnType<typeof createSectionStyles>;
};

function PositionSection({
  positions,
  titleKey,
  renderCard,
  t,
  styles,
}: PositionSectionProps): React.JSX.Element | null {
  if (positions.length === 0) {
    return null;
  }
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{t(titleKey)}</Text>
      {positions.map(renderCard)}
    </View>
  );
}

type InfoBannerProps = {
  t: TranslationFn;
  styles: ReturnType<typeof createInfoBannerStyles>;
  colors: ReturnType<typeof useTheme>['colors'];
  iconSizes: ReturnType<typeof useTheme>['iconSizes'];
};

function InfoBanner({ t, styles, colors, iconSizes }: InfoBannerProps): React.JSX.Element {
  return (
    <View style={styles.banner}>
      <MaterialCommunityIcons name={ICONS.INFORMATION} size={iconSizes.md} color={colors.info} />
      <Text style={styles.text}>{t('screens.clubDirective.infoText')}</Text>
    </View>
  );
}

type SaveFooterProps = {
  onSave: () => void;
  t: TranslationFn;
  styles: ReturnType<typeof createFooterStyles>;
  colors: ReturnType<typeof useTheme>['colors'];
  iconSizes: ReturnType<typeof useTheme>['iconSizes'];
};

function SaveFooter({ onSave, t, styles, colors, iconSizes }: SaveFooterProps): React.JSX.Element {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.saveButton}
        accessibilityRole="button"
        accessibilityLabel="Save directive"
        onPress={onSave}
      >
        <MaterialCommunityIcons
          name={ICONS.CONTENT_SAVE}
          size={iconSizes.lg}
          color={colors.textInverse}
        />
        <Text style={styles.saveButtonText}>{t('screens.clubDirective.saveDirective')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const ClubDirectiveScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const styles = useDirectiveStyles();
  const { positions, setPositions, clubMembers, refreshing, onRefresh } = useDirectiveData(
    user?.clubId,
    styles.colors
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
      iconColor: ap?.color || styles.colors.primary,
      badge: ap ? t(ap.titleKey) : undefined,
      badgeColor: ap?.color,
      disabled: ap?.id === h.currentPosition?.id,
    };
  });

  return (
    <View style={styles.screenStyles.container}>
      <PageHeader
        showActions
        title={t('screens.clubDirective.title')}
        subtitle={t('screens.clubDirective.subtitle')}
      />
      <SummaryBanner
        assignedCount={h.assignedPositions.length}
        vacantCount={h.vacantPositions.length}
        t={t}
        styles={styles.summaryStyles}
        colors={styles.colors}
        iconSizes={styles.iconSizes}
      />
      <ScrollView
        style={styles.screenStyles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <PositionSection
          positions={h.assignedPositions}
          titleKey="screens.clubDirective.assignedPositions"
          t={t}
          styles={styles.sectionStyles}
          renderCard={(pos): React.JSX.Element => (
            <AssignedPositionCard
              key={pos.id}
              position={pos}
              t={t}
              positionStyles={styles.positionCardStyles}
              memberStyles={styles.memberCardStyles}
              colors={styles.colors}
              iconSizes={styles.iconSizes}
              onRemove={(): void => h.handleRemoveMember(pos)}
            />
          )}
        />
        <PositionSection
          positions={h.vacantPositions}
          titleKey="screens.clubDirective.vacantPositions"
          t={t}
          styles={styles.sectionStyles}
          renderCard={(pos): React.JSX.Element => (
            <VacantPositionCard
              key={pos.id}
              position={pos}
              t={t}
              positionStyles={styles.positionCardStyles}
              assignStyles={styles.assignButtonStyles}
              colors={styles.colors}
              iconSizes={styles.iconSizes}
              onAssign={(): void => h.handleAssignMember(pos)}
            />
          )}
        />
        <InfoBanner
          t={t}
          styles={styles.infoBannerStyles}
          colors={styles.colors}
          iconSizes={styles.iconSizes}
        />
      </ScrollView>
      {h.assignedPositions.length > 0 && (
        <SaveFooter
          t={t}
          styles={styles.footerStyles}
          colors={styles.colors}
          iconSizes={styles.iconSizes}
          onSave={handleSave}
        />
      )}
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
