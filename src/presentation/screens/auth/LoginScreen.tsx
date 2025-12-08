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

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  COMPONENT_SIZE,
  COMPONENT_VARIANT,
  EMPTY_VALUE,
  FORM_FIELDS,
  ICONS,
  KEYBOARD_BEHAVIOR,
  PLATFORM_OS,
  SAFE_AREA_EDGES,
  SCREENS,
  SINGLE_SPACE,
  TEST_IDS,
  TEXT_COLOR,
  TEXT_VARIANT,
  TEXT_WEIGHT,
  DIMENSIONS,
  FLEX,
} from '../../../shared/constants';
import { BORDER_WIDTH } from '../../../shared/constants/numbers';
import { getErrorMessage } from '../../../shared/utils/errors';
import { validate, LoginSchema } from '../../../shared/utils/validation';
import { Text, Button, Input, Card, Badge } from '../../components/primitives';
import { useAuth } from '../../state/AuthContext';
import { useTheme } from '../../state/ThemeContext';
import type { ThemeContextType } from '../../state/ThemeContext';
// ✅ GOOD: Import UI primitives (Text, Button, Input, Card, Badge)

const DEFAULT_TEST_PASSWORD = 'password123';

type TestUser = {
  email: string;
  name: string;
  role: string;
  color: string;
};

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
  iconSizes,
  spacing,
}: {
  user: TestUser;
  onPress: () => void;
  colors: ThemeColors;
  iconSizes: ThemeContextType['iconSizes'];
  spacing: ThemeContextType['spacing'];
}): React.JSX.Element {
  const cardStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginBottom: spacing.none,
    borderLeftColor: user.color,
    borderLeftWidth: BORDER_WIDTH.HEAVY,
  };
  return (
    <Card style={cardStyle} onPress={onPress}>
      <View style={{ flex: FLEX.ONE }}>
        <View style={{ marginBottom: spacing.xxs }}>
          <Text variant={TEXT_VARIANT.BODY_SMALL} weight={TEXT_WEIGHT.BOLD}>
            {user.name}
          </Text>
        </View>
        <View style={{ marginBottom: spacing.xxs }}>
          <Text variant={TEXT_VARIANT.CAPTION} color={TEXT_COLOR.SECONDARY}>
            {user.role}
          </Text>
        </View>
        <View>
          <Text variant={TEXT_VARIANT.CAPTION} color={TEXT_COLOR.TERTIARY}>
            {user.email}
          </Text>
        </View>
      </View>
      <MaterialCommunityIcons
        name={ICONS.CHEVRON_RIGHT}
        size={iconSizes.md}
        color={colors.textTertiary}
      />
    </Card>
  );
}

// Quick login section props
type QuickLoginSectionProps = {
  testUsers: TestUser[];
  onQuickLogin: (email: string) => void;
  colors: ThemeColors;
  spacing: ThemeContextType['spacing'];
  iconSizes: ThemeContextType['iconSizes'];
  t: TranslationFn;
};

function QuickLoginSection({
  testUsers,
  onQuickLogin,
  colors,
  spacing,
  iconSizes,
  t,
}: QuickLoginSectionProps): React.JSX.Element {
  const sectionStyle = {
    marginTop: spacing['3xl'],
    paddingTop: spacing.xxl,
    borderTopWidth: BORDER_WIDTH.THIN,
    borderTopColor: colors.border,
  };

  const headerStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.sm,
    marginBottom: spacing.xs,
  };

  return (
    <View style={sectionStyle}>
      <View style={headerStyle}>
        <Text variant={TEXT_VARIANT.H4}>{t('screens.login.quickLoginTitle')}</Text>
        <Badge
          label={t('screens.login.quickLoginBadge')}
          variant="warning"
          size={COMPONENT_SIZE.sm}
        />
      </View>
      <Text
        variant={TEXT_VARIANT.LABEL}
        color={TEXT_COLOR.SECONDARY}
        style={{ marginBottom: spacing.lg }}
      >
        {t('screens.login.quickLoginSubtitle')}
      </Text>
      <View style={{ gap: spacing.sm }}>
        {testUsers.map((user) => (
          <QuickLoginCard
            key={user.email}
            user={user}
            colors={colors}
            iconSizes={iconSizes}
            spacing={spacing}
            onPress={() => onQuickLogin(user.email)}
          />
        ))}
      </View>
    </View>
  );
}

// Login header props
type LoginHeaderProps = {
  colors: ThemeColors;
  spacing: ThemeContextType['spacing'];
  iconSizes: ThemeContextType['iconSizes'];
  t: TranslationFn;
};

function LoginHeader({ colors, spacing, iconSizes, t }: LoginHeaderProps): React.JSX.Element {
  return (
    <View style={{ alignItems: 'center', marginBottom: spacing['4xl'] }}>
      <MaterialCommunityIcons
        name={ICONS.ACCOUNT_GROUP}
        size={iconSizes['4xl']}
        color={colors.primary}
      />
      <View style={{ marginTop: spacing.lg, alignItems: 'center' }}>
        <Text variant={TEXT_VARIANT.H1} weight={TEXT_WEIGHT.BOLD}>
          {t('screens.login.appTitle')}
        </Text>
      </View>
      <View style={{ marginTop: spacing.xs }}>
        <Text variant={TEXT_VARIANT.BODY} color={TEXT_COLOR.SECONDARY}>
          {t('screens.login.appSubtitle')}
        </Text>
      </View>
    </View>
  );
}

// Login form props
type LoginFormProps = {
  email: string;
  password: string;
  loading: boolean;
  errors: { email?: string; password?: string };
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onLogin: () => void;
  onRegister: () => void;
  spacing: ThemeContextType['spacing'];
  t: TranslationFn;
};

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
      placeholder={t('auth.enterEmail')}
      value={email}
      error={error}
      disabled={disabled}
      testID={TEST_IDS.EMAIL_INPUT}
      onChangeText={onChange}
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
      secureTextEntry
      label={t('screens.login.password')}
      icon={ICONS.LOCK}
      placeholder={t('auth.enterPassword')}
      value={password}
      error={error}
      disabled={disabled}
      testID={TEST_IDS.PASSWORD_INPUT}
      onChangeText={onChange}
    />
  );
}

// Register link component
function RegisterLink({
  t,
  onPress,
  disabled,
  spacing,
}: {
  t: TranslationFn;
  onPress: () => void;
  disabled: boolean;
  spacing: ThemeContextType['spacing'];
}): React.JSX.Element {
  return (
    <TouchableOpacity
      style={{ marginTop: spacing.lg, alignItems: 'center', padding: spacing.sm }}
      disabled={disabled}
      onPress={onPress}
    >
      <Text variant={TEXT_VARIANT.BODY_SMALL} color={TEXT_COLOR.SECONDARY}>
        {t('screens.login.noAccount')}
        {SINGLE_SPACE}
        <Text variant={TEXT_VARIANT.BODY_SMALL} color={TEXT_COLOR.LINK} weight={TEXT_WEIGHT.BOLD}>
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
    spacing,
    t,
  } = props;
  const title = loading ? t('screens.login.loggingIn') : t('screens.login.loginButton');
  return (
    <>
      <EmailInput
        t={t}
        email={email}
        error={errors.email}
        disabled={loading}
        onChange={onEmailChange}
      />
      <PasswordInput
        t={t}
        password={password}
        error={errors.password}
        disabled={loading}
        onChange={onPasswordChange}
      />
      <Button
        fullWidth
        title={title}
        variant={COMPONENT_VARIANT.primary}
        loading={loading}
        disabled={loading}
        testID={TEST_IDS.LOGIN_BUTTON}
        onPress={onLogin}
      />
      <RegisterLink t={t} disabled={loading} spacing={spacing} onPress={onRegister} />
    </>
  );
}

// Login handlers return type
type UseLoginHandlersReturn = {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  loading: boolean;
  errors: { email?: string; password?: string };
  handleLogin: () => Promise<void>;
  handleQuickLogin: (email: string) => Promise<void>;
};

function useLoginHandlers(login: (e: string, p: string) => Promise<void>): UseLoginHandlersReturn {
  const { t } = useTranslation();
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
      Alert.alert(t('auth.loginFailed'), getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [email, password, login, t]);

  const handleQuickLogin = useCallback(
    async (userEmail: string) => {
      setEmail(userEmail);
      setPassword(DEFAULT_TEST_PASSWORD);
      setErrors({});
      setLoading(true);
      try {
        await login(userEmail, DEFAULT_TEST_PASSWORD);
      } catch (error) {
        Alert.alert(t('auth.loginFailed'), getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [login, t]
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
  const { colors, spacing, iconSizes } = useTheme();
  const navigation = useNavigation();
  const handlers = useLoginHandlers(login);
  const testUsers = createTestUsers(colors);
  const navigateToRegister = useCallback(
    () => navigation.navigate(SCREENS.REGISTER as never),
    [navigation]
  );
  const keyboardBehavior =
    Platform.OS === PLATFORM_OS.IOS ? KEYBOARD_BEHAVIOR.PADDING : KEYBOARD_BEHAVIOR.HEIGHT;

  const styles = useMemo(() => createStyles(spacing), [spacing]);

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
          <LoginHeader colors={colors} spacing={spacing} iconSizes={iconSizes} t={t} />
          <View style={styles.form}>
            <LoginForm
              email={handlers.email}
              password={handlers.password}
              loading={handlers.loading}
              errors={handlers.errors}
              spacing={spacing}
              t={t}
              onEmailChange={handlers.setEmail}
              onPasswordChange={handlers.setPassword}
              onLogin={handlers.handleLogin}
              onRegister={navigateToRegister}
            />
            {__DEV__ && (
              <QuickLoginSection
                testUsers={testUsers}
                colors={colors}
                spacing={spacing}
                iconSizes={iconSizes}
                t={t}
                onQuickLogin={handlers.handleQuickLogin}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/**
 * Styles factory - Creates styles using theme values
 * ✅ COMPLIANT: Uses theme values via useTheme() hook
 */
const createStyles = (spacing: ThemeContextType['spacing']): ReturnType<typeof StyleSheet.create> =>
  StyleSheet.create({
    safeArea: {
      flex: FLEX.ONE,
    },
    container: {
      flex: FLEX.ONE,
    },
    scrollContent: {
      flexGrow: FLEX.GROW_ENABLED,
      justifyContent: 'center',
      padding: spacing.lg,
    },
    form: {
      width: DIMENSIONS.WIDTH.FULL,
      gap: spacing.md,
    },
  });

export default LoginScreen;
