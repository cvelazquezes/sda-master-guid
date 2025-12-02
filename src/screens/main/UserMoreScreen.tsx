/**
 * UserMoreScreen
 * More options screen for regular club members
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { ScreenHeader, MenuCard, SectionHeader } from '../../shared/components';
import { designTokens } from '../../shared/theme/designTokens';

const UserMoreScreen = () => {
  const { colors } = useTheme();

  const clubItems = [
    {
      id: 'club-info',
      title: 'Club Information',
      description: 'View your club details and hierarchy',
      icon: 'information',
      screen: null,
      color: colors.info,
      disabled: true,
    },
    {
      id: 'contact-admin',
      title: 'Contact Club Admin',
      description: 'Get in touch with your club administrator',
      icon: 'message-text',
      screen: null,
      color: colors.primary,
      disabled: true,
    },
  ];

  const helpItems = [
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Get help using the app',
      icon: 'help-circle',
      screen: null,
      color: colors.textSecondary,
      disabled: true,
    },
    {
      id: 'feedback',
      title: 'Send Feedback',
      description: 'Share your thoughts and suggestions',
      icon: 'message-reply-text',
      screen: null,
      color: colors.warning,
      disabled: true,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="More Options"
        subtitle="Additional features and settings"
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <SectionHeader title="My Club" />
          {clubItems.map((item) => (
            <MenuCard
              key={item.id}
              title={item.title}
              description={item.disabled ? 'Coming soon' : item.description}
              icon={item.icon}
              color={item.disabled ? colors.textTertiary : item.color}
              onPress={() => {}}
              disabled={item.disabled}
            />
          ))}
        </View>

        <View style={styles.content}>
          <SectionHeader title="Help" />
          {helpItems.map((item) => (
            <MenuCard
              key={item.id}
              title={item.title}
              description={item.disabled ? 'Coming soon' : item.description}
              icon={item.icon}
              color={item.disabled ? colors.textTertiary : item.color}
              onPress={() => {}}
              disabled={item.disabled}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.sm,
  },
});

export default UserMoreScreen;

