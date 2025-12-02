import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { User, Club } from '../types';
import { OrganizationHierarchy } from './OrganizationHierarchy';
import { clubService } from '../services/clubService';
import { StandardModal } from '../shared/components/StandardModal';
import { mobileTypography, mobileIconSizes, mobileFontSizes } from '../shared/theme';
import { designTokens } from '../shared/theme/designTokens';

interface UserDetailModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ visible, user, onClose }) => {
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && user?.clubId) {
      loadClub();
    }
  }, [visible, user]);

  const loadClub = async () => {
    if (!user?.clubId) return;
    setLoading(true);
    try {
      const clubData = await clubService.getClub(user.clubId);
      setClub(clubData);
    } catch (error) {
      console.error('Failed to load club:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return designTokens.colors.error;
      case 'club_admin':
        return designTokens.colors.warning;
      default:
        return designTokens.colors.info;
    }
  };

  const avatarIcon = (
    <View style={[styles.avatarIcon, { backgroundColor: getRoleColor(user.role) }]}>
      <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
    </View>
  );

  return (
    <StandardModal
      visible={visible}
      onClose={onClose}
      title={user.name}
      subtitle="User Details"
    >
        {/* Personal Information */}
        <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="account" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>{user.name}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="email" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{user.email}</Text>
                </View>
              </View>

              {user.whatsappNumber && (
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="whatsapp" size={mobileIconSizes.medium} color={designTokens.colors.success} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>WhatsApp</Text>
                    <Text style={styles.infoValue}>{user.whatsappNumber}</Text>
                  </View>
                </View>
              )}

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="shield-account" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Role</Text>
                  <Text style={styles.infoValue}>{user.role.replace('_', ' ').toUpperCase()}</Text>
                </View>
              </View>
            </View>

            {/* Pathfinder Classes */}
            {user.role !== 'admin' && user.classes && user.classes.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pathfinder Classes</Text>
                <View style={styles.classesContainer}>
                  {user.classes.map((pathfinderClass, index) => (
                    <View key={index} style={styles.classBadge}>
                      <MaterialCommunityIcons name="school" size={mobileIconSizes.small} color={designTokens.colors.primary} />
                      <Text style={styles.classBadgeText}>{pathfinderClass}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Status</Text>

              <View style={styles.statusRow}>
                <MaterialCommunityIcons
                  name={user.isActive ? 'check-circle' : 'cancel'}
                  size={mobileIconSizes.medium}
                  color={user.isActive ? designTokens.colors.success : designTokens.colors.error}
                />
                <Text style={styles.statusText}>{user.isActive ? 'Active' : 'Inactive'}</Text>
              </View>
            </View>

            {/* Organizational Hierarchy */}
            {user.role !== 'admin' && club && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Organization & Club</Text>
                <OrganizationHierarchy
                  data={{
                    division: club.division,
                    union: club.union,
                    association: club.association,
                    church: club.church,
                    clubName: club.name,
                  }}
                  title="Organizational Hierarchy"
                  initialExpanded={true}
                />
              </View>
            )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={designTokens.colors.primary} />
            <Text style={styles.loadingText}>Loading club information...</Text>
          </View>
        )}
    </StandardModal>
  );
};

const styles = StyleSheet.create({
  avatarIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: mobileFontSizes['2xl'],
    fontWeight: 'bold',
    color: designTokens.colors.textInverse,
  },
  section: {
    padding: designTokens.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.borderLight,
  },
  sectionTitle: {
    ...mobileTypography.heading4,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  infoContent: {
    marginLeft: 14,
    flex: 1,
  },
  infoLabel: {
    ...mobileTypography.label,
    color: designTokens.colors.textSecondary,
    marginBottom: 6,
  },
  infoValue: {
    ...mobileTypography.bodyLargeBold,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    ...mobileTypography.bodyLargeBold,
    marginLeft: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: designTokens.spacing.xl,
  },
  loadingText: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    marginLeft: 12,
  },
  classesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  classBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.primaryLight,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: designTokens.borderRadius.xxl,
    gap: 8,
  },
  classBadgeText: {
    ...mobileTypography.labelBold,
    color: designTokens.colors.primary,
  },
});
