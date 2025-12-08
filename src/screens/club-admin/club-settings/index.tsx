import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '../../../shared/components';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { MatchFrequency } from '../../../types';
import { OrganizationHierarchy } from '../../../components/OrganizationHierarchy';
import { FLEX } from '../../../shared/constants';
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
  const { colors, spacing, borderRadius, borderWidth, typography } = useTheme();
  const { club, formData, setFormData, handleSave } = useClubSettings(user?.clubId);
  const frequencyLabels = useFrequencyLabels(t);

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: FLEX.ONE, backgroundColor: colors.background },
        header: {
          padding: spacing.lg,
          borderBottomWidth: borderWidth.thin,
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
        title: {
          fontSize: typography.fontSizes['3xl'],
          fontWeight: typography.fontWeights.bold,
          color: colors.textPrimary,
        },
        content: { padding: spacing.md },
        hierarchySection: { marginBottom: spacing.md },
        saveButton: {
          padding: spacing.md,
          borderRadius: borderRadius.md,
          alignItems: 'center',
          marginTop: spacing.sm,
          backgroundColor: colors.primary,
        },
        saveButtonText: {
          fontSize: typography.fontSizes.md,
          fontWeight: typography.fontWeights.semibold,
          color: colors.textInverse,
        },
        loadingText: {
          textAlign: 'center',
          marginTop: spacing['3xl'],
          fontSize: typography.fontSizes.lg,
          color: colors.textSecondary,
        },
      }),
    [colors, spacing, borderRadius, borderWidth, typography]
  );

  if (!club) {
    return <LoadingView colors={colors} t={t} />;
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
    <ScrollView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.title}>{t('screens.clubSettings.title')}</Text>
      </View>
      <View style={dynamicStyles.content}>
        <View style={dynamicStyles.hierarchySection}>
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
        <TouchableOpacity style={dynamicStyles.saveButton} onPress={handleSave}>
          <Text style={dynamicStyles.saveButtonText}>{t('screens.clubSettings.saveChanges')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ClubSettingsScreen;
