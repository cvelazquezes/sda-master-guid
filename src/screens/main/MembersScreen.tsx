/**
 * MembersScreen
 * ✅ COMPLIANT: Uses theme values via useTheme() hook
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Linking,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme, ThemeContextType } from '../../contexts/ThemeContext';
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
import {
  BUTTON_SIZE,
  COMPONENT_VARIANT,
  EMPTY_VALUE,
  EXTERNAL_URLS,
  ICONS,
  PHONE,
  DIMENSIONS,
  FLEX,
} from '../../shared/constants';

// Extracted member card component
interface MemberCardProps {
  member: User;
  currentUserId?: string;
  onContact: (member: User) => void;
  colors: ThemeContextType['colors'];
  spacing: ThemeContextType['spacing'];
  radii: ThemeContextType['radii'];
  iconSizes: ThemeContextType['iconSizes'];
  typography: ThemeContextType['typography'];
  t: ReturnType<typeof useTranslation>['t'];
}

function MemberCard({
  member,
  currentUserId,
  onContact,
  colors,
  spacing,
  radii,
  iconSizes,
  typography,
  t,
}: MemberCardProps): React.JSX.Element {
  const memberContentStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  };

  const memberAvatarStyle: ViewStyle = {
    width: DIMENSIONS.SIZE.AVATAR_MEDIUM,
    height: DIMENSIONS.SIZE.AVATAR_MEDIUM,
    borderRadius: radii['4xl'],
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const memberAvatarTextStyle: TextStyle = {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
    color: colors.textInverse,
  };

  const memberNameStyle: TextStyle = {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold as TextStyle['fontWeight'],
    color: colors.textPrimary,
    marginBottom: spacing.xxs,
  };

  const memberEmailStyle: TextStyle = {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  };

  const whatsappBadgeStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  };

  const whatsappTextStyle: TextStyle = {
    fontSize: typography.fontSizes.xs,
    color: colors.success,
  };

  return (
    <Card variant={COMPONENT_VARIANT.elevated} style={{ marginBottom: spacing.md }}>
      <View style={memberContentStyle}>
        <View style={memberAvatarStyle}>
          <Text style={memberAvatarTextStyle}>{member.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ flex: FLEX.ONE }}>
          <Text style={memberNameStyle}>{member.name}</Text>
          <Text style={memberEmailStyle}>{member.email}</Text>
          {member.whatsappNumber && (
            <View style={whatsappBadgeStyle}>
              <MaterialCommunityIcons
                name={ICONS.WHATSAPP}
                size={iconSizes.xs}
                color={colors.success}
              />
              <Text style={whatsappTextStyle}>{t('screens.members.availableOnWhatsApp')}</Text>
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
interface MemberListContentProps {
  loading: boolean;
  members: User[];
  searchQuery: string;
  currentUserId?: string;
  onContact: (m: User) => void;
  colors: ThemeContextType['colors'];
  spacing: ThemeContextType['spacing'];
  radii: ThemeContextType['radii'];
  iconSizes: ThemeContextType['iconSizes'];
  typography: ThemeContextType['typography'];
  t: ReturnType<typeof useTranslation>['t'];
}

function MemberListContent({
  loading,
  members,
  searchQuery,
  currentUserId,
  onContact,
  colors,
  spacing,
  radii,
  iconSizes,
  typography,
  t,
}: MemberListContentProps): React.JSX.Element {
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
          colors={colors}
          spacing={spacing}
          radii={radii}
          iconSizes={iconSizes}
          typography={typography}
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
      Alert.alert(i18next.t('common.error'), i18next.t('errors.failedToLoadMembers'));
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
    Alert.alert(i18next.t('titles.noWhatsApp'), i18next.t('info.noWhatsAppProvided'));
    return;
  }
  const cleanNumber = member.whatsappNumber.replace(PHONE.STRIP_NON_DIGITS, EMPTY_VALUE);
  const url = `${EXTERNAL_URLS.WHATSAPP_BASE}${cleanNumber}?text=${encodeURIComponent(message)}`;
  Linking.openURL(url).catch(() => {
    Alert.alert(i18next.t('common.error'), i18next.t('errors.couldNotOpenWhatsApp'));
  });
};

// No club state component
function NoClubState({
  t,
  colors,
}: {
  t: ReturnType<typeof useTranslation>['t'];
  colors: ThemeContextType['colors'];
}): React.JSX.Element {
  return (
    <View style={{ flex: FLEX.ONE, backgroundColor: colors.backgroundSecondary }}>
      <EmptyState
        icon={ICONS.ACCOUNT_ALERT}
        title={t('screens.members.notPartOfClub')}
        description={t('screens.members.contactAdminDescription')}
        iconColor={colors.warning}
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
  const { colors, spacing, radii, iconSizes, typography } = useTheme();
  const { filteredMembers, loading, refreshing, searchQuery, setSearchQuery, refresh } =
    useMembersData(user?.clubId);

  const styles = useMemo(() => createStyles(colors, spacing), [colors, spacing]);

  if (!user?.clubId) {
    return <NoClubState t={t} colors={colors} />;
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
            colors={colors}
            spacing={spacing}
            radii={radii}
            iconSizes={iconSizes}
            typography={typography}
            t={t}
          />
        </View>
      </ScrollView>
    </View>
  );
};

/**
 * Styles factory - Creates styles using theme values
 * ✅ COMPLIANT: Uses theme values via useTheme() hook
 */
const createStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing']
): ReturnType<typeof StyleSheet.create> =>
  StyleSheet.create({
    container: {
      flex: FLEX.ONE,
      backgroundColor: colors.backgroundSecondary,
    },
    searchContainer: {
      marginHorizontal: spacing.lg,
      marginTop: spacing.md,
      marginBottom: spacing.lg,
    },
    scrollView: {
      flex: FLEX.ONE,
    },
    content: {
      padding: spacing.lg,
    },
  });

export default MembersScreen;
