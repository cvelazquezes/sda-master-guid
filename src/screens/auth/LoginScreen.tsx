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
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { validate, LoginSchema } from '../../utils/validation';
import { getErrorMessage } from '../../utils/errors';
import { mobileTypography, designTokens, layoutConstants } from '../../shared/theme';
import { StandardButton, StandardInput, Card, Badge } from '../../shared/components';
import {
  COMPONENT_SIZE,
  COMPONENT_VARIANT,
  EMPTY_VALUE,
  FORM_FIELDS,
  ICONS,
  KEYBOARD_BEHAVIOR,
  MESSAGES,
  PLATFORM_OS,
  SAFE_AREA_EDGES,
  SCREENS,
  TEST_IDS,
  dimensionValues,
  flexValues,
} from '../../shared/constants';

const DEFAULT_TEST_PASSWORD = 'password123';

const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState(EMPTY_VALUE);
  const [password, setPassword] = useState(EMPTY_VALUE);
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
        if (error.includes(FORM_FIELDS.EMAIL)) {
          formErrors.email = error;
        } else if (error.includes(FORM_FIELDS.PASSWORD)) {
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
    navigation.navigate(SCREENS.REGISTER as never);
  }, [navigation]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={SAFE_AREA_EDGES.TOP_LEFT_RIGHT}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={
          Platform.OS === PLATFORM_OS.IOS ? KEYBOARD_BEHAVIOR.PADDING : KEYBOARD_BEHAVIOR.HEIGHT
        }
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <MaterialCommunityIcons
              name={ICONS.ACCOUNT_GROUP}
              size={designTokens.iconSize['4xl']}
              color={colors.primary}
            />
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {t('screens.login.appTitle')}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {t('screens.login.appSubtitle')}
            </Text>
          </View>

          <View style={styles.form}>
            {/* Email Input */}
            <StandardInput
              label={t('screens.login.email')}
              icon={ICONS.EMAIL}
              placeholder={MESSAGES.PLACEHOLDERS.EMAIL}
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              disabled={loading}
              testID={TEST_IDS.EMAIL_INPUT}
            />

            {/* Password Input */}
            <StandardInput
              label={t('screens.login.password')}
              icon={ICONS.LOCK}
              placeholder={MESSAGES.PLACEHOLDERS.PASSWORD}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
              disabled={loading}
              testID={TEST_IDS.PASSWORD_INPUT}
            />

            {/* Login Button */}
            <StandardButton
              title={loading ? t('screens.login.loggingIn') : t('screens.login.loginButton')}
              onPress={handleLogin}
              variant={COMPONENT_VARIANT.primary}
              loading={loading}
              disabled={loading}
              fullWidth
              testID={TEST_IDS.LOGIN_BUTTON}
            />

            {/* Register Link */}
            <TouchableOpacity
              style={styles.linkButton}
              onPress={navigateToRegister}
              disabled={loading}
            >
              <Text style={[styles.linkText, { color: colors.textSecondary }]}>
                {t('screens.login.noAccount')}{' '}
                <Text style={[styles.linkTextBold, { color: colors.primary }]}>
                  {t('screens.login.registerLink')}
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Quick Login Section (Development Only) */}
            {__DEV__ && (
              <View style={[styles.quickLoginSection, { borderTopColor: colors.border }]}>
                <View style={styles.quickLoginHeader}>
                  <Text style={[styles.quickLoginTitle, { color: colors.textPrimary }]}>
                    {t('screens.login.quickLoginTitle')}
                  </Text>
                  <Badge
                    label={t('screens.login.quickLoginBadge')}
                    variant="warning"
                    size={COMPONENT_SIZE.sm}
                  />
                </View>
                <Text style={[styles.quickLoginSubtitle, { color: colors.textSecondary }]}>
                  {t('screens.login.quickLoginSubtitle')}
                </Text>
                <View style={styles.quickLoginGrid}>
                  {TEST_USERS.map((user) => (
                    <Card
                      key={user.email}
                      onPress={() => handleQuickLogin(user.email)}
                      style={{
                        ...styles.quickLoginCard,
                        borderLeftColor: user.color,
                        borderLeftWidth: designTokens.borderWidth.heavy,
                      }}
                    >
                      <View style={styles.quickLoginInfo}>
                        <Text style={[styles.quickLoginName, { color: colors.textPrimary }]}>
                          {user.name}
                        </Text>
                        <Text style={[styles.quickLoginRole, { color: colors.textSecondary }]}>
                          {user.role}
                        </Text>
                        <Text style={[styles.quickLoginEmail, { color: colors.textTertiary }]}>
                          {user.email}
                        </Text>
                      </View>
                      <MaterialCommunityIcons
                        name={ICONS.CHEVRON_RIGHT}
                        size={designTokens.icon.sizes.md}
                        color={colors.textTertiary}
                      />
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
    flex: flexValues.one,
  },
  container: {
    flex: flexValues.one,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: layoutConstants.justifyContent.center,
    padding: designTokens.spacing.lg,
  },
  header: {
    alignItems: layoutConstants.alignItems.center,
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
    width: dimensionValues.width.full,
    gap: designTokens.spacing.md,
  },
  linkButton: {
    marginTop: designTokens.spacing.lg,
    alignItems: layoutConstants.alignItems.center,
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
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
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
    flexDirection: layoutConstants.flexDirection.row,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.spaceBetween,
    marginBottom: designTokens.spacing.none,
  },
  quickLoginInfo: {
    flex: flexValues.one,
  },
  quickLoginName: {
    ...mobileTypography.bodySmallBold,
    marginBottom: designTokens.spacing.xxs,
  },
  quickLoginRole: {
    ...mobileTypography.label,
    marginBottom: designTokens.spacing.xxs,
  },
  quickLoginEmail: {
    ...mobileTypography.caption,
  },
});

export default LoginScreen;
