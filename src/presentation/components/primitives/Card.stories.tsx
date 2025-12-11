/**
 * Card Component Stories
 *
 * Stories for the Card primitive component.
 * Shows different variants and use cases.
 *
 * @storybook Primitives/Card
 */

import React from 'react';
import { View, Alert } from 'react-native';
import { Card } from './Card';
import { StandardButton as Button } from './StandardButton';
import { Text } from './Text';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Card> = {
  title: 'Primitives/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'flat'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// =============================================================================
// BASIC STORIES
// =============================================================================

export const Default: Story = {
  args: {
    children: <Text>Default card content</Text>,
    variant: 'default',
  },
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Card variant="default">
        <Text variant="label" weight="bold">
          Default
        </Text>
        <Text variant="bodySmall" color="secondary">
          Standard card with subtle shadow
        </Text>
      </Card>

      <Card variant="elevated">
        <Text variant="label" weight="bold">
          Elevated
        </Text>
        <Text variant="bodySmall" color="secondary">
          Card with stronger shadow for emphasis
        </Text>
      </Card>

      <Card variant="outlined">
        <Text variant="label" weight="bold">
          Outlined
        </Text>
        <Text variant="bodySmall" color="secondary">
          Card with border instead of shadow
        </Text>
      </Card>

      <Card variant="flat">
        <Text variant="label" weight="bold">
          Flat
        </Text>
        <Text variant="bodySmall" color="secondary">
          Card with no background or shadow
        </Text>
      </Card>
    </View>
  ),
};

// =============================================================================
// INTERACTIVE STORIES
// =============================================================================

export const Pressable: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Card
        variant="default"
        accessibilityLabel="Tap to see details"
        onPress={() => Alert.alert('Card pressed!')}
      >
        <Text variant="h4">Pressable Card</Text>
        <Text variant="bodySmall" color="secondary">
          Tap me to trigger an action
        </Text>
      </Card>

      <Card variant="elevated" onPress={() => Alert.alert('Elevated card pressed!')}>
        <Text variant="h4">Elevated Pressable</Text>
        <Text variant="bodySmall" color="secondary">
          Elevated cards can also be pressable
        </Text>
      </Card>
    </View>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Card disabled variant="default" onPress={() => Alert.alert('This should not trigger')}>
      <Text variant="h4">Disabled Card</Text>
      <Text variant="bodySmall" color="secondary">
        This card cannot be pressed
      </Text>
    </Card>
  ),
};

// =============================================================================
// REAL WORLD EXAMPLES
// =============================================================================

export const ProfileCard: Story = {
  render: () => (
    <Card variant="elevated">
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: '#1976D2',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text variant="h2" color="onPrimary">
            JD
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="h4">John Doe</Text>
          <Text variant="bodySmall" color="secondary">
            john.doe@example.com
          </Text>
          <Text variant="caption" color="tertiary">
            Member since 2023
          </Text>
        </View>
      </View>
    </Card>
  ),
};

export const ActionCard: Story = {
  render: () => (
    <Card variant="outlined">
      <Text variant="h4">Confirm Action</Text>
      <Text variant="body" color="secondary" style={{ marginTop: 8, marginBottom: 16 }}>
        Are you sure you want to proceed with this action? This cannot be undone.
      </Text>
      <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'flex-end' }}>
        <Button title="Cancel" variant="ghost" size="small" onPress={() => Alert.alert('Cancel')} />
        <Button
          title="Confirm"
          variant="danger"
          size="small"
          onPress={() => Alert.alert('Confirmed')}
        />
      </View>
    </Card>
  ),
};

export const StatCard: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <Card variant="default" style={{ flex: 1 }}>
        <Text variant="caption" color="secondary">
          Members
        </Text>
        <Text variant="displaySmall">247</Text>
        <Text variant="caption" color="success">
          +12% this month
        </Text>
      </Card>

      <Card variant="default" style={{ flex: 1 }}>
        <Text variant="caption" color="secondary">
          Events
        </Text>
        <Text variant="displaySmall">15</Text>
        <Text variant="caption" color="info">
          This week
        </Text>
      </Card>
    </View>
  ),
};

export const ListItemCard: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      {['Meeting Room A', 'Meeting Room B', 'Conference Hall'].map((room, index) => (
        <Card
          key={room}
          variant="outlined"
          style={{ marginBottom: 0 }}
          onPress={() => Alert.alert(`Selected: ${room}`)}
        >
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <View>
              <Text variant="label" weight="medium">
                {room}
              </Text>
              <Text variant="caption" color="secondary">
                {index === 0 ? 'Available' : index === 1 ? 'Occupied' : 'Available'}
              </Text>
            </View>
            <Text variant="caption" color={index === 1 ? 'error' : 'success'}>
              {index === 1 ? '●' : '●'}
            </Text>
          </View>
        </Card>
      ))}
    </View>
  ),
};
