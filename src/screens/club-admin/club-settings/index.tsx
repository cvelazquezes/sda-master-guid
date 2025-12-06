import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '../../../shared/components';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { MatchFrequency } from '../../../types';
import { OrganizationHierarchy } from '../../../components/OrganizationHierarchy';
import { designTokens, mobileTypography, layoutConstants } from '../../../shared/theme';
import { flexValues } from '../../../shared/constants';
import { useClubSettings } from './useClubSettings';
import { BasicInfoSection } from './BasicInfoSection';
import { ActivitySettingsSection } from './ActivitySettingsSection';
import { UserPreferencesSection } from './UserPreferencesSection';

function useFrequencyLabels(
  t: ReturnType<typeof useTranslation>['t']
): Record<MatchFrequency, string> {
  return Object.values(MatchFrequency).reduce(
    (acc, freq) => ({ ...acc, [freq]: t(`club.matchFrequency.${freq}`) }),
    {} as Record<MatchFrequency, string>
  );
}

function LoadingView({
  colors,
  t,
}: {
  colors: Record<string, string>;
  t: (k: string) => string;
}): React.JSX.Element {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
        {t('screens.clubSettings.loading')}
      </Text>
    </View>
  );
}

const ClubSettingsScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { colors } = useTheme();
  const { club, formData, setFormData, handleSave } = useClubSettings(user?.clubId);
  const frequencyLabels = useFrequencyLabels(t);

  if (!club) {
    return <LoadingView colors={colors} t={t} />;
  }

  const headerStyle = [
    styles.header,
    { backgroundColor: colors.surface, borderBottomColor: colors.border },
  ];
  const hierarchyData = {
    division: club.division,
    union: club.union,
    association: club.association,
    church: club.church,
  };
  const basicLabels = {
    title: t('screens.clubSettings.basicInformation'),
    namePlaceholder: t('screens.clubSettings.clubNamePlaceholder'),
    descPlaceholder: t('screens.clubSettings.descriptionPlaceholder'),
  };
  const activityLabels = {
    title: t('screens.clubSettings.activitySettings'),
    frequency: t('screens.clubSettings.activityFrequency'),
    groupSize: t('screens.clubSettings.groupSize'),
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={headerStyle}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {t('screens.clubSettings.title')}
        </Text>
      </View>
      <View style={styles.content}>
        <View style={styles.hierarchySection}>
          <OrganizationHierarchy
            data={hierarchyData}
            title={t('screens.clubSettings.clubOrganization')}
            initialExpanded
          />
        </View>
        <BasicInfoSection
          name={formData.name}
          description={formData.description}
          onNameChange={(v): void => setFormData({ ...formData, name: v })}
          onDescriptionChange={(v): void => setFormData({ ...formData, description: v })}
          labels={basicLabels}
          colors={colors}
        />
        <ActivitySettingsSection
          matchFrequency={formData.matchFrequency}
          groupSize={formData.groupSize}
          onFrequencyChange={(v): void => setFormData({ ...formData, matchFrequency: v })}
          onGroupSizeChange={(v): void => setFormData({ ...formData, groupSize: v })}
          labels={activityLabels}
          frequencyLabels={frequencyLabels}
          colors={colors}
        />
        <UserPreferencesSection title={t('screens.clubSettings.userPreferences')} colors={colors} />
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={[styles.saveButtonText, { color: colors.textInverse }]}>
            {t('screens.clubSettings.saveChanges')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: flexValues.one },
  header: {
    padding: designTokens.spacing.lg,
    borderBottomWidth: designTokens.borderWidth.thin,
  },
  title: { ...mobileTypography.displaySmall },
  content: { padding: designTokens.spacing.md },
  hierarchySection: { marginBottom: designTokens.spacing.md },
  saveButton: {
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    alignItems: layoutConstants.alignItems.center,
    marginTop: designTokens.spacing.sm,
  },
  saveButtonText: { ...mobileTypography.buttonMedium },
  loadingText: {
    textAlign: layoutConstants.textAlign.center,
    marginTop: designTokens.spacing['3xl'],
    ...mobileTypography.bodyLarge,
  },
});

export default ClubSettingsScreen;
