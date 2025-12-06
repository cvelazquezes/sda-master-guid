/**
 * Login Screen
 * User authentication with validation and error handling
 * Supports dynamic theming (light/dark mode)
 *
 * ✅ REFACTORED: Uses UI primitives instead of raw React Native components
 * - Text → Text primitive from @/ui
 * - TouchableOpacity kept for custom press handling (escape hatch)
 * - View kept for layout only (no colors/styles defined here)
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { validate, LoginSchema } from '../../utils/validation';
import { getErrorMessage } from '../../utils/errors';
import { designTokens, layoutConstants } from '../../shared/theme';
// ✅ GOOD: Import UI primitives (Text, Button, Input, Card, Badge)
import { Text, Button, Input, Card, Badge } from '../../shared/components';
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

interface TestUser {
  email: string;
  name: string;
  role: string;
  color: string;
}

// Form validation helper
const validateLoginForm = (
  email: string,
  password: string,
  setErrors: React.Dispatch<React.SetStateAction<{ email?: string; password?: string }>>
): boolean => {
  const result = validate(LoginSchema, { email, password });
  if (!result.success) {
    const formErrors: { email?: string; password?: string } = {};
    result.errors.forEach((e) => {
      if (e.includes(FORM_FIELDS.EMAIL)) {
        formErrors.email = e;
      } else if (e.includes(FORM_FIELDS.PASSWORD)) {
        formErrors.password = e;
      }
    });
    setErrors(formErrors);
    return false;
  }
  setErrors({});
  return true;
};

type TranslationFn = ReturnType<typeof useTranslation>['t'];
type ThemeColors = ReturnType<typeof useTheme>['colors'];

// Test users configuration
const createTestUsers = (colors: ThemeColors): TestUser[] => [
  { email: 'admin@sda.com', name: 'Admin User', role: 'Admin', color: colors.error },
  { email: 'clubadmin@sda.com', name: 'Club Admin', role: 'Club Admin', color: colors.warning },
  { email: 'carlos.martinez@sda.com', name: 'Carlos Martínez', role: 'User', color: colors.info },
];

// Quick login card component
function QuickLoginCard({
  user,
  onPress,
  colors,
}: {
  user: TestUser;
  onPress: () => void;
  colors: ThemeColors;
}): React.JSX.Element {
  const cardStyle = {
    ...styles.quickLoginCard,
    borderLeftColor: user.color,
    borderLeftWidth: designTokens.borderWidth.heavy,
  };
  return (
    <Card onPress={onPress} style={cardStyle}>
      <View style={styles.quickLoginInfo}>
        <Text variant="bodySmall" weight="bold">
          {user.name}
        </Text>
        <Text variant="label" color="secondary">
          {user.role}
        </Text>
        <Text variant="caption" color="tertiary">
          {user.email}
        </Text>
      </View>
      <MaterialCommunityIcons
        name={ICONS.CHEVRON_RIGHT}
        size={designTokens.icon.sizes.md}
        color={colors.textTertiary}
      />
    </Card>
  );
}

// Quick login section props
interface QuickLoginSectionProps {
  testUsers: TestUser[];
  onQuickLogin: (email: string) => void;
  colors: ThemeColors;
  t: TranslationFn;
}

function QuickLoginSection({
  testUsers,
  onQuickLogin,
  colors,
  t,
}: QuickLoginSectionProps): React.JSX.Element {
  return (
    <View style={[styles.quickLoginSection, { borderTopColor: colors.border }]}>
      <View style={styles.quickLoginHeader}>
        <Text variant="h4">{t('screens.login.quickLoginTitle')}</Text>
        <Badge
          label={t('screens.login.quickLoginBadge')}
          variant="warning"
          size={COMPONENT_SIZE.sm}
        />
      </View>
      <Text variant="label" color="secondary" style={styles.quickLoginSubtitle}>
        {t('screens.login.quickLoginSubtitle')}
      </Text>
      <View style={styles.quickLoginGrid}>
        {testUsers.map((user) => (
          <QuickLoginCard
            key={user.email}
            user={user}
            onPress={() => onQuickLogin(user.email)}
            colors={colors}
          />
        ))}
      </View>
    </View>
  );
}

// Login header props
interface LoginHeaderProps {
  colors: ThemeColors;
  t: TranslationFn;
}

function LoginHeader({ colors, t }: LoginHeaderProps): React.JSX.Element {
  return (
    <View style={styles.header}>
      <MaterialCommunityIcons
        name={ICONS.ACCOUNT_GROUP}
        size={designTokens.iconSize['4xl']}
        color={colors.primary}
      />
      <Text variant="displayMedium" style={styles.title}>
        {t('screens.login.appTitle')}
      </Text>
      <Text variant="h3" color="secondary" style={styles.subtitle}>
        {t('screens.login.appSubtitle')}
      </Text>
    </View>
  );
}

// Login form props
interface LoginFormProps {
  email: string;
  password: string;
  loading: boolean;
  errors: { email?: string; password?: string };
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onLogin: () => void;
  onRegister: () => void;
  t: TranslationFn;
}

// Email input component
function EmailInput({
  t,
  email,
  onChange,
  error,
  disabled,
}: {
  t: TranslationFn;
  email: string;
  onChange: (v: string) => void;
  error?: string;
  disabled: boolean;
}): React.JSX.Element {
  return (
    <Input
      label={t('screens.login.email')}
      icon={ICONS.EMAIL}
      placeholder={MESSAGES.PLACEHOLDERS.EMAIL}
      value={email}
      onChangeText={onChange}
      error={error}
      disabled={disabled}
      testID={TEST_IDS.EMAIL_INPUT}
    />
  );
}

// Password input component
function PasswordInput({
  t,
  password,
  onChange,
  error,
  disabled,
}: {
  t: TranslationFn;
  password: string;
  onChange: (v: string) => void;
  error?: string;
  disabled: boolean;
}): React.JSX.Element {
  return (
    <Input
      label={t('screens.login.password')}
      icon={ICONS.LOCK}
      placeholder={MESSAGES.PLACEHOLDERS.PASSWORD}
      value={password}
      onChangeText={onChange}
      secureTextEntry
      error={error}
      disabled={disabled}
      testID={TEST_IDS.PASSWORD_INPUT}
    />
  );
}

// Register link component
function RegisterLink({
  t,
  onPress,
  disabled,
}: {
  t: TranslationFn;
  onPress: () => void;
  disabled: boolean;
}): React.JSX.Element {
  return (
    <TouchableOpacity style={styles.linkButton} onPress={onPress} disabled={disabled}>
      <Text variant="bodySmall" color="secondary">
        {t('screens.login.noAccount')}{' '}
        <Text variant="bodySmall" color="link" weight="bold">
          {t('screens.login.registerLink')}
        </Text>
      </Text>
    </TouchableOpacity>
  );
}

function LoginForm(props: LoginFormProps): React.JSX.Element {
  const {
    email,
    password,
    loading,
    errors,
    onEmailChange,
    onPasswordChange,
    onLogin,
    onRegister,
    t,
  } = props;
  const title = loading ? t('screens.login.loggingIn') : t('screens.login.loginButton');
  return (
    <>
      <EmailInput
        t={t}
        email={email}
        onChange={onEmailChange}
        error={errors.email}
        disabled={loading}
      />
      <PasswordInput
        t={t}
        password={password}
        onChange={onPasswordChange}
        error={errors.password}
        disabled={loading}
      />
      <Button
        title={title}
        onPress={onLogin}
        variant={COMPONENT_VARIANT.primary}
        loading={loading}
        disabled={loading}
        fullWidth
        testID={TEST_IDS.LOGIN_BUTTON}
      />
      <RegisterLink t={t} onPress={onRegister} disabled={loading} />
    </>
  );
}

// Login handlers return type
interface UseLoginHandlersReturn {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  loading: boolean;
  errors: { email?: string; password?: string };
  handleLogin: () => Promise<void>;
  handleQuickLogin: (email: string) => Promise<void>;
}

function useLoginHandlers(login: (e: string, p: string) => Promise<void>): UseLoginHandlersReturn {
  const [email, setEmail] = useState(EMPTY_VALUE);
  const [password, setPassword] = useState(EMPTY_VALUE);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = useCallback(async () => {
    if (!validateLoginForm(email, password, setErrors)) {
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert(MESSAGES.TITLES.LOGIN_FAILED, getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [email, password, login]);

  const handleQuickLogin = useCallback(
    async (userEmail: string) => {
      setEmail(userEmail);
      setPassword(DEFAULT_TEST_PASSWORD);
      setErrors({});
      setLoading(true);
      try {
        await login(userEmail, DEFAULT_TEST_PASSWORD);
      } catch (error) {
        Alert.alert(MESSAGES.TITLES.LOGIN_FAILED, getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    errors,
    handleLogin,
    handleQuickLogin,
  };
}

const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const handlers = useLoginHandlers(login);
  const testUsers = createTestUsers(colors);
  const navigateToRegister = useCallback(
    () => navigation.navigate(SCREENS.REGISTER as never),
    [navigation]
  );
  const keyboardBehavior =
    Platform.OS === PLATFORM_OS.IOS ? KEYBOARD_BEHAVIOR.PADDING : KEYBOARD_BEHAVIOR.HEIGHT;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={SAFE_AREA_EDGES.TOP_LEFT_RIGHT}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={keyboardBehavior}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <LoginHeader colors={colors} t={t} />
          <View style={styles.form}>
            <LoginForm
              email={handlers.email}
              password={handlers.password}
              loading={handlers.loading}
              errors={handlers.errors}
              onEmailChange={handlers.setEmail}
              onPasswordChange={handlers.setPassword}
              onLogin={handlers.handleLogin}
              onRegister={navigateToRegister}
              t={t}
            />
            {__DEV__ && (
              <QuickLoginSection
                testUsers={testUsers}
                onQuickLogin={handlers.handleQuickLogin}
                colors={colors}
                t={t}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/**
 * Styles - Now simplified since Text primitive handles typography
 *
 * ✅ GOOD: Only layout styles (flex, margin, padding) are defined here
 * ❌ BAD: No inline colors, font sizes, or typography - use tokens/primitives
 */
const styles = StyleSheet.create({
  // Layout styles only - no colors or typography
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
  // Title spacing only - typography handled by Text variant="displayMedium"
  title: {
    marginTop: designTokens.spacing.lg,
  },
  // Subtitle spacing only - typography handled by Text variant="h3"
  subtitle: {
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
  // Removed linkText/linkTextBold - handled by Text variant props
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
  // Removed quickLoginTitle - handled by Text variant="h4"
  quickLoginSubtitle: {
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
    gap: designTokens.spacing.xxs,
  },
  // Removed quickLoginName/Role/Email - handled by Text variant props
});

export default LoginScreen;
