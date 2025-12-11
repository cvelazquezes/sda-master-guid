/**
 * Text Component Stories
 *
 * Stories for the Text primitive component.
 * Shows different props, states, and variants.
 *
 * @storybook Primitives/Text
 */

import React from 'react';
import { View } from 'react-native';
import { Text, Heading, Body, Label, Caption } from './Text';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Text> = {
  title: 'Primitives/Text',
  component: Text,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'displayLarge',
        'displayMedium',
        'displaySmall',
        'h1',
        'h2',
        'h3',
        'h4',
        'heading',
        'bodyLarge',
        'body',
        'bodySmall',
        'labelLarge',
        'label',
        'labelSmall',
        'caption',
        'captionBold',
        'button',
        'buttonSmall',
        'badge',
        'helper',
      ],
    },
    color: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'tertiary',
        'quaternary',
        'disabled',
        'placeholder',
        'inverse',
        'onPrimary',
        'onSecondary',
        'onAccent',
        'link',
        'success',
        'warning',
        'error',
        'info',
      ],
    },
    weight: {
      control: 'select',
      options: ['light', 'regular', 'medium', 'semibold', 'bold', 'extrabold'],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'auto'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

// =============================================================================
// BASIC STORIES
// =============================================================================

export const Default: Story = {
  args: {
    children: 'Default text using body variant',
    variant: 'body',
  },
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Text variant="displayLarge">Display Large</Text>
      <Text variant="displayMedium">Display Medium</Text>
      <Text variant="displaySmall">Display Small</Text>
      <Text variant="h1">Heading 1</Text>
      <Text variant="h2">Heading 2</Text>
      <Text variant="h3">Heading 3</Text>
      <Text variant="h4">Heading 4</Text>
      <Text variant="bodyLarge">Body Large</Text>
      <Text variant="body">Body</Text>
      <Text variant="bodySmall">Body Small</Text>
      <Text variant="labelLarge">Label Large</Text>
      <Text variant="label">Label</Text>
      <Text variant="labelSmall">Label Small</Text>
      <Text variant="caption">Caption</Text>
      <Text variant="captionBold">Caption Bold</Text>
      <Text variant="button">Button</Text>
      <Text variant="buttonSmall">Button Small</Text>
      <Text variant="badge">BADGE</Text>
      <Text variant="helper">Helper text</Text>
    </View>
  ),
};

// =============================================================================
// COLOR STORIES
// =============================================================================

export const Colors: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Text color="primary">Primary color (default)</Text>
      <Text color="secondary">Secondary color</Text>
      <Text color="tertiary">Tertiary color</Text>
      <Text color="disabled">Disabled color</Text>
      <Text color="link">Link color</Text>
      <Text color="success">Success color</Text>
      <Text color="warning">Warning color</Text>
      <Text color="error">Error color</Text>
      <Text color="info">Info color</Text>
    </View>
  ),
};

// =============================================================================
// WEIGHT STORIES
// =============================================================================

export const FontWeights: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Text weight="light">Light weight text</Text>
      <Text weight="regular">Regular weight text</Text>
      <Text weight="medium">Medium weight text</Text>
      <Text weight="semibold">Semibold weight text</Text>
      <Text weight="bold">Bold weight text</Text>
      <Text weight="extrabold">Extrabold weight text</Text>
    </View>
  ),
};

// =============================================================================
// STYLE MODIFIERS
// =============================================================================

export const StyleModifiers: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Text uppercase>Uppercase text</Text>
      <Text italic>Italic text</Text>
      <Text underline>Underlined text</Text>
      <Text strikethrough>Strikethrough text</Text>
      <Text uppercase italic weight="bold">
        Combined modifiers
      </Text>
    </View>
  ),
};

// =============================================================================
// ALIGNMENT
// =============================================================================

export const TextAlignment: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Text align="left">Left aligned text (default)</Text>
      <Text align="center">Center aligned text</Text>
      <Text align="right">Right aligned text</Text>
    </View>
  ),
};

// =============================================================================
// CONVENIENCE SUBCOMPONENTS
// =============================================================================

export const HeadingComponent: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Heading level={1}>Heading Level 1</Heading>
      <Heading level={2}>Heading Level 2</Heading>
      <Heading level={3}>Heading Level 3</Heading>
      <Heading level={4}>Heading Level 4</Heading>
    </View>
  ),
};

export const BodyComponent: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Body size="large">Body Large</Body>
      <Body size="medium">Body Medium (default)</Body>
      <Body size="small">Body Small</Body>
    </View>
  ),
};

export const LabelComponent: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Label size="large">Label Large</Label>
      <Label size="medium">Label Medium (default)</Label>
      <Label size="small">Label Small</Label>
    </View>
  ),
};

export const CaptionComponent: Story = {
  args: {
    children: 'Caption text for helper information',
  },
  render: (args) => <Caption {...args} />,
};

// =============================================================================
// REAL WORLD EXAMPLES
// =============================================================================

export const CardExample: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Text variant="h3">Card Title</Text>
      <Text variant="body" color="secondary">
        This is a description of the card content. It uses the body variant with secondary color for
        less emphasis than the title.
      </Text>
      <Text variant="caption" color="tertiary">
        Posted 2 hours ago
      </Text>
    </View>
  ),
};

export const FormExample: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Text variant="label">Email Address</Text>
      <View
        style={{
          height: 48,
          backgroundColor: '#f5f5f5',
          borderRadius: 8,
          justifyContent: 'center',
          paddingHorizontal: 12,
        }}
      >
        <Text color="placeholder">Enter your email</Text>
      </View>
      <Text variant="helper" color="error">
        Please enter a valid email
      </Text>
    </View>
  ),
};
