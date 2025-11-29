/* eslint-disable max-lines-per-function, no-magic-numbers */
/**
 * LoginScreen Tests
 * Comprehensive tests following Google/Meta testing standards
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../LoginScreen';
import { useAuth } from '../../../context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { AuthenticationError, NetworkError } from '../../../shared/utils/errors';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock AuthContext
jest.mock('../../../context/AuthContext');

// Helper to render with navigation
const renderWithNavigation = (component: React.ReactElement) => {
  return render(<NavigationContainer>{component}</NavigationContainer>);
};

describe('LoginScreen', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      user: null,
    });
  });

  describe('Rendering', () => {
    it('should render login form correctly', () => {
      const { getByTestId, getByText } = renderWithNavigation(<LoginScreen />);

      expect(getByTestId('email-input')).toBeTruthy();
      expect(getByTestId('password-input')).toBeTruthy();
      expect(getByTestId('login-button')).toBeTruthy();
      expect(getByText('Login')).toBeTruthy();
    });

    it('should render register link', () => {
      const { getByText } = renderWithNavigation(<LoginScreen />);

      expect(getByText(/Don't have an account/i)).toBeTruthy();
      expect(getByText('Register')).toBeTruthy();
    });

    it('should have proper accessibility labels', () => {
      const { getByTestId } = renderWithNavigation(<LoginScreen />);

      const emailInput = getByTestId('email-input');
      const passwordInput = getByTestId('password-input');
      const loginButton = getByTestId('login-button');

      expect(emailInput.props.accessibilityLabel).toBe('Email address');
      expect(passwordInput.props.accessibilityLabel).toBe('Password');
      expect(loginButton.props.accessibilityLabel).toBe('Login button');
      expect(loginButton.props.accessibilityRole).toBe('button');
    });
  });

  describe('Email Validation', () => {
    it('should show error for empty email', async () => {
      const { getByTestId, getByText } = renderWithNavigation(<LoginScreen />);

      const loginButton = getByTestId('login-button');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(getByText('Email is required')).toBeTruthy();
      });
    });

    it('should show error for invalid email format', async () => {
      const { getByTestId, getByText } = renderWithNavigation(<LoginScreen />);

      const emailInput = getByTestId('email-input');
      fireEvent.changeText(emailInput, 'invalid-email');

      const loginButton = getByTestId('login-button');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(getByText('Invalid email address')).toBeTruthy();
      });
    });

    it('should accept valid email', async () => {
      const { getByTestId, queryByText } = renderWithNavigation(<LoginScreen />);

      const emailInput = getByTestId('email-input');
      fireEvent.changeText(emailInput, 'user@example.com');

      await waitFor(() => {
        expect(queryByText('Invalid email address')).toBeNull();
      });
    });

    it('should trim whitespace from email', async () => {
      const { getByTestId } = renderWithNavigation(<LoginScreen />);

      const emailInput = getByTestId('email-input');
      const passwordInput = getByTestId('password-input');

      fireEvent.changeText(emailInput, '  user@example.com  ');
      fireEvent.changeText(passwordInput, 'password123');

      const loginButton = getByTestId('login-button');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password123');
      });
    });
  });

  describe('Password Validation', () => {
    it('should show error for empty password', async () => {
      const { getByTestId, getByText } = renderWithNavigation(<LoginScreen />);

      const emailInput = getByTestId('email-input');
      fireEvent.changeText(emailInput, 'user@example.com');

      const loginButton = getByTestId('login-button');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(getByText('Password is required')).toBeTruthy();
      });
    });

    it('should toggle password visibility', () => {
      const { getByTestId } = renderWithNavigation(<LoginScreen />);

      const passwordInput = getByTestId('password-input');
      const toggleButton = getByTestId('password-toggle-button');

      // Initially secure
      expect(passwordInput.props.secureTextEntry).toBe(true);

      // Toggle to visible
      fireEvent.press(toggleButton);
      expect(passwordInput.props.secureTextEntry).toBe(false);

      // Toggle back to secure
      fireEvent.press(toggleButton);
      expect(passwordInput.props.secureTextEntry).toBe(true);
    });
  });

  describe('Login Flow', () => {
    it('should call login with correct credentials', async () => {
      mockLogin.mockResolvedValue(undefined);

      const { getByTestId } = renderWithNavigation(<LoginScreen />);

      const emailInput = getByTestId('email-input');
      const passwordInput = getByTestId('password-input');
      const loginButton = getByTestId('login-button');

      fireEvent.changeText(emailInput, 'user@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password123');
      });
    });

    it('should show loading state during login', async () => {
      mockLogin.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

      const { getByTestId, getByText } = renderWithNavigation(<LoginScreen />);

      const emailInput = getByTestId('email-input');
      const passwordInput = getByTestId('password-input');
      const loginButton = getByTestId('login-button');

      fireEvent.changeText(emailInput, 'user@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);

      expect(getByText('Logging in...')).toBeTruthy();
      expect(loginButton.props.disabled).toBe(true);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });
    });

    it('should disable inputs during login', async () => {
      mockLogin.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

      const { getByTestId } = renderWithNavigation(<LoginScreen />);

      const emailInput = getByTestId('email-input');
      const passwordInput = getByTestId('password-input');
      const loginButton = getByTestId('login-button');

      fireEvent.changeText(emailInput, 'user@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);

      expect(emailInput.props.editable).toBe(false);
      expect(passwordInput.props.editable).toBe(false);
      expect(loginButton.props.disabled).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should display authentication error', async () => {
      mockLogin.mockRejectedValue(new AuthenticationError('Invalid credentials'));

      const { getByTestId, getByText } = renderWithNavigation(<LoginScreen />);

      const emailInput = getByTestId('email-input');
      const passwordInput = getByTestId('password-input');
      const loginButton = getByTestId('login-button');

      fireEvent.changeText(emailInput, 'user@example.com');
      fireEvent.changeText(passwordInput, 'wrongpassword');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(getByText('Invalid credentials')).toBeTruthy();
      });
    });

    it('should display network error', async () => {
      mockLogin.mockRejectedValue(new NetworkError('Network request failed'));

      const { getByTestId, getByText } = renderWithNavigation(<LoginScreen />);

      const emailInput = getByTestId('email-input');
      const passwordInput = getByTestId('password-input');
      const loginButton = getByTestId('login-button');

      fireEvent.changeText(emailInput, 'user@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(getByText(/network/i)).toBeTruthy();
      });
    });

    it('should clear error when user types', async () => {
      mockLogin.mockRejectedValue(new AuthenticationError('Invalid credentials'));

      const { getByTestId, getByText, queryByText } = renderWithNavigation(<LoginScreen />);

      const emailInput = getByTestId('email-input');
      const passwordInput = getByTestId('password-input');
      const loginButton = getByTestId('login-button');

      // Trigger error
      fireEvent.changeText(emailInput, 'user@example.com');
      fireEvent.changeText(passwordInput, 'wrongpassword');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(getByText('Invalid credentials')).toBeTruthy();
      });

      // Clear error by typing
      fireEvent.changeText(emailInput, 'user2@example.com');

      expect(queryByText('Invalid credentials')).toBeNull();
    });

    it('should re-enable inputs after error', async () => {
      mockLogin.mockRejectedValue(new AuthenticationError('Invalid credentials'));

      const { getByTestId } = renderWithNavigation(<LoginScreen />);

      const emailInput = getByTestId('email-input');
      const passwordInput = getByTestId('password-input');
      const loginButton = getByTestId('login-button');

      fireEvent.changeText(emailInput, 'user@example.com');
      fireEvent.changeText(passwordInput, 'wrongpassword');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(emailInput.props.editable).toBe(true);
        expect(passwordInput.props.editable).toBe(true);
        expect(loginButton.props.disabled).toBe(false);
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate to register screen', () => {
      const { getByText } = renderWithNavigation(<LoginScreen />);

      const registerLink = getByText('Register');
      fireEvent.press(registerLink);

      expect(mockNavigate).toHaveBeenCalledWith('Register');
    });

    it('should navigate to forgot password screen', () => {
      const { getByText } = renderWithNavigation(<LoginScreen />);

      const forgotPasswordLink = getByText(/Forgot password/i);
      fireEvent.press(forgotPasswordLink);

      expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword');
    });
  });

  describe('Accessibility', () => {
    it('should announce errors to screen readers', async () => {
      mockLogin.mockRejectedValue(new AuthenticationError('Invalid credentials'));

      const { getByTestId } = renderWithNavigation(<LoginScreen />);

      const emailInput = getByTestId('email-input');
      const passwordInput = getByTestId('password-input');
      const loginButton = getByTestId('login-button');

      fireEvent.changeText(emailInput, 'user@example.com');
      fireEvent.changeText(passwordInput, 'wrongpassword');
      fireEvent.press(loginButton);

      await waitFor(() => {
        const errorMessage = getByTestId('error-message');
        expect(errorMessage.props.accessibilityLiveRegion).toBe('polite');
        expect(errorMessage.props.accessibilityRole).toBe('alert');
      });
    });

    it('should have proper heading hierarchy', () => {
      const { getByTestId } = renderWithNavigation(<LoginScreen />);

      const heading = getByTestId('login-heading');
      expect(heading.props.accessibilityRole).toBe('header');
      expect(heading.props.accessibilityLevel).toBe(1);
    });
  });

  describe('Performance', () => {
    it('should render within performance budget', () => {
      const startTime = performance.now();

      renderWithNavigation(<LoginScreen />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render in less than 100ms
      expect(renderTime).toBeLessThan(100);
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple rapid login attempts', async () => {
      mockLogin.mockResolvedValue(undefined);

      const { getByTestId } = renderWithNavigation(<LoginScreen />);

      const emailInput = getByTestId('email-input');
      const passwordInput = getByTestId('password-input');
      const loginButton = getByTestId('login-button');

      fireEvent.changeText(emailInput, 'user@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      // Rapid clicks
      fireEvent.press(loginButton);
      fireEvent.press(loginButton);
      fireEvent.press(loginButton);

      await waitFor(() => {
        // Should only call login once (debounced)
        expect(mockLogin).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle very long email addresses', async () => {
      const { getByTestId } = renderWithNavigation(<LoginScreen />);

      const emailInput = getByTestId('email-input');
      const longEmail = 'a'.repeat(250) + '@example.com';

      fireEvent.changeText(emailInput, longEmail);

      const loginButton = getByTestId('login-button');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(getByText('Email too long')).toBeTruthy();
      });
    });

    it('should handle special characters in password', async () => {
      mockLogin.mockResolvedValue(undefined);

      const { getByTestId } = renderWithNavigation(<LoginScreen />);

      const emailInput = getByTestId('email-input');
      const passwordInput = getByTestId('password-input');
      const loginButton = getByTestId('login-button');

      const specialPassword = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      fireEvent.changeText(emailInput, 'user@example.com');
      fireEvent.changeText(passwordInput, specialPassword);
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('user@example.com', specialPassword);
      });
    });
  });
});
