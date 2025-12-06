/**
 * Authentication E2E Tests
 *
 * Tests the complete authentication flow including:
 * - Login
 * - Registration
 * - Logout
 * - Session persistence
 */

import { device, element, by, detoxExpect } from './init';

describe('Authentication Flow', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('Login', () => {
    it('should show login screen on app launch', async () => {
      await detoxExpect(element(by.id('login-screen'))).toBeVisible();
      await detoxExpect(element(by.id('email-input'))).toBeVisible();
      await detoxExpect(element(by.id('password-input'))).toBeVisible();
      await detoxExpect(element(by.id('login-button'))).toBeVisible();
    });

    it('should show validation errors for empty fields', async () => {
      await element(by.id('login-button')).tap();

      await detoxExpect(element(by.text('Email is required'))).toBeVisible();
      await detoxExpect(element(by.text('Password is required'))).toBeVisible();
    });

    it('should show error for invalid email format', async () => {
      await element(by.id('email-input')).typeText('invalid-email');
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();

      await detoxExpect(element(by.text('Invalid email format'))).toBeVisible();
    });

    it('should successfully login with valid credentials', async () => {
      await element(by.id('email-input')).typeText('test@example.com');
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();

      // Wait for navigation to home screen
      await waitFor(element(by.id('home-screen')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should show error for invalid credentials', async () => {
      await element(by.id('email-input')).typeText('wrong@example.com');
      await element(by.id('password-input')).typeText('wrongpassword');
      await element(by.id('login-button')).tap();

      await detoxExpect(element(by.text('Invalid credentials'))).toBeVisible();
    });
  });

  describe('Registration', () => {
    beforeEach(async () => {
      await element(by.id('register-link')).tap();
      await detoxExpect(element(by.id('register-screen'))).toBeVisible();
    });

    it('should show registration form', async () => {
      await detoxExpect(element(by.id('name-input'))).toBeVisible();
      await detoxExpect(element(by.id('email-input'))).toBeVisible();
      await detoxExpect(element(by.id('password-input'))).toBeVisible();
      await detoxExpect(element(by.id('confirm-password-input'))).toBeVisible();
      await detoxExpect(element(by.id('register-button'))).toBeVisible();
    });

    it('should validate password confirmation', async () => {
      await element(by.id('name-input')).typeText('Test User');
      await element(by.id('email-input')).typeText('new@example.com');
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('confirm-password-input')).typeText('different123');
      await element(by.id('register-button')).tap();

      await detoxExpect(element(by.text('Passwords do not match'))).toBeVisible();
    });

    it('should successfully register new user', async () => {
      await element(by.id('name-input')).typeText('Test User');
      await element(by.id('email-input')).typeText('new@example.com');
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('confirm-password-input')).typeText('password123');
      await element(by.id('register-button')).tap();

      // Should navigate to home screen after registration
      await waitFor(element(by.id('home-screen')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Logout', () => {
    beforeEach(async () => {
      // Login first
      await element(by.id('email-input')).typeText('test@example.com');
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();

      await waitFor(element(by.id('home-screen')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should logout and return to login screen', async () => {
      // Navigate to settings
      await element(by.id('settings-tab')).tap();
      await detoxExpect(element(by.id('settings-screen'))).toBeVisible();

      // Tap logout button
      await element(by.id('logout-button')).tap();

      // Should return to login screen
      await waitFor(element(by.id('login-screen')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Session Persistence', () => {
    it('should persist session after app restart', async () => {
      // Login
      await element(by.id('email-input')).typeText('test@example.com');
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();

      await waitFor(element(by.id('home-screen')))
        .toBeVisible()
        .withTimeout(5000);

      // Terminate and relaunch app
      await device.terminateApp();
      await device.launchApp({ newInstance: false });

      // Should still be logged in
      await detoxExpect(element(by.id('home-screen'))).toBeVisible();
    });
  });
});
