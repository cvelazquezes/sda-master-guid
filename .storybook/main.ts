/**
 * Storybook Main Configuration
 * 
 * Every exported shared component must have at least one Storybook story.
 * Stories are for visuals, not business logic.
 */

import type { StorybookConfig } from '@storybook/react-native';

const config: StorybookConfig = {
  stories: [
    '../src/shared/components/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/ui/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions',
  ],
};

export default config;

