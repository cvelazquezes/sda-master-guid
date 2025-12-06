import React from 'react';
// eslint-disable-next-line no-restricted-imports
import { View, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../shared/components';
import { mobileIconSizes, designTokens } from '../../../shared/theme';
import { DATE_LOCALE_OPTIONS, ICONS } from '../../../shared/constants';
import { meetingInfoStyles } from './styles';
import { getNextSaturday, getNextSunday } from './dateUtils';

interface MeetingInfoSectionProps {
  meetingDate: Date;
  setMeetingDate: (d: Date) => void;
  meetingTitle: string;
  setMeetingTitle: (t: string) => void;
  totalTime: number;
  t: (key: string) => string;
}

export function MeetingInfoSection({
  meetingDate,
  setMeetingDate,
  meetingTitle,
  setMeetingTitle,
  totalTime,
  t,
}: MeetingInfoSectionProps): React.JSX.Element {
  const dateStr = meetingDate.toLocaleDateString(undefined, DATE_LOCALE_OPTIONS.FULL_DATE);

  return (
    <>
      <View style={meetingInfoStyles.section}>
        <View style={meetingInfoStyles.row}>
          <MaterialCommunityIcons
            name={ICONS.CALENDAR}
            size={mobileIconSizes.medium}
            color={designTokens.colors.primary}
          />
          <Text style={meetingInfoStyles.label}>{t('screens.meetingPlanner.meetingDate')}</Text>
          <Text style={meetingInfoStyles.date}>{dateStr}</Text>
        </View>
        <View style={meetingInfoStyles.quickDateButtons}>
          <TouchableOpacity
            style={meetingInfoStyles.quickDateButton}
            onPress={(): void => setMeetingDate(getNextSaturday())}
          >
            <Text style={meetingInfoStyles.quickDateText}>
              {t('screens.meetingPlanner.nextSaturday')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={meetingInfoStyles.quickDateButton}
            onPress={(): void => setMeetingDate(getNextSunday())}
          >
            <Text style={meetingInfoStyles.quickDateText}>
              {t('screens.meetingPlanner.nextSunday')}
            </Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={meetingInfoStyles.titleInput}
          value={meetingTitle}
          onChangeText={setMeetingTitle}
          placeholder={t('screens.meetingPlanner.titlePlaceholder')}
        />
      </View>
      <View style={meetingInfoStyles.totalTimeBanner}>
        <MaterialCommunityIcons
          name={ICONS.CLOCK_OUTLINE}
          size={mobileIconSizes.medium}
          color={designTokens.colors.primary}
        />
        <Text style={meetingInfoStyles.totalTimeText}>
          Total Meeting Time:{' '}
          <Text style={meetingInfoStyles.totalTimeBold}>{totalTime} minutes</Text>
        </Text>
      </View>
    </>
  );
}
