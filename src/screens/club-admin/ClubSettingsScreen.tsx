import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { clubService } from '../../services/clubService';
import { useAuth } from '../../context/AuthContext';
import { Club, MatchFrequency } from '../../types';
import { OrganizationHierarchy } from '../../components/OrganizationHierarchy';
import { designTokens } from '../../shared/theme/designTokens';
import { mobileTypography } from '../../shared/theme/mobileTypography';
import { layoutConstants } from '../../shared/theme';
import { MESSAGES, CLUB_SETTINGS, EMPTY_VALUE } from '../../shared/constants';
import { flexValues, dimensionValues } from '../../shared/constants/layoutConstants';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { useTheme } from '../../contexts/ThemeContext';

const ClubSettingsScreen = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: EMPTY_VALUE,
    description: EMPTY_VALUE,
    matchFrequency: MatchFrequency.WEEKLY,
    groupSize: CLUB_SETTINGS.defaultGroupSize,
  });

  useEffect(() => {
    if (user?.clubId) {
      loadClub();
    }
  }, [user]);

  const loadClub = async () => {
    if (!user?.clubId) return;

    try {
      const clubData = await clubService.getClub(user.clubId);
      setClub(clubData);
      setFormData({
        name: clubData.name,
        description: clubData.description,
        matchFrequency: clubData.matchFrequency,
        groupSize: clubData.groupSize,
      });
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_CLUB_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.clubId || !formData.name || !formData.description) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.MISSING_FIELDS);
      return;
    }

    try {
      await clubService.updateClub(user.clubId, formData);
      loadClub();
      Alert.alert(MESSAGES.TITLES.SUCCESS, MESSAGES.SUCCESS.CLUB_UPDATED);
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_UPDATE_CLUB_SETTINGS);
    }
  };

  if (!club) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>{t('screens.clubSettings.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{t('screens.clubSettings.title')}</Text>
      </View>

      <View style={styles.content}>
        {/* Show club's organizational hierarchy */}
        {club && (
          <View style={styles.hierarchySection}>
            <OrganizationHierarchy
              data={{
                division: club.division,
                union: club.union,
                association: club.association,
                church: club.church,
              }}
              title={t('screens.clubSettings.clubOrganization')}
              initialExpanded={true}
            />
          </View>
        )}

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('screens.clubSettings.basicInformation')}</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.inputBackground }]}
            placeholder={t('screens.clubSettings.clubNamePlaceholder')}
            placeholderTextColor={colors.textTertiary}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          <TextInput
            style={[styles.input, styles.textArea, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.inputBackground }]}
            placeholder={t('screens.clubSettings.descriptionPlaceholder')}
            placeholderTextColor={colors.textTertiary}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('screens.clubSettings.activitySettings')}</Text>
          <View style={styles.selectContainer}>
            <Text style={[styles.selectLabel, { color: colors.textPrimary }]}>{t('screens.clubSettings.activityFrequency')}</Text>
            <View style={styles.selectOptions}>
              {Object.values(MatchFrequency).map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.selectOption,
                    { borderColor: colors.border, backgroundColor: colors.inputBackground },
                    formData.matchFrequency === freq && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                  onPress={() => setFormData({ ...formData, matchFrequency: freq })}
                >
                  <Text
                    style={[
                      styles.selectOptionText,
                      { color: colors.textSecondary },
                      formData.matchFrequency === freq && { color: colors.textInverse, fontWeight: designTokens.fontWeight.semibold },
                    ]}
                  >
                    {t(`club.matchFrequency.${freq}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.selectContainer}>
            <Text style={[styles.selectLabel, { color: colors.textPrimary }]}>{t('screens.clubSettings.groupSize')}</Text>
            <View style={styles.selectOptions}>
              {[2, 3].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.selectOption,
                    { borderColor: colors.border, backgroundColor: colors.inputBackground },
                    formData.groupSize === size && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                  onPress={() => setFormData({ ...formData, groupSize: size })}
                >
                  <Text
                    style={[
                      styles.selectOptionText,
                      { color: colors.textSecondary },
                      formData.groupSize === size && { color: colors.textInverse, fontWeight: designTokens.fontWeight.semibold },
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('screens.clubSettings.userPreferences')}</Text>
          
          {/* Theme Switcher */}
          <View style={styles.preferenceItem}>
            <ThemeSwitcher showLabel={true} />
          </View>

          {/* Language Switcher */}
          <View style={styles.preferenceItem}>
            <LanguageSwitcher showLabel={true} />
          </View>
        </View>

        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSave}>
          <Text style={[styles.saveButtonText, { color: colors.textInverse }]}>{t('screens.clubSettings.saveChanges')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: flexValues.one,
  },
  header: {
    padding: designTokens.spacing.lg,
    borderBottomWidth: designTokens.borderWidth.thin,
  },
  title: {
    ...mobileTypography.displaySmall,
  },
  content: {
    padding: designTokens.spacing.md,
  },
  section: {
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.md,
    marginBottom: designTokens.spacing.md,
  },
  sectionTitle: {
    ...mobileTypography.heading3,
    marginBottom: designTokens.spacing.md,
  },
  preferenceItem: {
    marginBottom: designTokens.spacing.sm,
  },
  input: {
    borderWidth: designTokens.borderWidth.thin,
    borderRadius: designTokens.borderRadius.md,
    padding: designTokens.spacing.md,
    marginBottom: designTokens.spacing.md,
    ...mobileTypography.bodyLarge,
  },
  textArea: {
    minHeight: dimensionValues.minHeight.textarea,
    textAlignVertical: layoutConstants.textAlignVertical.top,
  },
  selectContainer: {
    marginBottom: designTokens.spacing.lg,
  },
  selectLabel: {
    ...mobileTypography.bodyLargeBold,
    marginBottom: designTokens.spacing.md,
  },
  selectOptions: {
    flexDirection: layoutConstants.flexDirection.row,
    gap: designTokens.spacing.md,
  },
  selectOption: {
    flex: flexValues.one,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    borderWidth: designTokens.borderWidth.thin,
    alignItems: layoutConstants.alignItems.center,
  },
  selectOptionText: {
    ...mobileTypography.body,
  },
  saveButton: {
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    alignItems: layoutConstants.alignItems.center,
    marginTop: designTokens.spacing.sm,
  },
  saveButtonText: {
    ...mobileTypography.buttonMedium,
  },
  loadingText: {
    textAlign: layoutConstants.textAlign.center,
    marginTop: designTokens.spacing['3xl'],
    ...mobileTypography.bodyLarge,
  },
  hierarchySection: {
    marginBottom: designTokens.spacing.md,
  },
});

export default ClubSettingsScreen;

