import React, { useState, useMemo } from 'react';
import { View, ScrollView, KeyboardAvoidingView, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { ClassSelectionModal } from '../../../components/features/ClassSelectionModal';
import { Button } from '../../../components/primitives';
import { useTheme, ThemeContextType } from '../../../state/ThemeContext';
import {
  COMPONENT_VARIANT,
  ICONS,
  KEYBOARD_BEHAVIOR,
  PLATFORM_OS,
  SAFE_AREA_EDGES,
  SCREENS,
  DIMENSIONS,
  FLEX,
} from '../../../../shared/constants';
import { useRegisterForm } from './useRegisterForm';
import { useClubHierarchy } from './useClubHierarchy';
import { RegisterHeader } from './RegisterHeader';
import { AccountTypeSection } from './AccountTypeSection';
import { ClubHierarchySection } from './ClubHierarchySection';
import { ClassSelectionSection } from './ClassSelectionSection';
import { LoadingState } from './LoadingState';
import { PersonalInfoInputs, PasswordInputs } from './RegisterFormInputs';

function useRegisterLabels(t: ReturnType<typeof useTranslation>['t']): {
  personal: { name: string; email: string; whatsapp: string };
  password: { password: string; confirmPassword: string };
  hierarchy: { division: string; union: string; association: string; church: string; club: string };
} {
  return {
    personal: {
      name: t('screens.register.fullName'),
      email: t('screens.register.email'),
      whatsapp: t('screens.register.whatsAppNumber'),
    },
    password: {
      password: t('screens.register.password'),
      confirmPassword: t('screens.register.confirmPassword'),
    },
    hierarchy: {
      division: t('screens.register.selectDivision'),
      union: t('screens.register.selectUnion'),
      association: t('screens.register.selectAssociation'),
      church: t('screens.register.selectChurch'),
      club: t('screens.register.selectClub'),
    },
  };
}

const RegisterScreen = (): React.JSX.Element => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { colors, spacing } = useTheme();
  const [classModalVisible, setClassModalVisible] = useState(false);
  const formHook = useRegisterForm();
  const clubHierarchy = useClubHierarchy();
  const labels = useRegisterLabels(t);
  const styles = useMemo(() => createStyles(colors, spacing), [colors, spacing]);

  if (clubHierarchy.loadingClubs) {
    return <LoadingState message={t('common.loadingClubs')} />;
  }

  const { form } = formHook;
  const keyboardBehavior =
    Platform.OS === PLATFORM_OS.IOS ? KEYBOARD_BEHAVIOR.PADDING : KEYBOARD_BEHAVIOR.HEIGHT;
  const buttonTitle = form.loading
    ? t('screens.register.creatingAccount')
    : t('screens.register.registerButton');

  return (
    <SafeAreaView style={styles.safeArea} edges={SAFE_AREA_EDGES.TOP_LEFT_RIGHT}>
      <KeyboardAvoidingView style={styles.container} behavior={keyboardBehavior}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <RegisterHeader
            title={t('screens.register.title')}
            subtitle={t('screens.register.subtitle')}
          />
          <RegisterFormContent
            form={form}
            formHook={formHook}
            clubHierarchy={clubHierarchy}
            personalLabels={labels.personal}
            passwordLabels={labels.password}
            hierarchyLabels={labels.hierarchy}
            buttonTitle={buttonTitle}
            onOpenClassModal={(): void => setClassModalVisible(true)}
            onNavigateToLogin={(): void => navigation.navigate(SCREENS.LOGIN as never)}
            t={t}
          />
        </ScrollView>
        <ClassSelectionModal
          visible={classModalVisible}
          initialClasses={form.selectedClasses}
          onSave={(classes): void => formHook.setSelectedClasses(classes)}
          onClose={(): void => setClassModalVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Form content extracted to reduce main component size
interface FormContentProps {
  form: ReturnType<typeof useRegisterForm>['form'];
  formHook: ReturnType<typeof useRegisterForm>;
  clubHierarchy: ReturnType<typeof useClubHierarchy>;
  personalLabels: { name: string; email: string; whatsapp: string };
  passwordLabels: { password: string; confirmPassword: string };
  hierarchyLabels: {
    division: string;
    union: string;
    association: string;
    church: string;
    club: string;
  };
  buttonTitle: string;
  onOpenClassModal: () => void;
  onNavigateToLogin: () => void;
  t: ReturnType<typeof useTranslation>['t'];
}

function RegisterFormContent(props: FormContentProps): React.JSX.Element {
  const {
    form,
    formHook,
    clubHierarchy,
    personalLabels,
    passwordLabels,
    hierarchyLabels,
    buttonTitle,
    onOpenClassModal,
    onNavigateToLogin,
    t,
  } = props;

  return (
    <View style={styles.form}>
      <PersonalInfoInputs
        name={form.name}
        email={form.email}
        whatsappNumber={form.whatsappNumber}
        setName={formHook.setName}
        setEmail={formHook.setEmail}
        setWhatsappNumber={formHook.setWhatsappNumber}
        labels={personalLabels}
      />
      <AccountTypeSection
        isClubAdmin={form.isClubAdmin}
        onToggle={(): void => formHook.setIsClubAdmin(!form.isClubAdmin)}
        sectionTitle={t('screens.register.accountType')}
        checkboxLabel={t('screens.register.iAmClubAdmin')}
        infoText={t('screens.register.clubAdminApprovalNote')}
      />
      <ClubHierarchySection
        sectionTitle={t('screens.register.findYourClub')}
        description={t('screens.register.navigateOrganization')}
        labels={hierarchyLabels}
        hierarchy={clubHierarchy.hierarchy}
        divisions={clubHierarchy.getUniqueDivisions()}
        unions={clubHierarchy.getUniqueUnions()}
        associations={clubHierarchy.getUniqueAssociations()}
        churches={clubHierarchy.getUniqueChurches()}
        filteredClubs={clubHierarchy.getFilteredClubs()}
        onDivisionChange={clubHierarchy.handleDivisionChange}
        onUnionChange={clubHierarchy.handleUnionChange}
        onAssociationChange={clubHierarchy.handleAssociationChange}
        onChurchChange={clubHierarchy.handleChurchChange}
        onClubSelect={clubHierarchy.setClubId}
      />
      {!form.isClubAdmin && (
        <ClassSelectionSection
          selectedClasses={form.selectedClasses}
          onOpenModal={onOpenClassModal}
          sectionTitle={t('screens.register.pathfinderClasses')}
          description={t('screens.register.selectClassesInstruction')}
          selectText={t('screens.register.selectClasses')}
          selectedText={t('screens.register.selectedClasses')}
        />
      )}
      <PasswordInputs
        password={form.password}
        confirmPassword={form.confirmPassword}
        setPassword={formHook.setPassword}
        setConfirmPassword={formHook.setConfirmPassword}
        labels={passwordLabels}
      />
      <Button
        title={buttonTitle}
        onPress={(): void => formHook.handleRegister(clubHierarchy.hierarchy.clubId)}
        disabled={form.loading}
        loading={form.loading}
        icon={ICONS.ACCOUNT_PLUS}
      />
      <Button
        title={t('screens.register.alreadyHaveAccount')}
        variant={COMPONENT_VARIANT.ghost}
        onPress={onNavigateToLogin}
      />
    </View>
  );
}

/**
 * Styles factory - Creates styles using theme values
 * ✅ COMPLIANT: Uses theme values via useTheme() hook
 */
const createStyles = (
  colors: ThemeContextType['colors'],
  spacing: ThemeContextType['spacing']
): ReturnType<typeof StyleSheet.create> =>
  StyleSheet.create({
    safeArea: {
      flex: FLEX.ONE,
      backgroundColor: colors.backgroundPrimary,
    },
    container: {
      flex: FLEX.ONE,
      backgroundColor: colors.backgroundPrimary,
    },
    scrollContent: {
      flexGrow: FLEX.ONE,
      padding: spacing.lg,
      paddingTop: spacing['3xl'],
    },
    form: {
      width: DIMENSIONS.MAX_WIDTH_PERCENT.FULL,
    },
  });

export default RegisterScreen;
