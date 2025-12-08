import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import { A11Y_ROLE, ORGANIZATION_TYPES, OrganizationType, ICONS } from '../../../../shared/constants';
import { createStyles } from './styles';
import { getTypeLabel, getTypeIcon, getTypeColor } from './orgUtils';

interface TypeSelectorProps {
  selectedType: OrganizationType;
  onSelectType: (type: OrganizationType) => void;
  colors: { primary: string; info: string; warning: string; success: string; textInverse: string };
  t: (key: string, opts?: Record<string, unknown>) => string;
}

export function TypeSelector({
  selectedType,
  onSelectType,
  colors,
  t,
}: TypeSelectorProps): React.JSX.Element {
  const { colors: themeColors, spacing, iconSizes } = useTheme();
  const styles = useMemo(() => createStyles(themeColors, spacing), [themeColors, spacing]);

  const renderBtn = (type: OrganizationType): React.JSX.Element => {
    const isSelected = selectedType === type;
    const label = getTypeLabel(type, t);
    const iconColor = isSelected ? colors.textInverse : getTypeColor(type, colors);
    const btnStyle = [styles.typeButton, isSelected && styles.typeButtonActive];
    const txtStyle = [styles.typeButtonText, isSelected && styles.typeButtonTextActive];
    return (
      <TouchableOpacity
        key={type}
        style={btnStyle}
        onPress={(): void => onSelectType(type)}
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={t('screens.organizationManagement.viewTypes', { type: label })}
        accessibilityState={{ selected: isSelected }}
      >
        <MaterialCommunityIcons
          name={getTypeIcon(type) as typeof ICONS.CHECK}
          size={iconSizes.md}
          color={iconColor}
        />
        <Text style={txtStyle}>{label}s</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.typeSelectorContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.typeSelector}
      >
        {ORGANIZATION_TYPES.map(renderBtn)}
      </ScrollView>
    </View>
  );
}
