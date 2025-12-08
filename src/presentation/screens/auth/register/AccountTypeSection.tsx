import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createSectionStyles, createAccountTypeStyles } from './styles';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import { ICONS } from '../../../../shared/constants';

type AccountTypeSectionProps = {
  isClubAdmin: boolean;
  onToggle: () => void;
  sectionTitle: string;
  checkboxLabel: string;
  infoText: string;
};

export function AccountTypeSection({
  isClubAdmin,
  onToggle,
  sectionTitle,
  checkboxLabel,
  infoText,
}: AccountTypeSectionProps): React.JSX.Element {
  const { colors, spacing, radii, typography, iconSizes } = useTheme();

  const sectionStyles = useMemo(
    () => createSectionStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );
  const accountTypeStyles = useMemo(
    () => createAccountTypeStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );

  const checkboxIcon = isClubAdmin ? ICONS.CHECKBOX_MARKED : ICONS.CHECKBOX_BLANK_OUTLINE;

  return (
    <>
      <View style={sectionStyles.header}>
        <MaterialCommunityIcons
          name={ICONS.ACCOUNT_COG}
          size={iconSizes.md}
          color={colors.primary}
        />
        <Text style={sectionStyles.title}>{sectionTitle}</Text>
      </View>
      <TouchableOpacity style={accountTypeStyles.checkboxContainer} onPress={onToggle}>
        <MaterialCommunityIcons name={checkboxIcon} size={iconSizes.lg} color={colors.primary} />
        <Text style={accountTypeStyles.checkboxLabel}>{checkboxLabel}</Text>
      </TouchableOpacity>
      {isClubAdmin && (
        <View style={accountTypeStyles.infoBox}>
          <MaterialCommunityIcons name={ICONS.INFORMATION} size={iconSizes.md} color={colors.info} />
          <Text style={accountTypeStyles.infoText}>{infoText}</Text>
        </View>
      )}
    </>
  );
}
