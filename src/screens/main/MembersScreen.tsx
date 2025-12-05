import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clubService } from '../../services/clubService';
import { User } from '../../types';
import { EmptyState, Card, ScreenHeader, StandardButton } from '../../shared/components';
import { mobileTypography, designTokens, layoutConstants } from '../../shared/theme';
import { Linking } from 'react-native';
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

const MembersScreen = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [members, setMembers] = useState<User[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(EMPTY_VALUE);

  useEffect(() => {
    loadMembers();
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === EMPTY_VALUE) {
      setFilteredMembers(members);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = members.filter(
        (member) =>
          member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query)
      );
      setFilteredMembers(filtered);
    }
  }, [searchQuery, members]);

  const loadMembers = async () => {
    if (!user?.clubId) return;

    try {
      const membersData = await clubService.getClubMembers(user.clubId);
      // Sort by name and filter only active members
      const activeMembers = membersData
        .filter((m) => m.isActive)
        .sort((a, b) => a.name.localeCompare(b.name));
      setMembers(activeMembers);
      setFilteredMembers(activeMembers);
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_MEMBERS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMembers();
  };

  const handleContactMember = (member: User) => {
    if (member.whatsappNumber) {
      const message = t('screens.members.whatsappMessage', { name: member.name });
      const url = `${EXTERNAL_URLS.WHATSAPP_BASE}${member.whatsappNumber.replace(VALIDATION.WHATSAPP.STRIP_NON_DIGITS, EMPTY_VALUE)}?text=${encodeURIComponent(message)}`;
      Linking.openURL(url).catch(() => {
        Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.COULD_NOT_OPEN_WHATSAPP);
      });
    } else {
      Alert.alert(MESSAGES.TITLES.NO_WHATSAPP, MESSAGES.INFO.NO_WHATSAPP_PROVIDED);
    }
  };

  if (!user?.clubId) {
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

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={t('screens.members.title')}
        subtitle={`${filteredMembers.length} ${filteredMembers.length !== 1 ? t('screens.members.subtitle_plural', { count: filteredMembers.length }) : t('screens.members.subtitle', { count: filteredMembers.length })}`}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name={ICONS.MAGNIFY}
          size={designTokens.iconSize.lg}
          color={designTokens.colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={t('placeholders.searchByNameOrEmail')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={designTokens.colors.textTertiary}
        />
        {searchQuery.length > 0 && (
          <MaterialCommunityIcons
            name={ICONS.CLOSE_CIRCLE}
            size={designTokens.iconSize.md}
            color={designTokens.colors.textSecondary}
            style={styles.clearIcon}
            onPress={() => setSearchQuery(EMPTY_VALUE)}
          />
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.content}>
          {loading ? (
            <EmptyState
              icon={ICONS.LOADING}
              title={t('screens.members.loadingMembers')}
              description={t('common.pleaseWait')}
            />
          ) : filteredMembers.length === 0 ? (
            <EmptyState
              icon={searchQuery ? ICONS.ACCOUNT_SEARCH : ICONS.ACCOUNT_GROUP}
              title={
                searchQuery
                  ? t('screens.members.noMembersFound')
                  : t('screens.members.noMembersYet')
              }
              description={
                searchQuery
                  ? t('screens.members.noMembersMatchSearch')
                  : t('screens.members.joinClubToSeeMembers')
              }
            />
          ) : (
            filteredMembers.map((member) => (
              <Card key={member.id} variant={COMPONENT_VARIANT.elevated} style={styles.memberCard}>
                <View style={styles.memberContent}>
                  <View style={styles.memberAvatar}>
                    <Text style={styles.memberAvatarText}>
                      {member.name.charAt(0).toUpperCase()}
                    </Text>
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
                        <Text style={styles.whatsappText}>
                          {t('screens.members.availableOnWhatsApp')}
                        </Text>
                      </View>
                    )}
                  </View>
                  {member.id !== user?.id && member.whatsappNumber && (
                    <StandardButton
                      title={t('screens.members.contact')}
                      icon={ICONS.MESSAGE}
                      variant={COMPONENT_VARIANT.secondary}
                      size={BUTTON_SIZE.small}
                      onPress={() => handleContactMember(member)}
                    />
                  )}
                </View>
              </Card>
            ))
          )}
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
  searchContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.backgroundPrimary,
    marginHorizontal: designTokens.spacing.lg,
    marginTop: designTokens.spacing.md,
    marginBottom: designTokens.spacing.lg,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    borderWidth: designTokens.borderWidth.thin,
    borderColor: designTokens.colors.borderLight,
  },
  searchIcon: {
    marginRight: designTokens.spacing.sm,
  },
  searchInput: {
    flex: flexValues.one,
    paddingVertical: designTokens.spacing.md,
    ...mobileTypography.body,
    color: designTokens.colors.textPrimary,
  },
  clearIcon: {
    marginLeft: designTokens.spacing.sm,
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
