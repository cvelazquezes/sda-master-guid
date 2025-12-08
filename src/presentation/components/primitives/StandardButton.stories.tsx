/**
 * Button Component Stories
 *
 * Stories for the Button primitive component.
 * Shows different variants, sizes, and states.
 *
 * @storybook Primitives/Button
 */

import React from 'react';
import { View, Alert } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { StandardButton as Button } from './StandardButton';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'danger', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// =============================================================================
// BASIC STORIES
// =============================================================================

export const Default: Story = {
  args: {
    title: 'Button',
    onPress: () => Alert.alert('Button pressed'),
    variant: 'primary',
    size: 'medium',
  },
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Button title="Primary" variant="primary" onPress={() => Alert.alert('Primary')} />
      <Button title="Secondary" variant="secondary" onPress={() => Alert.alert('Secondary')} />
      <Button title="Accent" variant="accent" onPress={() => Alert.alert('Accent')} />
      <Button title="Danger" variant="danger" onPress={() => Alert.alert('Danger')} />
      <Button title="Outline" variant="outline" onPress={() => Alert.alert('Outline')} />
      <Button title="Ghost" variant="ghost" onPress={() => Alert.alert('Ghost')} />
    </View>
  ),
};

// =============================================================================
// SIZE STORIES
// =============================================================================

export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 12, alignItems: 'flex-start' }}>
      <Button title="Small" size="small" onPress={() => Alert.alert('Small')} />
      <Button title="Medium" size="medium" onPress={() => Alert.alert('Medium')} />
      <Button title="Large" size="large" onPress={() => Alert.alert('Large')} />
    </View>
  ),
};

// =============================================================================
// STATE STORIES
// =============================================================================

export const States: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Button title="Default" onPress={() => Alert.alert('Default')} />
      <Button title="Loading" loading onPress={() => Alert.alert('Loading')} />
      <Button title="Disabled" disabled onPress={() => Alert.alert('Disabled')} />
    </View>
  ),
};

// =============================================================================
// ICON STORIES
// =============================================================================

export const WithIcons: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Button
        title="Icon Left"
        icon="check"
        iconPosition="left"
        onPress={() => Alert.alert('Icon Left')}
      />
      <Button
        title="Icon Right"
        icon="arrow-right"
        iconPosition="right"
        onPress={() => Alert.alert('Icon Right')}
      />
      <Button
        title="Save Changes"
        icon="content-save"
        iconPosition="left"
        variant="primary"
        onPress={() => Alert.alert('Save')}
      />
      <Button
        title="Delete"
        icon="delete"
        iconPosition="left"
        variant="danger"
        onPress={() => Alert.alert('Delete')}
      />
    </View>
  ),
};

// =============================================================================
// FULL WIDTH
// =============================================================================

export const FullWidth: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Button
        title="Full Width Primary"
        fullWidth
        variant="primary"
        onPress={() => Alert.alert('Full Width')}
      />
      <Button
        title="Full Width Outline"
        fullWidth
        variant="outline"
        onPress={() => Alert.alert('Full Width Outline')}
      />
    </View>
  ),
};

// =============================================================================
// REAL WORLD EXAMPLES
// =============================================================================

export const LoginForm: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Button title="Sign In" fullWidth variant="primary" onPress={() => Alert.alert('Sign In')} />
      <Button
        title="Create Account"
        fullWidth
        variant="outline"
        onPress={() => Alert.alert('Create Account')}
      />
      <Button
        title="Continue with Google"
        fullWidth
        variant="ghost"
        icon="google"
        iconPosition="left"
        onPress={() => Alert.alert('Google')}
      />
    </View>
  ),
};

export const ActionBar: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'flex-end' }}>
      <Button title="Cancel" variant="ghost" size="small" onPress={() => Alert.alert('Cancel')} />
      <Button
        title="Save"
        variant="primary"
        size="small"
        icon="check"
        iconPosition="left"
        onPress={() => Alert.alert('Save')}
      />
    </View>
  ),
};
