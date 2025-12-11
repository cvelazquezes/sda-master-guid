import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getTypeIcon, getTypeColor } from './orgUtils';
import { createCardStyles } from './styles';
import { A11Y_ROLE, ICONS, TOUCH_OPACITY } from '../../../../shared/constants';
import { Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import type { OrganizationItem } from './types';

type OrgCardProps = {
  org: OrganizationItem;
  onEdit: (org: OrganizationItem) => void;
  onDelete: (org: OrganizationItem) => void;
  colors: {
    primary: string;
    info: string;
    warning: string;
    success: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    error: string;
    surface: string;
  };
  t: (key: string, opts?: Record<string, unknown>) => string;
};

type CardStylesType = ReturnType<typeof createCardStyles>;

function CardHeader({
  org,
  iconName,
  iconColor,
  deleteLabel,
  colors,
  onDelete,
  cardStyles,
}: {
  org: OrganizationItem;
  iconName: string;
  iconColor: string;
  deleteLabel: string;
  colors: OrgCardProps['colors'];
  onDelete: () => void;
  cardStyles: CardStylesType;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={cardStyles.header}>
      <View style={cardStyles.title}>
        <MaterialCommunityIcons
          name={iconName as typeof ICONS.CHECK}
          size={iconSizes.md}
          color={iconColor}
        />
        <View style={cardStyles.info}>
          <Text style={[cardStyles.name, { color: colors.textPrimary }]}>{org.name}</Text>
          {org.parent && (
            <Text style={[cardStyles.parent, { color: colors.textSecondary }]}>{org.parent}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={cardStyles.deleteButton}
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={deleteLabel}
        onPress={onDelete}
      >
        <MaterialCommunityIcons
          name={ICONS.DELETE_OUTLINE}
          size={iconSizes.md}
          color={colors.error}
        />
      </TouchableOpacity>
    </View>
  );
}

export function OrgCard({ org, onEdit, onDelete, colors, t }: OrgCardProps): React.JSX.Element {
  const { iconSizes, colors: themeColors, spacing, radii, typography } = useTheme();

  const cardStyles = useMemo(
    () => createCardStyles(themeColors, spacing, radii, typography),
    [themeColors, spacing, radii, typography]
  );

  const iconName = getTypeIcon(org.type);
  const iconColor = getTypeColor(org.type, colors);
  const deleteLabel = t('screens.organizationManagement.deleteItem', { name: org.name });
  const countKey =
    org.clubCount === 1
      ? 'screens.organizationManagement.clubCount'
      : 'screens.organizationManagement.clubCountPlural';

  return (
    <TouchableOpacity
      style={[cardStyles.card, { backgroundColor: colors.surface }]}
      activeOpacity={TOUCH_OPACITY.default}
      accessibilityRole="button"
      accessibilityLabel={`Edit ${org.name}`}
      onPress={(): void => onEdit(org)}
    >
      <CardHeader
        org={org}
        iconName={iconName}
        iconColor={iconColor}
        deleteLabel={deleteLabel}
        colors={colors}
        cardStyles={cardStyles}
        onDelete={(): void => onDelete(org)}
      />
      <View style={[cardStyles.footer, { borderTopColor: colors.border }]}>
        <MaterialCommunityIcons
          name={ICONS.ACCOUNT_GROUP}
          size={iconSizes.xs}
          color={colors.textTertiary}
        />
        <Text style={[cardStyles.clubCount, { color: colors.textSecondary }]}>
          {t(countKey, { count: org.clubCount })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
