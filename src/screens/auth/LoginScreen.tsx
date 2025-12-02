/**
 * Login Screen
 * User authentication with validation and error handling
 * Supports dynamic theming (light/dark mode)
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { validate, LoginSchema } from '../../utils/validation';
import { getErrorMessage } from '../../utils/errors';
import { mobileTypography, designTokens } from '../../shared/theme';
import { StandardButton, StandardInput, Card, Badge } from '../../shared/components';
import { MESSAGES } from '../../shared/constants';

const DEFAULT_TEST_PASSWORD = 'password123';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { login } = useAuth();
  const { colors } = useTheme();
  const navigation = useNavigation();

  // Test users for quick login (development only) - One of each type
  const TEST_USERS = [
    { email: 'admin@sda.com', name: 'Admin User', role: 'Admin', color: colors.error },
    { email: 'clubadmin@sda.com', name: 'Club Admin', role: 'Club Admin', color: colors.warning },
    { email: 'carlos.martinez@sda.com', name: 'Carlos Martínez', role: 'User', color: colors.info },
  ];

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
      Alert.alert(MESSAGES.TITLES.LOGIN_FAILED, errorMessage);
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
        Alert.alert(MESSAGES.TITLES.LOGIN_FAILED, errorMessage);
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="account-group" size={80} color={colors.primary} />
            <Text style={[styles.title, { color: colors.textPrimary }]}>SDA Master Guid</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Club Management App</Text>
          </View>

        <View style={styles.form}>
          {/* Email Input */}
          <StandardInput
            label="Email"
            icon="email"
            placeholder={MESSAGES.PLACEHOLDERS.EMAIL}
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            disabled={loading}
            testID="email-input"
          />

          {/* Password Input */}
          <StandardInput
            label="Password"
            icon="lock"
            placeholder={MESSAGES.PLACEHOLDERS.PASSWORD}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
            disabled={loading}
            testID="password-input"
          />

          {/* Login Button */}
          <StandardButton
            title={loading ? 'Logging in...' : 'Login'}
            onPress={handleLogin}
            variant="primary"
            loading={loading}
            disabled={loading}
            fullWidth
            testID="login-button"
          />

          {/* Register Link */}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={navigateToRegister}
            disabled={loading}
          >
            <Text style={[styles.linkText, { color: colors.textSecondary }]}>
              Don&apos;t have an account? <Text style={[styles.linkTextBold, { color: colors.primary }]}>Register</Text>
            </Text>
          </TouchableOpacity>

          {/* Quick Login Section (Development Only) */}
          {__DEV__ && (
            <View style={[styles.quickLoginSection, { borderTopColor: colors.border }]}>
              <View style={styles.quickLoginHeader}>
                <Text style={[styles.quickLoginTitle, { color: colors.textPrimary }]}>Quick Login (Test Users)</Text>
                <Badge label="DEV" variant="warning" size="sm" />
              </View>
              <Text style={[styles.quickLoginSubtitle, { color: colors.textSecondary }]}>Click to auto-fill and login</Text>
              <View style={styles.quickLoginGrid}>
                {TEST_USERS.map((user) => (
                  <Card
                    key={user.email}
                    onPress={() => handleQuickLogin(user.email)}
                    style={{
                      ...styles.quickLoginCard,
                      borderLeftColor: user.color,
                      borderLeftWidth: 4,
                    }}
                  >
                    <View style={styles.quickLoginInfo}>
                      <Text style={[styles.quickLoginName, { color: colors.textPrimary }]}>{user.name}</Text>
                      <Text style={[styles.quickLoginRole, { color: colors.textSecondary }]}>{user.role}</Text>
                      <Text style={[styles.quickLoginEmail, { color: colors.textTertiary }]}>{user.email}</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={designTokens.icon.sizes.md} color={colors.textTertiary} />
                  </Card>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: designTokens.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: designTokens.spacing['4xl'],
  },
  title: {
    ...mobileTypography.displayMedium,
    fontSize: designTokens.typography.fontSizes['5xl'],
    marginTop: designTokens.spacing.lg,
  },
  subtitle: {
    ...mobileTypography.heading3,
    marginTop: designTokens.spacing.sm,
  },
  form: {
    width: '100%',
    gap: designTokens.spacing.md,
  },
  linkButton: {
    marginTop: designTokens.spacing.lg,
    alignItems: 'center',
    padding: designTokens.spacing.sm,
  },
  linkText: {
    ...mobileTypography.bodySmall,
  },
  linkTextBold: {
    ...mobileTypography.bodySmallBold,
  },
  quickLoginSection: {
    marginTop: designTokens.spacing['3xl'],
    paddingTop: designTokens.spacing.xxl,
    borderTopWidth: designTokens.borderWidth.thin,
  },
  quickLoginHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.sm,
    marginBottom: designTokens.spacing.xs,
  },
  quickLoginTitle: {
    ...mobileTypography.heading4,
  },
  quickLoginSubtitle: {
    ...mobileTypography.label,
    marginBottom: designTokens.spacing.lg,
  },
  quickLoginGrid: {
    gap: designTokens.spacing.sm,
  },
  quickLoginCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  quickLoginInfo: {
    flex: 1,
  },
  quickLoginName: {
    ...mobileTypography.bodySmallBold,
    marginBottom: 3,
  },
  quickLoginRole: {
    ...mobileTypography.label,
    marginBottom: 3,
  },
  quickLoginEmail: {
    ...mobileTypography.caption,
  },
});

export default LoginScreen;
