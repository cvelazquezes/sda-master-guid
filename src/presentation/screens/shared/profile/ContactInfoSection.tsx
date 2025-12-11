import React, { useMemo } from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createContactInfoStyles } from './styles';
import { COMPONENT_VARIANT, ICONS, LIST_SEPARATOR } from '../../../../shared/constants';
import { Card, SectionHeader, Text } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';
import type { User } from '../../../../types';

type ContactInfoSectionProps = {
  user: User | null;
  colors: { border: string; primary: string; textSecondary: string; textPrimary: string };
  t: (key: string) => string;
};

function DetailRow({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  borderColor,
  styles,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  borderColor: string;
  styles: ReturnType<typeof createContactInfoStyles>;
}): React.JSX.Element {
  const { iconSizes } = useTheme();
  return (
    <View style={[styles.detailRow, { borderBottomColor: borderColor }]}>
      <View style={[styles.detailIconContainer, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons
          name={icon as typeof ICONS.EMAIL}
          size={iconSizes.lg}
          color={iconColor}
        />
      </View>
      <View style={styles.detailText}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

export function ContactInfoSection({
  user,
  colors,
  t,
}: ContactInfoSectionProps): React.JSX.Element | null {
  const { colors: themeColors, spacing, radii, typography } = useTheme();
  const styles = useMemo(
    () => createContactInfoStyles(themeColors, spacing, radii, typography),
    [themeColors, spacing, radii, typography]
  );

  const hasWhatsapp = !!user?.whatsappNumber;
  const hasClasses = user?.classes && user.classes.length > 0;
  if (!hasWhatsapp && !hasClasses) {
    return null;
  }

  const whatsappBg = `${themeColors.success}20`;
  const whatsappColor = themeColors.success;

  return (
    <View style={styles.section}>
      <SectionHeader title={t('screens.profile.contactInfo')} />
      <Card variant={COMPONENT_VARIANT.elevated}>
        <View style={styles.detailsContainer}>
          {hasWhatsapp && (
            <DetailRow
              icon={ICONS.WHATSAPP}
              iconBg={whatsappBg}
              iconColor={whatsappColor}
              label={t('screens.profile.whatsApp')}
              value={user.whatsappNumber}
              borderColor={colors.border}
              styles={styles}
            />
          )}
          {hasClasses && (
            <DetailRow
              icon={ICONS.SCHOOL}
              iconBg={`${colors.primary}20`}
              iconColor={colors.primary}
              label={t('screens.profile.pathfinderClasses')}
              value={user.classes.join(LIST_SEPARATOR)}
              borderColor="transparent"
              styles={styles}
            />
          )}
        </View>
      </Card>
    </View>
  );
}
