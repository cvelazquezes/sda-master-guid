import React, { useMemo } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createClubPickerStyles } from './styles';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import { ICONS } from '../../../../shared/constants';
import type { Club } from '../../../../types';

type ClubPickerProps = {
  label: string;
  clubs: Club[];
  selectedClubId: string;
  onSelect: (clubId: string) => void;
};

export function ClubPicker({
  label,
  clubs,
  selectedClubId,
  onSelect,
}: ClubPickerProps): React.JSX.Element {
  const { colors, spacing, radii, typography, iconSizes } = useTheme();

  const clubPickerStyles = useMemo(
    () => createClubPickerStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );

  return (
    <View style={clubPickerStyles.container}>
      <Text style={clubPickerStyles.label}>{label}</Text>
      <ScrollView style={clubPickerStyles.clubsList}>
        {clubs.map((club) => {
          const isSelected = selectedClubId === club.id;
          const iconName = isSelected ? ICONS.RADIOBOX_MARKED : ICONS.RADIOBOX_BLANK;
          const iconColor = isSelected ? colors.primary : colors.textSecondary;
          return (
            <TouchableOpacity
              key={club.id}
              style={[
                clubPickerStyles.clubOption,
                isSelected && clubPickerStyles.clubOptionSelected,
              ]}
              onPress={(): void => onSelect(club.id)}
            >
              <MaterialCommunityIcons name={iconName} size={iconSizes.md} color={iconColor} />
              <View style={clubPickerStyles.clubInfo}>
                <Text style={clubPickerStyles.clubName}>{club.name}</Text>
                <Text style={clubPickerStyles.clubDescription}>{club.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
