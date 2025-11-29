/**
 * Login Screen
 * User authentication with validation and error handling
 */

import React, { useState, useCallback } from 'react';
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
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { validate, LoginSchema } from '../../utils/validation';
import { getErrorMessage } from '../../utils/errors';

// Test users for quick login (development only) - One of each type
const TEST_USERS = [
  { email: 'admin@sda.com', name: 'Admin User', role: 'Admin', color: '#f44336' },
  { email: 'clubadmin@sda.com', name: 'Club Admin', role: 'Club Admin', color: '#ff9800' },
  { email: 'user@sda.com', name: 'John Doe', role: 'User', color: '#2196f3' },
] as const;

const DEFAULT_TEST_PASSWORD = 'password123';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { login } = useAuth();
  const navigation = useNavigation();

  /**
   * Validates login form
   */
  const validateForm = useCallback((): boolean => {
    const result = validate(LoginSchema, { email, password });

    if (!result.success) {
      const formErrors: { email?: string; password?: string } = {};
      result.errors.forEach((error) => {
        if (error.includes('email')) {
          formErrors.email = error;
        } else if (error.includes('Password')) {
          formErrors.password = error;
        }
      });
      setErrors(formErrors);
      return false;
    }

    setErrors({});
    return true;
  }, [email, password]);

  /**
   * Handles login submission
   */
  const handleLogin = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // Navigation handled by AuthContext
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [email, password, validateForm, login]);

  /**
   * Handles quick login with test user
   */
  const handleQuickLogin = useCallback(
    async (userEmail: string) => {
      setEmail(userEmail);
      setPassword(DEFAULT_TEST_PASSWORD);
      setErrors({});

      setLoading(true);
      try {
        await login(userEmail, DEFAULT_TEST_PASSWORD);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        Alert.alert('Login Failed', errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  /**
   * Handles navigation to register screen
   */
  const navigateToRegister = useCallback(() => {
    navigation.navigate('Register' as never);
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="coffee" size={80} color="#6200ee" />
          <Text style={styles.title}>SDA Master Guid</Text>
          <Text style={styles.subtitle}>Coffee Chat App</Text>
        </View>

        <View style={styles.form}>
          {/* Email Input */}
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
              testID="email-input"
              editable={!loading}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              testID="password-input"
              editable={!loading}
            />
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            testID="login-button"
          >
            <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
          </TouchableOpacity>

          {/* Register Link */}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={navigateToRegister}
            disabled={loading}
          >
            <Text style={styles.linkText}>
              Don&apos;t have an account? <Text style={styles.linkTextBold}>Register</Text>
            </Text>
          </TouchableOpacity>

          {/* Quick Login Section (Development Only) */}
          {__DEV__ && (
            <View style={styles.quickLoginSection}>
              <Text style={styles.quickLoginTitle}>Quick Login (Test Users)</Text>
              <Text style={styles.quickLoginSubtitle}>Click to auto-fill and login</Text>
              <View style={styles.quickLoginGrid}>
                {TEST_USERS.map((user) => (
                  <TouchableOpacity
                    key={user.email}
                    style={[styles.quickLoginButton, { borderLeftColor: user.color }]}
                    onPress={() => handleQuickLogin(user.email)}
                    disabled={loading}
                  >
                    <View style={styles.quickLoginInfo}>
                      <Text style={styles.quickLoginName}>{user.name}</Text>
                      <Text style={styles.quickLoginRole}>{user.role}</Text>
                      <Text style={styles.quickLoginEmail}>{user.email}</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#999" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
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
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
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
    marginBottom: 8,
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
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
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
  quickLoginSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  quickLoginTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  quickLoginSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  quickLoginGrid: {
    gap: 8,
  },
  quickLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 8,
  },
  quickLoginInfo: {
    flex: 1,
  },
  quickLoginName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  quickLoginRole: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  quickLoginEmail: {
    fontSize: 11,
    color: '#999',
  },
});

export default LoginScreen;
