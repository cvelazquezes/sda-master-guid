import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { PathfinderClass, PATHFINDER_CLASSES } from '../../../types';
import { EMPTY_VALUE, MESSAGES } from '../../../shared/constants';
import { validateRegistration } from './registerValidation';

interface FormState {
  name: string;
  email: string;
  whatsappNumber: string;
  password: string;
  confirmPassword: string;
  isClubAdmin: boolean;
  selectedClasses: PathfinderClass[];
  loading: boolean;
}

export interface UseRegisterFormReturn {
  form: FormState;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setWhatsappNumber: (v: string) => void;
  setPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  setIsClubAdmin: (v: boolean) => void;
  setSelectedClasses: (v: PathfinderClass[]) => void;
  handleRegister: (clubId: string) => Promise<void>;
}

export function useRegisterForm(): UseRegisterFormReturn {
  const [name, setName] = useState(EMPTY_VALUE);
  const [email, setEmail] = useState(EMPTY_VALUE);
  const [whatsappNumber, setWhatsappNumber] = useState(EMPTY_VALUE);
  const [password, setPassword] = useState(EMPTY_VALUE);
  const [confirmPassword, setConfirmPassword] = useState(EMPTY_VALUE);
  const [isClubAdmin, setIsClubAdmin] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<PathfinderClass[]>([
    PATHFINDER_CLASSES[0],
  ]);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async (clubId: string): Promise<void> => {
    const formData = {
      name,
      email,
      whatsappNumber,
      password,
      confirmPassword,
      isClubAdmin,
      selectedClasses,
      clubId,
    };
    if (!validateRegistration(formData)) {
      return;
    }
    setLoading(true);
    const classes = isClubAdmin ? [] : selectedClasses;
    try {
      await register(email, password, name, whatsappNumber, clubId, classes, isClubAdmin);
    } catch {
      Alert.alert(MESSAGES.TITLES.REGISTRATION_FAILED, MESSAGES.ERRORS.REGISTRATION_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const form = {
    name,
    email,
    whatsappNumber,
    password,
    confirmPassword,
    isClubAdmin,
    selectedClasses,
    loading,
  };

  return {
    form,
    setName,
    setEmail,
    setWhatsappNumber,
    setPassword,
    setConfirmPassword,
    setIsClubAdmin,
    setSelectedClasses,
    handleRegister,
  };
}
