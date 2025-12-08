import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, SectionHeader, Card } from '../../../shared/components';
import { useTheme } from '../../../contexts/ThemeContext';
import { ICONS } from '../../../shared/constants';
import { styles } from './styles';

interface ContactInfoSectionProps {
  email?: string;
  whatsappNumber?: string;
  colors: {
    border: string;
    primary: string;
    success: string;
    textSecondary: string;
    textPrimary: string;
  };
  t: (key: string) => string;
}

export function ContactInfoSection({
  email,
  whatsappNumber,
  colors,
  t,
}: ContactInfoSectionProps): React.JSX.Element {
  const { iconSizes } = useTheme();
  const emailBg = colors.primary + '20';
  const whatsappBg = colors.success + '20';

  return (
    <View style={styles.section}>
      <SectionHeader title={t('screens.account.contactInformation')} />
      <Card variant="elevated">
        <View style={styles.detailsContainer}>
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.detailIconContainer, { backgroundColor: emailBg }]}>
              <MaterialCommunityIcons
                name={ICONS.EMAIL_OUTLINE}
                size={iconSizes.md}
                color={colors.primary}
              />
            </View>
            <View style={styles.detailText}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                {t('screens.account.emailAddress')}
              </Text>
              <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                {email || t('common.notSet')}
              </Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={[styles.detailIconContainer, { backgroundColor: whatsappBg }]}>
              <MaterialCommunityIcons
                name={ICONS.WHATSAPP}
                size={iconSizes.md}
                color={colors.success}
              />
            </View>
            <View style={styles.detailText}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                {t('screens.account.whatsAppNumber')}
              </Text>
              <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                {whatsappNumber || t('common.notSet')}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
}
