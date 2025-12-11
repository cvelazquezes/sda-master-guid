import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getNextSaturday, getNextSunday } from './dateUtils';
import { createMeetingInfoStyles } from './styles';
import { DATE_LOCALE_OPTIONS, ICONS, SINGLE_SPACE } from '../../../../shared/constants';
import { Text, Input } from '../../../components/primitives';
import { useTheme } from '../../../state/ThemeContext';

type MeetingInfoSectionProps = {
  meetingDate: Date;
  setMeetingDate: (d: Date) => void;
  meetingTitle: string;
  setMeetingTitle: (t: string) => void;
  totalTime: number;
  t: (key: string) => string;
};

export function MeetingInfoSection({
  meetingDate,
  setMeetingDate,
  meetingTitle,
  setMeetingTitle,
  totalTime,
  t,
}: MeetingInfoSectionProps): React.JSX.Element {
  const { iconSizes, colors, spacing, radii, typography } = useTheme();

  const meetingInfoStyles = useMemo(
    () => createMeetingInfoStyles(colors, spacing, radii, typography),
    [colors, spacing, radii, typography]
  );

  const dateStr = meetingDate.toLocaleDateString(undefined, DATE_LOCALE_OPTIONS.FULL_DATE);

  return (
    <>
      <View style={meetingInfoStyles.section}>
        <View style={meetingInfoStyles.row}>
          <MaterialCommunityIcons
            name={ICONS.CALENDAR}
            size={iconSizes.md}
            color={colors.primary}
          />
          <Text style={meetingInfoStyles.label}>{t('screens.meetingPlanner.meetingDate')}</Text>
          <Text style={meetingInfoStyles.date}>{dateStr}</Text>
        </View>
        <View style={meetingInfoStyles.quickDateButtons}>
          <TouchableOpacity
            style={meetingInfoStyles.quickDateButton}
            accessibilityRole="button"
            accessibilityLabel="Set next Saturday"
            onPress={(): void => setMeetingDate(getNextSaturday())}
          >
            <Text style={meetingInfoStyles.quickDateText}>
              {t('screens.meetingPlanner.nextSaturday')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={meetingInfoStyles.quickDateButton}
            accessibilityRole="button"
            accessibilityLabel="Set next Sunday"
            onPress={(): void => setMeetingDate(getNextSunday())}
          >
            <Text style={meetingInfoStyles.quickDateText}>
              {t('screens.meetingPlanner.nextSunday')}
            </Text>
          </TouchableOpacity>
        </View>
        <Input
          value={meetingTitle}
          placeholder={t('screens.meetingPlanner.titlePlaceholder')}
          onChangeText={setMeetingTitle}
        />
      </View>
      <View style={meetingInfoStyles.totalTimeBanner}>
        <MaterialCommunityIcons
          name={ICONS.CLOCK_OUTLINE}
          size={iconSizes.md}
          color={colors.primary}
        />
        <Text style={meetingInfoStyles.totalTimeText}>
          Total Meeting Time:{SINGLE_SPACE}
          <Text style={meetingInfoStyles.totalTimeBold}>{totalTime} minutes</Text>
        </Text>
      </View>
    </>
  );
}
