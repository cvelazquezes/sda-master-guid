import React from 'react';
import { StandardInput } from '../../../shared/components';
import {
  AUTO_CAPITALIZE,
  AUTO_COMPLETE,
  ICONS,
  KEYBOARD_TYPE,
  MESSAGES,
} from '../../../shared/constants';

interface PersonalInfoInputsProps {
  name: string;
  email: string;
  whatsappNumber: string;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setWhatsappNumber: (v: string) => void;
  labels: { name: string; email: string; whatsapp: string };
}

export function PersonalInfoInputs({
  name,
  email,
  whatsappNumber,
  setName,
  setEmail,
  setWhatsappNumber,
  labels,
}: PersonalInfoInputsProps): React.JSX.Element {
  return (
    <>
      <StandardInput
        label={labels.name}
        icon={ICONS.ACCOUNT}
        placeholder={MESSAGES.PLACEHOLDERS.FULL_NAME}
        value={name}
        onChangeText={setName}
        autoCapitalize={AUTO_CAPITALIZE.WORDS}
        required
      />

      <StandardInput
        label={labels.email}
        icon={ICONS.EMAIL}
        placeholder={MESSAGES.PLACEHOLDERS.EMAIL}
        value={email}
        onChangeText={setEmail}
        keyboardType={KEYBOARD_TYPE.EMAIL}
        autoCapitalize={AUTO_CAPITALIZE.NONE}
        autoComplete={AUTO_COMPLETE.EMAIL}
        required
      />

      <StandardInput
        label={labels.whatsapp}
        icon={ICONS.WHATSAPP}
        placeholder={MESSAGES.PLACEHOLDERS.WHATSAPP}
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
}

export function PasswordInputs({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  labels,
}: PasswordInputsProps): React.JSX.Element {
  return (
    <>
      <StandardInput
        label={labels.password}
        icon={ICONS.LOCK}
        placeholder={MESSAGES.PLACEHOLDERS.PASSWORD}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize={AUTO_CAPITALIZE.NONE}
        required
      />

      <StandardInput
        label={labels.confirmPassword}
        icon={ICONS.LOCK_CHECK}
        placeholder={MESSAGES.PLACEHOLDERS.CONFIRM_PASSWORD}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize={AUTO_CAPITALIZE.NONE}
        required
      />
    </>
  );
}
