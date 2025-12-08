import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { useTheme } from '../../../contexts/ThemeContext';
import { ICONS, FILTER_STATUS, HIERARCHY_FIELDS } from '../../../shared/constants';
import { filterStyles } from './styles';

interface StatusFilterSectionProps {
  currentStatus: string;
  onSelectStatus: (field: string, value: string) => void;
  colors: { primary: string; success: string; error: string; textSecondary: string };
  t: (key: string) => string;
}

export function StatusFilterSection({
  currentStatus,
  onSelectStatus,
  colors,
  t,
}: StatusFilterSectionProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  const statusOptions = [
    {
      id: FILTER_STATUS.ALL,
      label: t('screens.clubsManagement.allClubs'),
      icon: ICONS.ACCOUNT_GROUP,
      color: colors.textSecondary,
    },
    {
      id: FILTER_STATUS.ACTIVE,
      label: t('screens.clubsManagement.activeOnly'),
      icon: ICONS.CHECK_CIRCLE,
      color: colors.success,
    },
    {
      id: FILTER_STATUS.INACTIVE,
      label: t('screens.clubsManagement.inactiveOnly'),
      icon: ICONS.CANCEL,
      color: colors.error,
    },
  ];

  return (
    <View style={filterStyles.section}>
      <Text style={filterStyles.sectionTitle}>
        {t('screens.clubsManagement.clubStatusSection')}
      </Text>
      {statusOptions.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[filterStyles.option, currentStatus === option.id && filterStyles.optionActive]}
          onPress={(): void => onSelectStatus(HIERARCHY_FIELDS.STATUS, option.id)}
        >
          <View style={filterStyles.optionContent}>
            <MaterialCommunityIcons
              name={option.icon as typeof ICONS.CHECK}
              size={iconSizes.md}
              color={currentStatus === option.id ? colors.primary : option.color}
            />
            <Text
              style={[
                filterStyles.optionText,
                currentStatus === option.id && filterStyles.optionTextActive,
              ]}
            >
              {option.label}
            </Text>
          </View>
          {currentStatus === option.id && (
            <MaterialCommunityIcons name={ICONS.CHECK} size={iconSizes.md} color={colors.primary} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}
