import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, Card, SectionHeader } from '../../../components/primitives';
import { User } from '../../../../types';
import { useTheme } from '../../../state/ThemeContext';
import { ICONS, COMPONENT_VARIANT, LIST_SEPARATOR } from '../../../../shared/constants';
import { contactInfoStyles as styles } from './styles';

interface ContactInfoSectionProps {
  user: User | null;
  colors: { border: string; primary: string; textSecondary: string; textPrimary: string };
  t: (key: string) => string;
}

function DetailRow({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  borderColor,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  borderColor: string;
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
  const { colors: themeColors } = useTheme();
  const hasWhatsapp = !!user?.whatsappNumber;
  const hasClasses = user?.classes && user.classes.length > 0;
  if (!hasWhatsapp && !hasClasses) {
    return null;
  }

  const whatsappBg = themeColors.success + '20';
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
            />
          )}
          {hasClasses && (
            <DetailRow
              icon={ICONS.SCHOOL}
              iconBg={colors.primary + '20'}
              iconColor={colors.primary}
              label={t('screens.profile.pathfinderClasses')}
              value={user.classes.join(LIST_SEPARATOR)}
              borderColor="transparent"
            />
          )}
        </View>
      </Card>
    </View>
  );
}
