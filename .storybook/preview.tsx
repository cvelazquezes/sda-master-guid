/**
 * Storybook Preview Configuration
 * 
 * Global decorators and parameters for all stories.
 */

import React from 'react';
import { View } from 'react-native';
import type { Preview } from '@storybook/react';
import { ThemeProvider } from '../src/contexts/ThemeContext';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <View style={{ flex: 1, padding: 16 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
};

export default preview;

