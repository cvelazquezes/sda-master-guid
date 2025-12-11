/**
 * Detox E2E Test Initialization
 */

// eslint-disable-next-line import/named -- Detox exports are available at runtime
import { device, element, by, expect as detoxExpect } from 'detox';

beforeAll(async () => {
  await device.launchApp({
    newInstance: true,
    permissions: { notifications: 'YES' },
    launchArgs: { detoxPrintBusyIdleResources: 'YES' },
  });
});

beforeEach(async () => {
  await device.reloadReactNative();
});

export { device, element, by, detoxExpect };
