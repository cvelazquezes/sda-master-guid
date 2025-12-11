import React from 'react';
import { AUTO_CAPITALIZE, AUTO_COMPLETE, ICONS, KEYBOARD_TYPE } from '../../../../shared/constants';
import { Input } from '../../../components/primitives';

type PersonalInfoInputsProps = {
  name: string;
  email: string;
  whatsappNumber: string;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setWhatsappNumber: (v: string) => void;
  labels: { name: string; email: string; whatsapp: string };
  t: (key: string) => string;
};

export function PersonalInfoInputs({
  name,
  email,
  whatsappNumber,
  setName,
  setEmail,
  setWhatsappNumber,
  labels,
  t,
}: PersonalInfoInputsProps): React.JSX.Element {
  return (
    <>
      <Input
        required
        label={labels.name}
        icon={ICONS.ACCOUNT}
        placeholder={t('auth.fullName')}
        value={name}
        autoCapitalize={AUTO_CAPITALIZE.WORDS}
        accessibilityHint="Required field"
        onChangeText={setName}
      />

      <Input
        required
        label={labels.email}
        icon={ICONS.EMAIL}
        placeholder={t('auth.enterEmail')}
        value={email}
        keyboardType={KEYBOARD_TYPE.EMAIL}
        autoCapitalize={AUTO_CAPITALIZE.NONE}
        autoComplete={AUTO_COMPLETE.EMAIL}
        accessibilityHint="Required field"
        onChangeText={setEmail}
      />

      <Input
        required
        label={labels.whatsapp}
        icon={ICONS.WHATSAPP}
        placeholder={t('auth.whatsappNumber')}
        value={whatsappNumber}
        keyboardType={KEYBOARD_TYPE.PHONE}
        autoCapitalize={AUTO_CAPITALIZE.NONE}
        accessibilityHint="Required field"
        onChangeText={setWhatsappNumber}
      />
    </>
  );
}

type PasswordInputsProps = {
  password: string;
  confirmPassword: string;
  setPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  labels: { password: string; confirmPassword: string };
  t: (key: string) => string;
};

export function PasswordInputs({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  labels,
  t,
}: PasswordInputsProps): React.JSX.Element {
  return (
    <>
      <Input
        secureTextEntry
        required
        label={labels.password}
        icon={ICONS.LOCK}
        placeholder={t('auth.enterPassword')}
        value={password}
        autoCapitalize={AUTO_CAPITALIZE.NONE}
        accessibilityHint="Required field"
        onChangeText={setPassword}
      />

      <Input
        secureTextEntry
        required
        label={labels.confirmPassword}
        icon={ICONS.LOCK_CHECK}
        placeholder={t('auth.confirmPassword')}
        value={confirmPassword}
        autoCapitalize={AUTO_CAPITALIZE.NONE}
        accessibilityHint="Required field"
        onChangeText={setConfirmPassword}
      />
    </>
  );
}
