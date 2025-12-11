import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ActivitySettingsSection } from './ActivitySettingsSection';
import { BasicInfoSection } from './BasicInfoSection';
import { createScreenStyles } from './styles';
import { useClubSettings } from './useClubSettings';
import { UserPreferencesSection } from './UserPreferencesSection';
import { MatchFrequency } from '../../../../types';
import { OrganizationHierarchy } from '../../../components/features/OrganizationHierarchy';
import { Text, PageHeader } from '../../../components/primitives';
import { useAuth } from '../../../state/AuthContext';
import { useTheme } from '../../../state/ThemeContext';

function useFrequencyLabels(
  t: ReturnType<typeof useTranslation>['t']
): Record<MatchFrequency, string> {
  const initialValue: Record<MatchFrequency, string> = {
    [MatchFrequency.WEEKLY]: '',
    [MatchFrequency.BIWEEKLY]: '',
    [MatchFrequency.MONTHLY]: '',
  };
  return Object.values(MatchFrequency).reduce(
    (acc, freq) => ({ ...acc, [freq]: t(`club.matchFrequency.${freq}`) }),
    initialValue
  );
}

function LoadingView({
  _colors,
  styles,
  t,
}: {
  _colors: Record<string, string>;
  styles: ReturnType<typeof createScreenStyles>;
  t: (k: string) => string;
}): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>{t('screens.clubSettings.loading')}</Text>
    </View>
  );
}

const ClubSettingsScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { colors, spacing, borderRadius, typography } = useTheme();
  const { club, formData, setFormData, handleSave } = useClubSettings(user?.clubId);
  const frequencyLabels = useFrequencyLabels(t);

  const styles = useMemo(
    () => createScreenStyles(colors, spacing, borderRadius, typography),
    [colors, spacing, borderRadius, typography]
  );

  if (!club) {
    return <LoadingView colors={colors} styles={styles} t={t} />;
  }

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
    <ScrollView style={styles.container}>
      <PageHeader
        showActions
        title={t('screens.clubSettings.title')}
        subtitle={t('screens.clubSettings.subtitle')}
      />
      <View style={styles.content}>
        <View style={styles.hierarchySection}>
          <OrganizationHierarchy
            initialExpanded
            data={hierarchyData}
            title={t('screens.clubSettings.clubOrganization')}
          />
        </View>
        <BasicInfoSection
          name={formData.name}
          description={formData.description}
          labels={basicLabels}
          colors={colors}
          onNameChange={(v): void => setFormData({ ...formData, name: v })}
          onDescriptionChange={(v): void => setFormData({ ...formData, description: v })}
        />
        <ActivitySettingsSection
          matchFrequency={formData.matchFrequency}
          groupSize={formData.groupSize}
          labels={activityLabels}
          frequencyLabels={frequencyLabels}
          colors={colors}
          onFrequencyChange={(v): void => setFormData({ ...formData, matchFrequency: v })}
          onGroupSizeChange={(v): void => setFormData({ ...formData, groupSize: v })}
        />
        <UserPreferencesSection title={t('screens.clubSettings.userPreferences')} colors={colors} />
        <TouchableOpacity
          style={styles.saveButton}
          accessibilityRole="button"
          accessibilityLabel="Save changes"
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>{t('screens.clubSettings.saveChanges')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ClubSettingsScreen;
