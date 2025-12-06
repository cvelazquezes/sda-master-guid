import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { clubService } from '../../services/clubService';
import { User } from '../../types';
import {
  Text,
  Input,
  EmptyState,
  Card,
  ScreenHeader,
  StandardButton,
} from '../../shared/components';
import { designTokens, layoutConstants, mobileTypography } from '../../shared/theme';
import {
  BUTTON_SIZE,
  COMPONENT_VARIANT,
  EMPTY_VALUE,
  EXTERNAL_URLS,
  ICONS,
  MESSAGES,
  VALIDATION,
  dimensionValues,
  flexValues,
} from '../../shared/constants';

// Extracted member card component
interface MemberCardProps {
  member: User;
  currentUserId?: string;
  onContact: (member: User) => void;
  t: ReturnType<typeof useTranslation>['t'];
}

function MemberCard({ member, currentUserId, onContact, t }: MemberCardProps): React.JSX.Element {
  return (
    <Card variant={COMPONENT_VARIANT.elevated} style={styles.memberCard}>
      <View style={styles.memberContent}>
        <View style={styles.memberAvatar}>
          <Text style={styles.memberAvatarText}>{member.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.memberEmail}>{member.email}</Text>
          {member.whatsappNumber && (
            <View style={styles.whatsappBadge}>
              <MaterialCommunityIcons
                name={ICONS.WHATSAPP}
                size={designTokens.iconSize.xs}
                color={designTokens.colors.success}
              />
              <Text style={styles.whatsappText}>{t('screens.members.availableOnWhatsApp')}</Text>
            </View>
          )}
        </View>
        {member.id !== currentUserId && member.whatsappNumber && (
          <StandardButton
            title={t('screens.members.contact')}
            icon={ICONS.MESSAGE}
            variant={COMPONENT_VARIANT.secondary}
            size={BUTTON_SIZE.small}
            onPress={() => onContact(member)}
          />
        )}
      </View>
    </Card>
  );
}

// Extracted member list content
function MemberListContent({
  loading,
  members,
  searchQuery,
  currentUserId,
  onContact,
  t,
}: {
  loading: boolean;
  members: User[];
  searchQuery: string;
  currentUserId?: string;
  onContact: (m: User) => void;
  t: ReturnType<typeof useTranslation>['t'];
}): React.JSX.Element {
  if (loading) {
    return (
      <EmptyState
        icon={ICONS.LOADING}
        title={t('screens.members.loadingMembers')}
        description={t('common.pleaseWait')}
      />
    );
  }
  if (members.length === 0) {
    const icon = searchQuery ? ICONS.ACCOUNT_SEARCH : ICONS.ACCOUNT_GROUP;
    const title = searchQuery
      ? t('screens.members.noMembersFound')
      : t('screens.members.noMembersYet');
    const desc = searchQuery
      ? t('screens.members.noMembersMatchSearch')
      : t('screens.members.joinClubToSeeMembers');
    return <EmptyState icon={icon} title={title} description={desc} />;
  }
  return (
    <>
      {members.map((m) => (
        <MemberCard
          key={m.id}
          member={m}
          currentUserId={currentUserId}
          onContact={onContact}
          t={t}
        />
      ))}
    </>
  );
}

// Custom hook for members data management
interface UseMembersDataReturn {
  filteredMembers: User[];
  loading: boolean;
  refreshing: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refresh: () => void;
}

function useMembersData(clubId?: string): UseMembersDataReturn {
  const [members, setMembers] = useState<User[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(EMPTY_VALUE);

  const loadMembers = useCallback(async () => {
    if (!clubId) {
      return;
    }
    try {
      const data = await clubService.getClubMembers(clubId);
      const active = data.filter((m) => m.isActive).sort((a, b) => a.name.localeCompare(b.name));
      setMembers(active);
      setFilteredMembers(active);
    } catch {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_MEMBERS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [clubId]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  useEffect(() => {
    if (searchQuery.trim() === EMPTY_VALUE) {
      setFilteredMembers(members);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredMembers(
      members.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
    );
  }, [searchQuery, members]);

  const refresh = (): void => {
    setRefreshing(true);
    loadMembers();
  };

  return { filteredMembers, loading, refreshing, searchQuery, setSearchQuery, refresh };
}

// Contact member helper
const contactMember = (member: User, message: string): void => {
  if (!member.whatsappNumber) {
    Alert.alert(MESSAGES.TITLES.NO_WHATSAPP, MESSAGES.INFO.NO_WHATSAPP_PROVIDED);
    return;
  }
  const cleanNumber = member.whatsappNumber.replace(
    VALIDATION.WHATSAPP.STRIP_NON_DIGITS,
    EMPTY_VALUE
  );
  const url = `${EXTERNAL_URLS.WHATSAPP_BASE}${cleanNumber}?text=${encodeURIComponent(message)}`;
  Linking.openURL(url).catch(() => {
    Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.COULD_NOT_OPEN_WHATSAPP);
  });
};

// No club state component
function NoClubState({ t }: { t: ReturnType<typeof useTranslation>['t'] }): React.JSX.Element {
  return (
    <View style={styles.container}>
      <EmptyState
        icon={ICONS.ACCOUNT_ALERT}
        title={t('screens.members.notPartOfClub')}
        description={t('screens.members.contactAdminDescription')}
        iconColor={designTokens.colors.warning}
      />
    </View>
  );
}

// Get subtitle helper
const getMemberSubtitle = (count: number, t: ReturnType<typeof useTranslation>['t']): string => {
  const key =
    count !== 1
      ? t('screens.members.subtitle_plural', { count })
      : t('screens.members.subtitle', { count });
  return `${count} ${key}`;
};

const MembersScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { filteredMembers, loading, refreshing, searchQuery, setSearchQuery, refresh } =
    useMembersData(user?.clubId);

  if (!user?.clubId) {
    return <NoClubState t={t} />;
  }

  const subtitle = getMemberSubtitle(filteredMembers.length, t);
  const handleContact = (m: User): void =>
    contactMember(m, t('screens.members.whatsappMessage', { name: m.name }));

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('screens.members.title')} subtitle={subtitle} />
      <View style={styles.searchContainer}>
        <Input
          placeholder={t('placeholders.searchByNameOrEmail')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon={ICONS.MAGNIFY}
        />
      </View>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        <View style={styles.content}>
          <MemberListContent
            loading={loading}
            members={filteredMembers}
            searchQuery={searchQuery}
            currentUserId={user?.id}
            onContact={handleContact}
            t={t}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  // Search container now uses Input primitive which handles its own styling
  searchContainer: {
    marginHorizontal: designTokens.spacing.lg,
    marginTop: designTokens.spacing.md,
    marginBottom: designTokens.spacing.lg,
  },
  scrollView: {
    flex: flexValues.one,
  },
  content: {
    padding: designTokens.spacing.lg,
  },
  memberCard: {
    marginBottom: designTokens.spacing.md,
  },
  memberContent: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.md,
  },
  memberAvatar: {
    width: dimensionValues.size.avatarMedium,
    height: dimensionValues.size.avatarMedium,
    borderRadius: designTokens.borderRadius['4xl'],
    backgroundColor: designTokens.colors.primary,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
  memberAvatarText: {
    ...mobileTypography.heading2,
    color: designTokens.colors.textInverse,
  },
  memberInfo: {
    flex: flexValues.one,
  },
  memberName: {
    ...mobileTypography.bodyLargeBold,
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.xxs,
  },
  memberEmail: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.xs,
  },
  whatsappBadge: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.xs,
    marginTop: designTokens.spacing.xs,
  },
  whatsappText: {
    ...mobileTypography.caption,
    color: designTokens.colors.success,
  },
});

export default MembersScreen;
