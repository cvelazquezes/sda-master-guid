import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clubService } from '../../services/clubService';
import { User } from '../../types';
import { 
  EmptyState, 
  Card, 
  ScreenHeader,
  StandardButton 
} from '../../shared/components';
import { designTokens } from '../../shared/theme/designTokens';
import { mobileTypography } from '../../shared/theme/mobileTypography';
import { Linking } from 'react-native';
import { MESSAGES, EXTERNAL_URLS } from '../../shared/constants';

const MembersScreen = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<User[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMembers();
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMembers(members);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = members.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query)
      );
      setFilteredMembers(filtered);
    }
  }, [searchQuery, members]);

  const loadMembers = async () => {
    if (!user?.clubId) return;

    try {
      const membersData = await clubService.getClubMembers(user.clubId);
      // Sort by name and filter only active members
      const activeMembers = membersData.filter((m) => m.isActive).sort((a, b) => 
        a.name.localeCompare(b.name)
      );
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
      const message = `Hi ${member.name}! I'm reaching out from our SDA club.`;
      const url = `${EXTERNAL_URLS.WHATSAPP_BASE}${member.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
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
          icon="account-alert"
          title="You are not part of a club"
          description="Please contact an administrator to join a club"
          iconColor={designTokens.colors.warning}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Club Members"
        subtitle={`${filteredMembers.length} member${filteredMembers.length !== 1 ? 's' : ''}`}
      />
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={24}
          color={designTokens.colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or email..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={designTokens.colors.textTertiary}
        />
        {searchQuery.length > 0 && (
          <MaterialCommunityIcons
            name="close-circle"
            size={20}
            color={designTokens.colors.textSecondary}
            style={styles.clearIcon}
            onPress={() => setSearchQuery('')}
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
              icon="loading"
              title="Loading members..."
              description="Please wait"
            />
          ) : filteredMembers.length === 0 ? (
            <EmptyState
              icon={searchQuery ? "account-search" : "account-group"}
              title={searchQuery ? "No members found" : "No members yet"}
              description={
                searchQuery
                  ? "Try a different search term"
                  : "Members will appear here once they join the club"
              }
            />
          ) : (
            filteredMembers.map((member) => (
              <Card key={member.id} variant="elevated" style={styles.memberCard}>
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
                          name="whatsapp"
                          size={14}
                          color={designTokens.colors.success}
                        />
                        <Text style={styles.whatsappText}>Available on WhatsApp</Text>
                      </View>
                    )}
                  </View>
                  {member.id !== user?.id && member.whatsappNumber && (
                    <StandardButton
                      title="Contact"
                      icon="message"
                      variant="secondary"
                      size="small"
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
    flex: 1,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1,
    paddingVertical: designTokens.spacing.md,
    ...mobileTypography.body,
    color: designTokens.colors.textPrimary,
  },
  clearIcon: {
    marginLeft: designTokens.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: designTokens.spacing.lg,
  },
  memberCard: {
    marginBottom: designTokens.spacing.md,
  },
  memberContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.md,
  },
  memberAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: designTokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    ...mobileTypography.heading2,
    color: designTokens.colors.textInverse,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...mobileTypography.bodyLargeBold,
    color: designTokens.colors.textPrimary,
    marginBottom: 2,
  },
  memberEmail: {
    ...mobileTypography.caption,
    color: designTokens.colors.textSecondary,
    marginBottom: 4,
  },
  whatsappBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  whatsappText: {
    ...mobileTypography.caption,
    color: designTokens.colors.success,
  },
});

export default MembersScreen;

