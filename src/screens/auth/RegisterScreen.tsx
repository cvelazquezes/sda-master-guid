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
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clubService } from '../../services/clubService';
import { Club, PathfinderClass } from '../../types';
import { ClassSelectionModal } from '../../components/ClassSelectionModal';
import { StandardInput, StandardButton } from '../../shared/components';
import { mobileTypography, mobileIconSizes } from '../../shared/theme';
import { designTokens } from '../../shared/theme/designTokens';
import { MESSAGES, VALIDATION, LIMITS } from '../../shared/constants';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Club selection via organizational hierarchy
  const [division, setDivision] = useState('');
  const [union, setUnion] = useState('');
  const [association, setAssociation] = useState('');
  const [church, setChurch] = useState('');
  const [clubId, setClubId] = useState('');
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingClubs, setLoadingClubs] = useState(true);
  // Role selection
  const [isClubAdmin, setIsClubAdmin] = useState(false);
  // Class selection
  const [selectedClasses, setSelectedClasses] = useState<PathfinderClass[]>(['Friend']);
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
    setUnion('');
    setAssociation('');
    setChurch('');
    setClubId('');
  };

  const handleUnionChange = (newUnion: string) => {
    setUnion(newUnion);
    setAssociation('');
    setChurch('');
    setClubId('');
  };

  const handleAssociationChange = (newAssociation: string) => {
    setAssociation(newAssociation);
    setChurch('');
    setClubId('');
  };

  const handleChurchChange = (newChurch: string) => {
    setChurch(newChurch);
    setClubId('');
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
    if (!VALIDATION.WHATSAPP.REGEX.test(whatsappNumber.replace(/[\s()-]/g, ''))) {
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
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={designTokens.colors.primary} />
          <Text style={styles.loadingText}>{MESSAGES.INFO.LOADING_CLUBS}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="account-plus" size={60} color={designTokens.colors.primary} />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join a club to get started</Text>
        </View>

        <View style={styles.form}>
          <StandardInput
            label="Full Name"
            icon="account"
            placeholder={MESSAGES.PLACEHOLDERS.FULL_NAME}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            required
          />

          <StandardInput
            label="Email"
            icon="email"
            placeholder={MESSAGES.PLACEHOLDERS.EMAIL}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            required
          />

          <StandardInput
            label="WhatsApp Number"
            icon="whatsapp"
            placeholder={MESSAGES.PLACEHOLDERS.WHATSAPP}
            value={whatsappNumber}
            onChangeText={setWhatsappNumber}
            keyboardType="phone-pad"
            autoCapitalize="none"
            required
          />

          {/* Role Selection */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="account-cog" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
            <Text style={styles.sectionTitle}>Account Type</Text>
          </View>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsClubAdmin(!isClubAdmin)}
          >
            <MaterialCommunityIcons
              name={isClubAdmin ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={mobileIconSizes.large}
              color={designTokens.colors.primary}
            />
            <Text style={styles.checkboxLabel}>I am a club admin</Text>
          </TouchableOpacity>
          {isClubAdmin && (
            <View style={styles.infoBox}>
              <MaterialCommunityIcons name="information" size={mobileIconSizes.medium} color={designTokens.colors.info} />
              <Text style={styles.infoText}>
                Club admin accounts require approval from a system administrator.
              </Text>
            </View>
          )}

          {/* Club Selection via Organizational Hierarchy */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="sitemap" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
            <Text style={styles.sectionTitle}>Find Your Club</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Navigate through your organization to find your club
          </Text>

          {/* Division Selection */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>1. Select Division *</Text>
            <ScrollView style={styles.optionsList}>
              {getUniqueDivisions().map((div) => (
                <TouchableOpacity
                  key={div}
                  style={[styles.option, division === div && styles.optionSelected]}
                  onPress={() => handleDivisionChange(div)}
                >
                  <MaterialCommunityIcons
                    name={division === div ? 'radiobox-marked' : 'radiobox-blank'}
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
              <Text style={styles.pickerLabel}>2. Select Union *</Text>
              <ScrollView style={styles.optionsList}>
                {getUniqueUnions().map((uni) => (
                  <TouchableOpacity
                    key={uni}
                    style={[styles.option, union === uni && styles.optionSelected]}
                    onPress={() => handleUnionChange(uni)}
                  >
                    <MaterialCommunityIcons
                      name={union === uni ? 'radiobox-marked' : 'radiobox-blank'}
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
              <Text style={styles.pickerLabel}>3. Select Association *</Text>
              <ScrollView style={styles.optionsList}>
                {getUniqueAssociations().map((assoc) => (
                  <TouchableOpacity
                    key={assoc}
                    style={[styles.option, association === assoc && styles.optionSelected]}
                    onPress={() => handleAssociationChange(assoc)}
                  >
                    <MaterialCommunityIcons
                      name={association === assoc ? 'radiobox-marked' : 'radiobox-blank'}
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
              <Text style={styles.pickerLabel}>4. Select Church *</Text>
              <ScrollView style={styles.optionsList}>
                {getUniqueChurches().map((ch) => (
                  <TouchableOpacity
                    key={ch}
                    style={[styles.option, church === ch && styles.optionSelected]}
                    onPress={() => handleChurchChange(ch)}
                  >
                    <MaterialCommunityIcons
                      name={church === ch ? 'radiobox-marked' : 'radiobox-blank'}
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
              <Text style={styles.pickerLabel}>5. Select Your Club *</Text>
              <ScrollView style={styles.clubsList}>
                {getFilteredClubs().map((club) => (
                  <TouchableOpacity
                    key={club.id}
                    style={[styles.clubOption, clubId === club.id && styles.clubOptionSelected]}
                    onPress={() => setClubId(club.id)}
                  >
                    <MaterialCommunityIcons
                      name={clubId === club.id ? 'radiobox-marked' : 'radiobox-blank'}
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
                <MaterialCommunityIcons name="school" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
                <Text style={styles.sectionTitle}>Pathfinder Classes</Text>
              </View>
              <Text style={styles.sectionDescription}>
                Select 1 to 3 Pathfinder classes you belong to
              </Text>

              <TouchableOpacity
                style={styles.classSelectionButton}
                onPress={() => setClassModalVisible(true)}
              >
                <View style={styles.classSelectionContent}>
                  <MaterialCommunityIcons name="school" size={mobileIconSizes.medium} color={designTokens.colors.primary} />
                  <Text style={styles.classSelectionText}>
                    {selectedClasses.length > 0
                      ? `Selected: ${selectedClasses.join(', ')}`
                      : 'Select Classes'}
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={mobileIconSizes.large} color={designTokens.colors.primary} />
              </TouchableOpacity>
            </>
          )}

          <StandardInput
            label="Password"
            icon="lock"
            placeholder={MESSAGES.PLACEHOLDERS.PASSWORD}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            required
          />

          <StandardInput
            label="Confirm Password"
            icon="lock-check"
            placeholder={MESSAGES.PLACEHOLDERS.CONFIRM_PASSWORD}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            required
          />

          <StandardButton
            title={loading ? 'Creating account...' : 'Register'}
            onPress={handleRegister}
            disabled={loading}
            loading={loading}
            icon="account-plus"
          />

          <StandardButton
            title="Already have an account? Login"
            variant="ghost"
            onPress={() => navigation.navigate('Login' as never)}
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
    flex: 1,
    backgroundColor: designTokens.colors.backgroundPrimary,
  },
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.backgroundPrimary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: designTokens.spacing.lg,
    paddingTop: designTokens.spacing['3xl'],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: designTokens.colors.backgroundPrimary,
  },
  loadingText: {
    ...mobileTypography.bodyMedium,
    marginTop: designTokens.spacing.md,
  },
  header: {
    alignItems: 'center',
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
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1,
    height: 50,
    ...mobileTypography.bodyLarge,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
    maxHeight: 150,
    borderWidth: designTokens.borderWidth.thin,
    borderColor: designTokens.colors.borderMedium,
    borderRadius: designTokens.borderRadius.md,
    backgroundColor: designTokens.colors.inputBackground,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
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
    maxHeight: 200,
    borderWidth: designTokens.borderWidth.thin,
    borderColor: designTokens.colors.borderMedium,
    borderRadius: designTokens.borderRadius.md,
    backgroundColor: designTokens.colors.inputBackground,
  },
  clubOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: designTokens.spacing.md,
    borderBottomWidth: designTokens.borderWidth.thin,
    borderBottomColor: designTokens.colors.borderLight,
  },
  clubOptionSelected: {
    backgroundColor: designTokens.colors.primaryLight,
  },
  clubInfo: {
    marginLeft: designTokens.spacing.md,
    flex: 1,
  },
  clubName: {
    ...mobileTypography.bodyLargeBold,
  },
  clubDescription: {
    ...mobileTypography.bodySmall,
    marginTop: 4,
  },
  button: {
    backgroundColor: designTokens.colors.primary,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    alignItems: 'center',
    marginTop: designTokens.spacing.sm,
    minHeight: 52,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...mobileTypography.button,
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: designTokens.colors.borderLight,
    borderRadius: designTokens.borderRadius.md,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: designTokens.colors.inputBackground,
  },
  classSelectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  classSelectionText: {
    ...mobileTypography.bodyLarge,
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  checkboxLabel: {
    ...mobileTypography.bodyLarge,
    marginLeft: 12,
    color: designTokens.colors.textPrimary,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: designTokens.colors.infoLight,
    borderRadius: designTokens.borderRadius.md,
    padding: designTokens.spacing.md,
    marginBottom: 16,
    gap: 10,
  },
  infoText: {
    ...mobileTypography.bodySmall,
    color: designTokens.colors.info,
    flex: 1,
  },
});

export default RegisterScreen;
