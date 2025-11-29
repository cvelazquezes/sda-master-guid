import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clubService } from '../../services/clubService';
import { Club, PathfinderClass } from '../../types';
import { ClassSelectionModal } from '../../components/ClassSelectionModal';

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
      Alert.alert('Error', 'Failed to load clubs');
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
      Alert.alert('Error', 'Please fill in all fields including club selection');
      return;
    }

    if (selectedClasses.length === 0) {
      Alert.alert('Error', 'Please select at least one Pathfinder class');
      return;
    }

    // Validate WhatsApp number format (basic validation)
    const whatsappRegex = /^\+?[1-9]\d{1,14}$/;
    if (!whatsappRegex.test(whatsappNumber.replace(/[\s()-]/g, ''))) {
      Alert.alert(
        'Error',
        'Please enter a valid WhatsApp number with country code (e.g., +1 555 123 4567)'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Pass classes as additional data
      await register(email, password, name, whatsappNumber, clubId, selectedClasses);
      // Registration successful - user will be redirected to PendingApprovalScreen automatically
    } catch (error) {
      Alert.alert('Registration Failed', 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (loadingClubs) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading clubs...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="account-plus" size={60} color="#6200ee" />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join a club to get started</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="account"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="whatsapp"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="WhatsApp Number (e.g., +1 555 123 4567)"
              value={whatsappNumber}
              onChangeText={setWhatsappNumber}
              keyboardType="phone-pad"
              autoCapitalize="none"
            />
          </View>

          {/* Club Selection via Organizational Hierarchy */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="sitemap" size={20} color="#6200ee" />
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
                    size={20}
                    color={division === div ? '#6200ee' : '#666'}
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
                      size={20}
                      color={union === uni ? '#6200ee' : '#666'}
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
                      size={20}
                      color={association === assoc ? '#6200ee' : '#666'}
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
                      size={20}
                      color={church === ch ? '#6200ee' : '#666'}
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
                      size={20}
                      color={clubId === club.id ? '#6200ee' : '#666'}
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

          {/* Pathfinder Classes Selection */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="school" size={20} color="#6200ee" />
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
              <MaterialCommunityIcons name="school" size={20} color="#6200ee" />
              <Text style={styles.classSelectionText}>
                {selectedClasses.length > 0
                  ? `Selected: ${selectedClasses.join(', ')}`
                  : 'Select Classes'}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#6200ee" />
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock-check"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Creating account...' : 'Register'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Login' as never)}
          >
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkTextBold}>Login</Text>
            </Text>
          </TouchableOpacity>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    marginTop: -8,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  optionsList: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionSelected: {
    backgroundColor: '#f0e6ff',
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  clubsList: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  clubOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  clubOptionSelected: {
    backgroundColor: '#f0e6ff',
  },
  clubInfo: {
    marginLeft: 12,
    flex: 1,
  },
  clubName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  clubDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#666',
    fontSize: 14,
  },
  linkTextBold: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  classSelectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: '#f9f9f9',
  },
  classSelectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  classSelectionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});

export default RegisterScreen;
