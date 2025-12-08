import React from 'react';
import { Input } from '../../../components/primitives';
import { AUTO_CAPITALIZE, AUTO_COMPLETE, ICONS, KEYBOARD_TYPE } from '../../../../shared/constants';

interface PersonalInfoInputsProps {
  name: string;
  email: string;
  whatsappNumber: string;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setWhatsappNumber: (v: string) => void;
  labels: { name: string; email: string; whatsapp: string };
  t: (key: string) => string;
}

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
        label={labels.name}
        icon={ICONS.ACCOUNT}
        placeholder={t('auth.fullName')}
        value={name}
        onChangeText={setName}
        autoCapitalize={AUTO_CAPITALIZE.WORDS}
        required
      />

      <Input
        label={labels.email}
        icon={ICONS.EMAIL}
        placeholder={t('auth.enterEmail')}
        value={email}
        onChangeText={setEmail}
        keyboardType={KEYBOARD_TYPE.EMAIL}
        autoCapitalize={AUTO_CAPITALIZE.NONE}
        autoComplete={AUTO_COMPLETE.EMAIL}
        required
      />

      <Input
        label={labels.whatsapp}
        icon={ICONS.WHATSAPP}
        placeholder={t('auth.whatsappNumber')}
        value={whatsappNumber}
        onChangeText={setWhatsappNumber}
        keyboardType={KEYBOARD_TYPE.PHONE}
        autoCapitalize={AUTO_CAPITALIZE.NONE}
        required
      />
    </>
  );
}

interface PasswordInputsProps {
  password: string;
  confirmPassword: string;
  setPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  labels: { password: string; confirmPassword: string };
  t: (key: string) => string;
}

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
        label={labels.password}
        icon={ICONS.LOCK}
        placeholder={t('auth.enterPassword')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize={AUTO_CAPITALIZE.NONE}
        required
      />

      <Input
        label={labels.confirmPassword}
        icon={ICONS.LOCK_CHECK}
        placeholder={t('auth.confirmPassword')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize={AUTO_CAPITALIZE.NONE}
        required
      />
    </>
  );
}
