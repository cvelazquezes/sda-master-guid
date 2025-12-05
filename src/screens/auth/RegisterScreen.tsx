import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clubService } from '../../services/clubService';
import { Club, PathfinderClass, PATHFINDER_CLASSES } from '../../types';
import { ClassSelectionModal } from '../../components/ClassSelectionModal';
import { StandardInput, StandardButton } from '../../shared/components';
import { mobileTypography, mobileIconSizes, designTokens, layoutConstants } from '../../shared/theme';
import { MESSAGES, VALIDATION, LIMITS, ICONS, ACTIVITY_INDICATOR_SIZE, SCREENS, KEYBOARD_TYPE, EMPTY_VALUE, SAFE_AREA_EDGES, PLATFORM_OS, KEYBOARD_BEHAVIOR, AUTO_CAPITALIZE, AUTO_COMPLETE, COMPONENT_VARIANT, LIST_SEPARATOR } from '../../shared/constants';
import { flexValues, dimensionValues } from '../../shared/constants/layoutConstants';

const RegisterScreen = () => {
  const { t } = useTranslation();
  const [name, setName] = useState(EMPTY_VALUE);
  const [email, setEmail] = useState(EMPTY_VALUE);
  const [whatsappNumber, setWhatsappNumber] = useState(EMPTY_VALUE);
  const [password, setPassword] = useState(EMPTY_VALUE);
  const [confirmPassword, setConfirmPassword] = useState(EMPTY_VALUE);
  // Club selection via organizational hierarchy
  const [division, setDivision] = useState(EMPTY_VALUE);
  const [union, setUnion] = useState(EMPTY_VALUE);
  const [association, setAssociation] = useState(EMPTY_VALUE);
  const [church, setChurch] = useState(EMPTY_VALUE);
  const [clubId, setClubId] = useState(EMPTY_VALUE);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingClubs, setLoadingClubs] = useState(true);
  // Role selection
  const [isClubAdmin, setIsClubAdmin] = useState(false);
  // Class selection
  const [selectedClasses, setSelectedClasses] = useState<PathfinderClass[]>([PATHFINDER_CLASSES[0]]);
  const [classModalVisible, setClassModalVisible] = useState(false);
  const { register } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    loadClubs();
  }, []);

  // Auto-select when only one option is available
  useEffect(() => {
    if (clubs.length > 0 && !division) {
      const divisions = getUniqueDivisions();
      if (divisions.length === 1) {
        setDivision(divisions[0]);
      }
    }
  }, [clubs, division]);

  useEffect(() => {
    if (division && !union) {
      const unions = getUniqueUnions();
      if (unions.length === 1) {
        setUnion(unions[0]);
      }
    }
  }, [division, union]);

  useEffect(() => {
    if (union && !association) {
      const associations = getUniqueAssociations();
      if (associations.length === 1) {
        setAssociation(associations[0]);
      }
    }
  }, [union, association]);

  useEffect(() => {
    if (association && !church) {
      const churches = getUniqueChurches();
      if (churches.length === 1) {
        setChurch(churches[0]);
      }
    }
  }, [association, church]);

  useEffect(() => {
    if (church && !clubId) {
      const filteredClubs = getFilteredClubs();
      if (filteredClubs.length === 1) {
        setClubId(filteredClubs[0].id);
      }
    }
  }, [church, clubId]);

  const loadClubs = async () => {
    try {
      const clubsList = await clubService.getAllClubs();
      setClubs(clubsList.filter((club) => club.isActive));
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_CLUBS);
    } finally {
      setLoadingClubs(false);
    }
  };

  // Get unique values for hierarchical club selection
  const getUniqueDivisions = () => {
    const values = clubs.map((club) => club.division).filter(Boolean);
    return Array.from(new Set(values)).sort();
  };

  const getUniqueUnions = () => {
    if (!division) return [];
    const filteredClubs = clubs.filter((club) => club.division === division && club.isActive);
    const values = filteredClubs.map((club) => club.union).filter(Boolean);
    return Array.from(new Set(values)).sort();
  };

  const getUniqueAssociations = () => {
    if (!union) return [];
    const filteredClubs = clubs.filter(
      (club) => club.division === division && club.union === union && club.isActive
    );
    const values = filteredClubs.map((club) => club.association).filter(Boolean);
    return Array.from(new Set(values)).sort();
  };

  const getUniqueChurches = () => {
    if (!association) return [];
    const filteredClubs = clubs.filter(
      (club) =>
        club.division === division &&
        club.union === union &&
        club.association === association &&
        club.isActive
    );
    const values = filteredClubs.map((club) => club.church).filter(Boolean);
    return Array.from(new Set(values)).sort();
  };

  const getFilteredClubs = () => {
    if (!church) return [];
    return clubs.filter(
      (club) =>
        club.division === division &&
        club.union === union &&
        club.association === association &&
        club.church === church &&
        club.isActive
    );
  };

  // Handle hierarchy changes
  const handleDivisionChange = (newDivision: string) => {
    setDivision(newDivision);
    setUnion(EMPTY_VALUE);
    setAssociation(EMPTY_VALUE);
    setChurch(EMPTY_VALUE);
    setClubId(EMPTY_VALUE);
  };

  const handleUnionChange = (newUnion: string) => {
    setUnion(newUnion);
    setAssociation(EMPTY_VALUE);
    setChurch(EMPTY_VALUE);
    setClubId(EMPTY_VALUE);
  };

  const handleAssociationChange = (newAssociation: string) => {
    setAssociation(newAssociation);
    setChurch(EMPTY_VALUE);
    setClubId(EMPTY_VALUE);
  };

  const handleChurchChange = (newChurch: string) => {
    setChurch(newChurch);
    setClubId(EMPTY_VALUE);
  };

  // Auto-select when only one option is available
  useEffect(() => {
    if (clubs.length > 0 && !division) {
      const divisions = getUniqueDivisions();
      if (divisions.length === 1) {
        setDivision(divisions[0]);
      }
    }
  }, [clubs, division]);

  useEffect(() => {
    if (division && !union) {
      const unions = getUniqueUnions();
      if (unions.length === 1) {
        setUnion(unions[0]);
      }
    }
  }, [division, union]);

  useEffect(() => {
    if (union && !association) {
      const associations = getUniqueAssociations();
      if (associations.length === 1) {
        setAssociation(associations[0]);
      }
    }
  }, [union, association]);

  useEffect(() => {
    if (association && !church) {
      const churches = getUniqueChurches();
      if (churches.length === 1) {
        setChurch(churches[0]);
      }
    }
  }, [association, church]);

  useEffect(() => {
    if (church && !clubId) {
      const filteredClubs = getFilteredClubs();
      if (filteredClubs.length === 1) {
        setClubId(filteredClubs[0].id);
      }
    }
  }, [church, clubId]);

  const handleRegister = async () => {
    if (!name || !email || !whatsappNumber || !password || !clubId) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.MISSING_CLUB_SELECTION);
      return;
    }

    // Only validate classes for regular users, not club admins
    if (!isClubAdmin && selectedClasses.length === LIMITS.MIN_ARRAY_LENGTH) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.MISSING_CLASS_SELECTION);
      return;
    }

    // Validate WhatsApp number format (basic validation)
    if (!VALIDATION.WHATSAPP.REGEX.test(whatsappNumber.replace(VALIDATION.WHATSAPP.NORMALIZE_PATTERN, EMPTY_VALUE))) {
      Alert.alert(
        MESSAGES.TITLES.ERROR,
        MESSAGES.ERRORS.INVALID_WHATSAPP
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.PASSWORD_MISMATCH);
      return;
    }

    if (password.length < VALIDATION.PASSWORD.MIN_LENGTH) {
      Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.PASSWORD_TOO_SHORT);
      return;
    }

    setLoading(true);
    try {
      // Pass classes and club admin flag
      await register(
        email,
        password,
        name,
        whatsappNumber,
        clubId,
        isClubAdmin ? [] : selectedClasses,
        isClubAdmin
      );
      // Registration successful - user will be redirected to PendingApprovalScreen automatically
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.REGISTRATION_FAILED, MESSAGES.ERRORS.REGISTRATION_FAILED);
    } finally {
      setLoading(false);
    }
  };

  if (loadingClubs) {
    return (
      <SafeAreaView style={styles.safeArea} edges={SAFE_AREA_EDGES.TOP_LEFT_RIGHT}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={ACTIVITY_INDICATOR_SIZE.large} color={designTokens.colors.primary} />
          <Text style={styles.loadingText}>{MESSAGES.INFO.LOADING_CLUBS}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={SAFE_AREA_EDGES.TOP_LEFT_RIGHT}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === PLATFORM_OS.IOS ? KEYBOARD_BEHAVIOR.PADDING : KEYBOARD_BEHAVIOR.HEIGHT}
      >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <MaterialCommunityIcons name={ICONS.ACCOUNT_PLUS} size={designTokens.iconSize['3xl']} color={designTokens.colors.primary} />
          <Text style={styles.title}>{t('screens.register.title')}</Text>
          <Text style={styles.subtitle}>{t('screens.register.subtitle')}</Text>
        </View>

        <View style={styles.form}>
          <StandardInput
            label={t('screens.register.fullName')}
            icon={ICONS.ACCOUNT}
            placeholder={MESSAGES.PLACEHOLDERS.FULL_NAME}
            value={name}
            onChangeText={setName}
            autoCapitalize={AUTO_CAPITALIZE.WORDS}
            required
          />

          <StandardInput
            label={t('screens.register.email')}
            icon={ICONS.EMAIL}
            placeholder={MESSAGES.PLACEHOLDERS.EMAIL}
            value={email}
            onChangeText={setEmail}
            keyboardType={KEYBOARD_TYPE.EMAIL}
            autoCapitalize={AUTO_CAPITALIZE.NONE}
            autoComplete={AUTO_COMPLETE.EMAIL}
            required
          />

          <StandardInput
            label={t('screens.register.whatsAppNumber')}
            icon={ICONS.WHATSAPP}
            placeholder={MESSAGES.PLACEHOLDERS.WHATSAPP}
            value={whatsappNumber}
            onChangeText={setWhatsappNumber}
            keyboardType={KEYBOARD_TYPE.PHONE}
            autoCapitalize={AUTO_CAPITALIZE.NONE}
            required
          />

          {/* Role Selection */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name={ICONS.ACCOUNT_COG} size={mobileIconSizes.medium} color={designTokens.colors.primary} />
            <Text style={styles.sectionTitle}>{t('screens.register.accountType')}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsClubAdmin(!isClubAdmin)}
          >
            <MaterialCommunityIcons
              name={isClubAdmin ? ICONS.CHECKBOX_MARKED : ICONS.CHECKBOX_BLANK_OUTLINE}
              size={mobileIconSizes.large}
              color={designTokens.colors.primary}
            />
            <Text style={styles.checkboxLabel}>{t('screens.register.iAmClubAdmin')}</Text>
          </TouchableOpacity>
          {isClubAdmin && (
            <View style={styles.infoBox}>
              <MaterialCommunityIcons name={ICONS.INFORMATION} size={mobileIconSizes.medium} color={designTokens.colors.info} />
              <Text style={styles.infoText}>
                {t('screens.register.clubAdminApprovalNote')}
              </Text>
            </View>
          )}

          {/* Club Selection via Organizational Hierarchy */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name={ICONS.SITEMAP} size={mobileIconSizes.medium} color={designTokens.colors.primary} />
            <Text style={styles.sectionTitle}>{t('screens.register.findYourClub')}</Text>
          </View>
          <Text style={styles.sectionDescription}>
            {t('screens.register.navigateOrganization')}
          </Text>

          {/* Division Selection */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>{t('screens.register.selectDivision')}</Text>
            <ScrollView style={styles.optionsList}>
              {getUniqueDivisions().map((div) => (
                <TouchableOpacity
                  key={div}
                  style={[styles.option, division === div && styles.optionSelected]}
                  onPress={() => handleDivisionChange(div)}
                >
                  <MaterialCommunityIcons
                    name={division === div ? ICONS.RADIOBOX_MARKED : ICONS.RADIOBOX_BLANK}
                    size={mobileIconSizes.medium}
                    color={division === div ? designTokens.colors.primary : designTokens.colors.textSecondary}
                  />
                  <Text style={styles.optionText}>{div}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Union Selection */}
          {division && (
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>{t('screens.register.selectUnion')}</Text>
              <ScrollView style={styles.optionsList}>
                {getUniqueUnions().map((uni) => (
                  <TouchableOpacity
                    key={uni}
                    style={[styles.option, union === uni && styles.optionSelected]}
                    onPress={() => handleUnionChange(uni)}
                  >
                    <MaterialCommunityIcons
                      name={union === uni ? ICONS.RADIOBOX_MARKED : ICONS.RADIOBOX_BLANK}
                      size={mobileIconSizes.medium}
                      color={union === uni ? designTokens.colors.primary : designTokens.colors.textSecondary}
                    />
                    <Text style={styles.optionText}>{uni}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Association Selection */}
          {union && (
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>{t('screens.register.selectAssociation')}</Text>
              <ScrollView style={styles.optionsList}>
                {getUniqueAssociations().map((assoc) => (
                  <TouchableOpacity
                    key={assoc}
                    style={[styles.option, association === assoc && styles.optionSelected]}
                    onPress={() => handleAssociationChange(assoc)}
                  >
                    <MaterialCommunityIcons
                      name={association === assoc ? ICONS.RADIOBOX_MARKED : ICONS.RADIOBOX_BLANK}
                      size={mobileIconSizes.medium}
                      color={association === assoc ? designTokens.colors.primary : designTokens.colors.textSecondary}
                    />
                    <Text style={styles.optionText}>{assoc}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Church Selection */}
          {association && (
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>{t('screens.register.selectChurch')}</Text>
              <ScrollView style={styles.optionsList}>
                {getUniqueChurches().map((ch) => (
                  <TouchableOpacity
                    key={ch}
                    style={[styles.option, church === ch && styles.optionSelected]}
                    onPress={() => handleChurchChange(ch)}
                  >
                    <MaterialCommunityIcons
                      name={church === ch ? ICONS.RADIOBOX_MARKED : ICONS.RADIOBOX_BLANK}
                      size={mobileIconSizes.medium}
                      color={church === ch ? designTokens.colors.primary : designTokens.colors.textSecondary}
                    />
                    <Text style={styles.optionText}>{ch}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Club Selection */}
          {church && getFilteredClubs().length > 0 && (
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>{t('screens.register.selectClub')}</Text>
              <ScrollView style={styles.clubsList}>
                {getFilteredClubs().map((club) => (
                  <TouchableOpacity
                    key={club.id}
                    style={[styles.clubOption, clubId === club.id && styles.clubOptionSelected]}
                    onPress={() => setClubId(club.id)}
                  >
                    <MaterialCommunityIcons
                      name={clubId === club.id ? ICONS.RADIOBOX_MARKED : ICONS.RADIOBOX_BLANK}
                      size={mobileIconSizes.medium}
                      color={clubId === club.id ? designTokens.colors.primary : designTokens.colors.textSecondary}
                    />
                    <View style={styles.clubInfo}>
                      <Text style={styles.clubName}>{club.name}</Text>
                      <Text style={styles.clubDescription}>{club.description}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Pathfinder Classes Selection - Only for regular users */}
          {!isClubAdmin && (
            <>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name={ICONS.SCHOOL} size={mobileIconSizes.medium} color={designTokens.colors.primary} />
                <Text style={styles.sectionTitle}>{t('screens.register.pathfinderClasses')}</Text>
              </View>
              <Text style={styles.sectionDescription}>
                {t('screens.register.selectClassesInstruction')}
              </Text>

              <TouchableOpacity
                style={styles.classSelectionButton}
                onPress={() => setClassModalVisible(true)}
              >
                <View style={styles.classSelectionContent}>
                  <MaterialCommunityIcons name={ICONS.SCHOOL} size={mobileIconSizes.medium} color={designTokens.colors.primary} />
                  <Text style={styles.classSelectionText}>
                    {selectedClasses.length > 0
                      ? t('screens.register.selectedClasses', { classes: selectedClasses.join(LIST_SEPARATOR) })
                      : t('screens.register.selectClasses')}
                  </Text>
                </View>
                <MaterialCommunityIcons name={ICONS.CHEVRON_RIGHT} size={mobileIconSizes.large} color={designTokens.colors.primary} />
              </TouchableOpacity>
            </>
          )}

          <StandardInput
            label={t('screens.register.password')}
            icon={ICONS.LOCK}
            placeholder={MESSAGES.PLACEHOLDERS.PASSWORD}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize={AUTO_CAPITALIZE.NONE}
            required
          />

          <StandardInput
            label={t('screens.register.confirmPassword')}
            icon={ICONS.LOCK_CHECK}
            placeholder={MESSAGES.PLACEHOLDERS.CONFIRM_PASSWORD}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize={AUTO_CAPITALIZE.NONE}
            required
          />

          <StandardButton
            title={loading ? t('screens.register.creatingAccount') : t('screens.register.registerButton')}
            onPress={handleRegister}
            disabled={loading}
            loading={loading}
            icon={ICONS.ACCOUNT_PLUS}
          />

          <StandardButton
            title={t('screens.register.alreadyHaveAccount')}
            variant={COMPONENT_VARIANT.ghost}
            onPress={() => navigation.navigate(SCREENS.LOGIN as never)}
          />
        </View>
      </ScrollView>

      {/* Class Selection Modal */}
      <ClassSelectionModal
        visible={classModalVisible}
        initialClasses={selectedClasses}
        onSave={(classes) => setSelectedClasses(classes)}
        onClose={() => setClassModalVisible(false)}
      />
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: flexValues.one,
    backgroundColor: designTokens.colors.backgroundPrimary,
  },
  container: {
    flex: flexValues.one,
    backgroundColor: designTokens.colors.backgroundPrimary,
  },
  scrollContent: {
    flexGrow: flexValues.one,
    padding: designTokens.spacing.lg,
    paddingTop: designTokens.spacing['3xl'],
  },
  loadingContainer: {
    flex: flexValues.one,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
    backgroundColor: designTokens.colors.backgroundPrimary,
  },
  loadingText: {
    ...mobileTypography.bodyMedium,
    marginTop: designTokens.spacing.md,
  },
  header: {
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.xxl,
  },
  title: {
    ...mobileTypography.displayMedium,
    marginTop: designTokens.spacing.md,
  },
  subtitle: {
    ...mobileTypography.bodyLarge,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.sm,
  },
  form: {
    width: dimensionValues.maxWidthPercent.full,
  },
  inputContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    borderWidth: designTokens.borderWidth.thin,
    borderColor: designTokens.colors.borderMedium,
    borderRadius: designTokens.borderRadius.md,
    marginBottom: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.md,
    backgroundColor: designTokens.colors.inputBackground,
  },
  inputIcon: {
    marginRight: designTokens.spacing.sm,
  },
  input: {
    flex: flexValues.one,
    height: dimensionValues.height.input,
    ...mobileTypography.bodyLarge,
  },
  sectionHeader: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    marginTop: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.md,
    gap: designTokens.spacing.sm,
  },
  sectionTitle: {
    ...mobileTypography.heading3,
    color: designTokens.colors.primary,
  },
  sectionDescription: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.md,
    marginTop: -designTokens.spacing.sm,
  },
  pickerContainer: {
    marginBottom: designTokens.spacing.md,
  },
  pickerLabel: {
    ...mobileTypography.bodyLargeBold,
    marginBottom: designTokens.spacing.md,
  },
  optionsList: {
    maxHeight: dimensionValues.maxHeight.listSmall,
    borderWidth: designTokens.borderWidth.thin,
    borderColor: designTokens.colors.borderMedium,
    borderRadius: designTokens.borderRadius.md,
    backgroundColor: designTokens.colors.inputBackground,
  },
  option: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.md,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  optionSelected: {
    backgroundColor: designTokens.colors.primaryLight,
  },
  optionText: {
    marginLeft: designTokens.spacing.md,
    ...mobileTypography.bodyLarge,
  },
  clubsList: {
    maxHeight: dimensionValues.maxHeight.listMedium,
    borderWidth: designTokens.borderWidth.thin,
    borderColor: designTokens.colors.borderMedium,
    borderRadius: designTokens.borderRadius.md,
    backgroundColor: designTokens.colors.inputBackground,
  },
  clubOption: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    padding: designTokens.spacing.md,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  clubOptionSelected: {
    backgroundColor: designTokens.colors.primaryLight,
  },
  clubInfo: {
    marginLeft: designTokens.spacing.md,
    flex: flexValues.one,
  },
  clubName: {
    ...mobileTypography.bodyLargeBold,
  },
  clubDescription: {
    ...mobileTypography.bodySmall,
    marginTop: designTokens.spacing.xs,
  },
  button: {
    backgroundColor: designTokens.colors.primary,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    alignItems: layoutConstants.alignItems.center,
    marginTop: designTokens.spacing.sm,
    minHeight: dimensionValues.minHeight.button,
  },
  buttonDisabled: {
    opacity: designTokens.opacity.high,
  },
  buttonText: {
    ...mobileTypography.button,
  },
  linkButton: {
    marginTop: designTokens.spacing.xl,
    alignItems: layoutConstants.alignItems.center,
  },
  linkText: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.textSecondary,
  },
  linkTextBold: {
    ...mobileTypography.bodySmallBold,
    color: designTokens.colors.primary,
  },
  classSelectionButton: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    borderWidth: designTokens.borderWidth.thin,
    borderColor: designTokens.colors.borderLight,
    borderRadius: designTokens.borderRadius.md,
    marginBottom: designTokens.spacing.lg,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.inputBackground,
  },
  classSelectionContent: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    gap: designTokens.spacing.md,
    flex: flexValues.one,
  },
  classSelectionText: {
    ...mobileTypography.bodyLarge,
    flex: flexValues.one,
  },
  checkboxContainer: {
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    marginBottom: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.sm,
  },
  checkboxLabel: {
    ...mobileTypography.bodyLarge,
    marginLeft: designTokens.spacing.md,
    color: designTokens.colors.textPrimary,
  },
  infoBox: {
    flexDirection: layoutConstants.flexDirection.row,
    backgroundColor: designTokens.colors.infoLight,
    borderRadius: designTokens.borderRadius.md,
    padding: designTokens.spacing.md,
    marginBottom: designTokens.spacing.lg,
    gap: designTokens.spacing.md,
  },
  infoText: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.info,
    flex: flexValues.one,
  },
});

export default RegisterScreen;
