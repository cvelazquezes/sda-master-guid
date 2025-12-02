import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Club } from '../types';
import { OrganizationHierarchy } from './OrganizationHierarchy';
import { StandardModal } from '../shared/components/StandardModal';
import { mobileTypography, mobileIconSizes } from '../shared/theme';
import { designTokens } from '../shared/theme/designTokens';

interface ClubDetailModalProps {
  visible: boolean;
  club: Club | null;
  onClose: () => void;
}

export const ClubDetailModal: React.FC<ClubDetailModalProps> = ({ visible, club, onClose }) => {
  if (!club) return null;

  return (
    <StandardModal
      visible={visible}
      onClose={onClose}
      title={club.name}
      subtitle="Club Details"
      icon="account-group"
      iconColor={designTokens.colors.primary}
      iconBackgroundColor={designTokens.colors.primaryLight}
    >
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="label" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{club.name}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="text" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Description</Text>
              <Text style={styles.infoValue}>{club.description}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name={club.isActive ? 'check-circle' : 'cancel'}
              size={mobileIconSizes.medium}
              color={club.isActive ? designTokens.colors.success : designTokens.colors.error}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.infoValue}>{club.isActive ? 'Active' : 'Inactive'}</Text>
            </View>
          </View>
        </View>

        {/* Activity Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Settings</Text>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar-clock" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Activity Frequency</Text>
              <Text style={styles.infoValue}>{club.matchFrequency.replace('_', '-')}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account-multiple" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Group Size</Text>
              <Text style={styles.infoValue}>{club.groupSize} people per activity</Text>
            </View>
          </View>

          {club.memberCount !== undefined && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="account-group" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Members</Text>
                <Text style={styles.infoValue}>{club.memberCount} members</Text>
              </View>
            </View>
          )}
        </View>

        {/* Organizational Hierarchy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Organizational Hierarchy</Text>
          <OrganizationHierarchy
            data={{
              division: club.division,
              union: club.union,
              association: club.association,
              church: club.church,
            }}
            title="Club Organization"
            initialExpanded={true}
          />
        </View>
    </StandardModal>
  );
};

const styles = StyleSheet.create({
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
});
