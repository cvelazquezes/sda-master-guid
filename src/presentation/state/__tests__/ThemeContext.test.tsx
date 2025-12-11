/**
 * ThemeContext Tests
 * Testing theme state management and switching functionality
 */

import React from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { THEME_MODE } from '../../../shared/constants/ui';
import { ThemeProvider, useTheme } from '../ThemeContext';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock useColorScheme
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    useColorScheme: jest.fn(() => 'light'),
  };
});

// Mock logger
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// Helper to render hook with provider
const wrapper = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (useColorScheme as jest.Mock).mockReturnValue('light');
  });

  describe('Initialization', () => {
    it('should initialize with system theme when no saved preference', async () => {
      (useColorScheme as jest.Mock).mockReturnValue('light');
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.mode).toBe(THEME_MODE.SYSTEM);
        expect(result.current.activeTheme).toBe(THEME_MODE.LIGHT);
      });
    });

    it('should load saved theme preference from storage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(THEME_MODE.DARK);

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.mode).toBe(THEME_MODE.DARK);
        expect(result.current.activeTheme).toBe(THEME_MODE.DARK);
      });
    });

    it('should follow system dark mode when set to system', async () => {
      (useColorScheme as jest.Mock).mockReturnValue('dark');
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(THEME_MODE.SYSTEM);

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.mode).toBe(THEME_MODE.SYSTEM);
        expect(result.current.activeTheme).toBe(THEME_MODE.DARK);
      });
    });

    it('should follow system light mode when set to system', async () => {
      (useColorScheme as jest.Mock).mockReturnValue('light');
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(THEME_MODE.SYSTEM);

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.mode).toBe(THEME_MODE.SYSTEM);
        expect(result.current.activeTheme).toBe(THEME_MODE.LIGHT);
      });
    });
  });

  describe('Theme Switching', () => {
    it('should switch to dark theme', async () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.activeTheme).toBeDefined();
      });

      await act(async () => {
        result.current.setTheme(THEME_MODE.DARK);
      });

      await waitFor(() => {
        expect(result.current.mode).toBe(THEME_MODE.DARK);
        expect(result.current.activeTheme).toBe(THEME_MODE.DARK);
      });
    });

    it('should switch to light theme', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(THEME_MODE.DARK);

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.activeTheme).toBe(THEME_MODE.DARK);
      });

      await act(async () => {
        result.current.setTheme(THEME_MODE.LIGHT);
      });

      await waitFor(() => {
        expect(result.current.mode).toBe(THEME_MODE.LIGHT);
        expect(result.current.activeTheme).toBe(THEME_MODE.LIGHT);
      });
    });

    it('should save theme preference to storage', async () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.activeTheme).toBeDefined();
      });

      await act(async () => {
        result.current.setTheme(THEME_MODE.DARK);
      });

      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('Toggle Theme', () => {
    it('should toggle from light to dark', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(THEME_MODE.LIGHT);

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.activeTheme).toBe(THEME_MODE.LIGHT);
      });

      await act(async () => {
        result.current.toggleTheme();
      });

      await waitFor(() => {
        expect(result.current.activeTheme).toBe(THEME_MODE.DARK);
      });
    });

    it('should toggle from dark to light', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(THEME_MODE.DARK);

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.activeTheme).toBe(THEME_MODE.DARK);
      });

      await act(async () => {
        result.current.toggleTheme();
      });

      await waitFor(() => {
        expect(result.current.activeTheme).toBe(THEME_MODE.LIGHT);
      });
    });
  });

  describe('isDark Property', () => {
    it('should return true when active theme is dark', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(THEME_MODE.DARK);

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.isDark).toBe(true);
      });
    });

    it('should return false when active theme is light', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(THEME_MODE.LIGHT);

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.isDark).toBe(false);
      });
    });
  });

  describe('Theme Tokens', () => {
    it('should provide spacing tokens', async () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.spacing).toBeDefined();
        expect(result.current.spacing.md).toBeDefined();
        expect(typeof result.current.spacing.md).toBe('number');
      });
    });

    it('should provide radii tokens', async () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.radii).toBeDefined();
        expect(result.current.radii.lg).toBeDefined();
        expect(typeof result.current.radii.lg).toBe('number');
      });
    });

    it('should provide shadows tokens', async () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.shadows).toBeDefined();
        expect(result.current.shadows.md).toBeDefined();
      });
    });

    it('should provide typography tokens', async () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.typography).toBeDefined();
        expect(result.current.typography.fontSizes).toBeDefined();
        expect(result.current.typography.fontWeights).toBeDefined();
      });
    });

    it('should provide iconSizes tokens', async () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.iconSizes).toBeDefined();
        expect(result.current.iconSizes.md).toBeDefined();
        expect(typeof result.current.iconSizes.md).toBe('number');
      });
    });

    it('should provide componentSizes tokens', async () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.componentSizes).toBeDefined();
        expect(result.current.componentSizes.iconContainer).toBeDefined();
      });
    });

    it('should provide avatarSizes tokens', async () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.avatarSizes).toBeDefined();
        expect(result.current.avatarSizes.md).toBeDefined();
      });
    });

    it('should provide borderWidths tokens', async () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.borderWidths).toBeDefined();
        expect(result.current.borderWidths.thin).toBeDefined();
      });
    });
  });

  describe('Colors', () => {
    it('should provide theme colors', async () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.colors).toBeDefined();
        expect(result.current.colors.primary).toBeDefined();
        expect(result.current.colors.background).toBeDefined();
        expect(result.current.colors.surface).toBeDefined();
      });
    });

    it('should provide status colors', async () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.statusColors).toBeDefined();
      });
    });

    it('should provide role colors', async () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.roleColors).toBeDefined();
      });
    });
  });

  describe('Context Consumer', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should handle AsyncStorage read errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        // Should fall back to system theme
        expect(result.current.mode).toBe(THEME_MODE.SYSTEM);
      });

      consoleSpy.mockRestore();
    });

    it('should handle AsyncStorage write errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const { result } = renderHook(() => useTheme(), { wrapper });

      await waitFor(() => {
        expect(result.current.activeTheme).toBeDefined();
      });

      // Should not throw
      await act(async () => {
        result.current.setTheme(THEME_MODE.DARK);
      });

      consoleSpy.mockRestore();
    });
  });
});
