import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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
import { User } from '../../types';
import { mobileTypography, mobileIconSizes, layoutConstants } from '../../shared/theme';
import { designTokens } from '../../shared/theme/designTokens';
import { SelectionModal } from '../../shared/components';
import { logger } from '../../shared/utils/logger';
import { UserRole } from '../../types';
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

const ClubDirectiveScreen = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [positions, setPositions] = useState<DirectivePosition[]>([]);
  const [clubMembers, setClubMembers] = useState<User[]>([]);
  const [, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectMemberModalVisible, setSelectMemberModalVisible] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<DirectivePosition | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Initialize positions
      const initialPositions = DIRECTIVE_POSITION_CONFIG.map((pos) => ({ ...pos }));
      setPositions(initialPositions);

      // Load club members (exclude club_admin role as they're already directors)
      if (user?.clubId) {
        const members = await userService.getUsersByClub(user.clubId);
        // Filter active members who are not club admins
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
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleAssignMember = (position: DirectivePosition) => {
    setCurrentPosition(position);
    setSelectMemberModalVisible(true);
  };

  const handleSelectMember = (member: User) => {
    if (!currentPosition) return;

    // Check if member is already assigned to another position
    const existingPosition = positions.find(
      (pos) => pos.memberId === member.id && pos.id !== currentPosition.id
    );

    if (existingPosition) {
      Alert.alert(
        MESSAGES.TITLES.MEMBER_ALREADY_ASSIGNED,
        MESSAGES.WARNINGS.MEMBER_ALREADY_IN_POSITION,
        [
          { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
          {
            text: t('screens.clubDirective.reassign'),
            onPress: () => {
              // Remove from old position
              setPositions((prev) =>
                prev.map((pos) =>
                  pos.id === existingPosition.id
                    ? { ...pos, memberId: undefined, memberName: undefined, memberEmail: undefined }
                    : pos
                )
              );
              // Assign to new position
              assignMemberToPosition(member);
            },
          },
        ]
      );
      return;
    }

    assignMemberToPosition(member);
  };

  const assignMemberToPosition = (member: User) => {
    if (!currentPosition) return;

    setPositions((prev) =>
      prev.map((pos) =>
        pos.id === currentPosition.id
          ? {
              ...pos,
              memberId: member.id,
              memberName: member.name,
              memberEmail: member.email,
            }
          : pos
      )
    );

    setSelectMemberModalVisible(false);
    setCurrentPosition(null);

    // Show success message
    Alert.alert(
      MESSAGES.TITLES.MEMBER_ASSIGNED_TO_POSITION,
      `${member.name} has been assigned as ${t(currentPosition.titleKey)}.`,
      [{ text: MESSAGES.BUTTONS.OK }]
    );
  };

  const handleRemoveMember = (position: DirectivePosition) => {
    Alert.alert(MESSAGES.TITLES.REMOVE_MEMBER, MESSAGES.WARNINGS.CONFIRM_REMOVE_MEMBER, [
      { text: MESSAGES.BUTTONS.CANCEL, style: ALERT_BUTTON_STYLE.CANCEL },
      {
        text: t('screens.clubDirective.remove'),
        style: ALERT_BUTTON_STYLE.DESTRUCTIVE,
        onPress: () => {
          setPositions((prev) =>
            prev.map((pos) =>
              pos.id === position.id
                ? { ...pos, memberId: undefined, memberName: undefined, memberEmail: undefined }
                : pos
            )
          );
        },
      },
    ]);
  };

  const handleSaveDirective = () => {
    const assignedCount = positions.filter((pos) => pos.memberId).length;

    if (assignedCount === 0) {
      Alert.alert(MESSAGES.TITLES.NO_ASSIGNMENTS, t('screens.clubDirective.assignAtLeastOne'), [
        { text: MESSAGES.BUTTONS.OK },
      ]);
      return;
    }

    Alert.alert(
      MESSAGES.TITLES.DIRECTIVE_SAVED_TITLE,
      t('screens.clubDirective.saveSuccess', { count: assignedCount }),
      [{ text: MESSAGES.BUTTONS.OK }]
    );
  };

  const getAssignedPositions = () => positions.filter((pos) => pos.memberId);
  const getUnassignedPositions = () => positions.filter((pos) => !pos.memberId);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('screens.clubDirective.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('screens.clubDirective.subtitle')}</Text>
      </View>

      {/* Summary Banner */}
      <View style={styles.summaryBanner}>
        <View style={styles.summaryItem}>
          <MaterialCommunityIcons
            name={ICONS.ACCOUNT_CHECK}
            size={mobileIconSizes.medium}
            color={designTokens.colors.success}
          />
          <Text style={styles.summaryText}>
            <Text style={styles.summaryBold}>{getAssignedPositions().length}</Text>{' '}
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
            <Text style={styles.summaryBold}>{getUnassignedPositions().length}</Text>{' '}
            {t('screens.clubDirective.vacant')}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Assigned Positions Section */}
        {getAssignedPositions().length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('screens.clubDirective.assignedPositions')}</Text>
            {getAssignedPositions().map((position) => (
              <View key={position.id} style={styles.positionCard}>
                {/* Position Icon & Info */}
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

                  {/* Assigned Member */}
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
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveMember(position)}
                    >
                      <MaterialCommunityIcons
                        name={ICONS.CLOSE_CIRCLE}
                        size={mobileIconSizes.medium}
                        color={designTokens.colors.error}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Vacant Positions Section */}
        {getUnassignedPositions().length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('screens.clubDirective.vacantPositions')}</Text>
            {getUnassignedPositions().map((position) => (
              <View key={position.id} style={styles.positionCard}>
                {/* Position Icon & Info */}
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

                  {/* Assign Button */}
                  <TouchableOpacity
                    style={styles.assignButton}
                    onPress={() => handleAssignMember(position)}
                  >
                    <MaterialCommunityIcons
                      name={ICONS.ACCOUNT_PLUS}
                      size={mobileIconSizes.small}
                      color={designTokens.colors.primary}
                    />
                    <Text style={styles.assignButtonText}>
                      {t('screens.clubDirective.assignMember')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <MaterialCommunityIcons
            name={ICONS.INFORMATION}
            size={mobileIconSizes.medium}
            color={designTokens.colors.info}
          />
          <Text style={styles.infoText}>{t('screens.clubDirective.infoText')}</Text>
        </View>
      </ScrollView>

      {/* Save Button */}
      {getAssignedPositions().length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveDirective}>
            <MaterialCommunityIcons
              name={ICONS.CONTENT_SAVE}
              size={mobileIconSizes.large}
              color={designTokens.colors.textInverse}
            />
            <Text style={styles.saveButtonText}>{t('screens.clubDirective.saveDirective')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Select Member Modal */}
      <SelectionModal
        visible={selectMemberModalVisible}
        onClose={() => setSelectMemberModalVisible(false)}
        title={t('screens.clubDirective.assignMember')}
        subtitle={currentPosition ? t(currentPosition.titleKey) : undefined}
        items={clubMembers.map((member) => {
          const assignedPosition = positions.find((pos) => pos.memberId === member.id);
          const isAssigned = !!assignedPosition;
          const isSamePosition = assignedPosition?.id === currentPosition?.id;

          return {
            id: member.id,
            title: member.name,
            subtitle: member.email,
            avatar: member.name.charAt(0).toUpperCase(),
            iconColor: assignedPosition?.color || designTokens.colors.primary,
            badge: isAssigned ? t(assignedPosition.titleKey) : undefined,
            badgeColor: assignedPosition?.color,
            disabled: isAssigned && isSamePosition,
          };
        })}
        onSelectItem={(item) => {
          const member = clubMembers.find((m) => m.id === item.id);
          if (member) {
            handleSelectMember(member);
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
