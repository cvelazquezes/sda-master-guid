import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { mobileIconSizes, designTokens } from '../../../shared/theme';
import { A11Y_ROLE, ICONS, TOUCH_OPACITY } from '../../../shared/constants';
import { OrganizationItem } from './types';
import { cardStyles } from './styles';
import { getTypeIcon, getTypeColor } from './orgUtils';

interface OrgCardProps {
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
}

function CardHeader({
  org,
  iconName,
  iconColor,
  deleteLabel,
  colors,
  onDelete,
}: {
  org: OrganizationItem;
  iconName: string;
  iconColor: string;
  deleteLabel: string;
  colors: OrgCardProps['colors'];
  onDelete: () => void;
}): React.JSX.Element {
  return (
    <View style={cardStyles.header}>
      <View style={cardStyles.title}>
        <MaterialCommunityIcons
          name={iconName as typeof ICONS.CHECK}
          size={mobileIconSizes.medium}
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
        onPress={onDelete}
        accessibilityRole={A11Y_ROLE.BUTTON}
        accessibilityLabel={deleteLabel}
      >
        <MaterialCommunityIcons
          name={ICONS.DELETE_OUTLINE}
          size={designTokens.iconSize.md}
          color={colors.error}
        />
      </TouchableOpacity>
    </View>
  );
}

export function OrgCard({ org, onEdit, onDelete, colors, t }: OrgCardProps): React.JSX.Element {
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
      onPress={(): void => onEdit(org)}
    >
      <CardHeader
        org={org}
        iconName={iconName}
        iconColor={iconColor}
        deleteLabel={deleteLabel}
        colors={colors}
        onDelete={(): void => onDelete(org)}
      />
      <View style={[cardStyles.footer, { borderTopColor: colors.border }]}>
        <MaterialCommunityIcons
          name={ICONS.ACCOUNT_GROUP}
          size={designTokens.iconSize.xs}
          color={colors.textTertiary}
        />
        <Text style={[cardStyles.clubCount, { color: colors.textSecondary }]}>
          {t(countKey, { count: org.clubCount })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
