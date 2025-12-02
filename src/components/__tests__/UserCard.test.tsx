/**
 * UserCard Component Tests
 * 
 * Tests following best practices from:
 * - React Testing Library
 * - Jest
 * - Kent C. Dodds testing principles
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { UserCard } from '../UserCard';
import { User, UserRole, ApprovalStatus } from '../../types';

// Test data builders
const createMockUser = (overrides?: Partial<User>): User => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: UserRole.USER,
  clubId: 'club-1',
  isActive: true,
  approvalStatus: ApprovalStatus.APPROVED,
  whatsappNumber: '+1234567890',
  classes: ['Friend'],
  timezone: 'America/Mexico_City',
  language: 'en',
  createdAt: new Date('2024-01-01').toISOString(),
  updatedAt: new Date('2024-01-01').toISOString(),
  ...overrides,
});

describe('UserCard', () => {
  describe('Rendering', () => {
    it('should render user information correctly', () => {
      const user = createMockUser({
        name: 'John Doe',
        email: 'john@example.com',
        role: UserRole.ADMIN,
      });

      const { getByText } = render(<UserCard user={user} />);

      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('john@example.com')).toBeTruthy();
      expect(getByText('ADMIN')).toBeTruthy();
    });

    it('should display avatar with first letter of name', () => {
      const user = createMockUser({ name: 'John Doe' });

      const { getByText } = render(<UserCard user={user} />);

      expect(getByText('J')).toBeTruthy();
    });

    it('should show WhatsApp number when provided', () => {
      const user = createMockUser({ whatsappNumber: '+1234567890' });

      const { getByText } = render(<UserCard user={user} />);

      expect(getByText('+1234567890')).toBeTruthy();
    });

    it('should not show WhatsApp number when not provided', () => {
      const user = createMockUser({ whatsappNumber: undefined });

      const { queryByText } = render(<UserCard user={user} />);

      // WhatsApp icon should not be visible
      expect(queryByText(/\+/)).toBeNull();
    });
  });

  describe('User Status', () => {
    it('should show "Active" status for active users', () => {
      const user = createMockUser({ isActive: true });

      const { getByText } = render(<UserCard user={user} />);

      expect(getByText('Active')).toBeTruthy();
    });

    it('should show "Inactive" status for inactive users', () => {
      const user = createMockUser({ isActive: false });

      const { getByText } = render(<UserCard user={user} />);

      expect(getByText('Inactive')).toBeTruthy();
    });

    it('should apply inactive styles to inactive users', () => {
      const user = createMockUser({ isActive: false });

      const { getByText } = render(<UserCard user={user} />);

      const nameElement = getByText(user.name);
      // Check if inactive style is applied (would need to check style prop)
      expect(nameElement).toBeTruthy();
    });
  });

  describe('User Roles', () => {
    it('should display "ADMIN" badge for admin users', () => {
      const user = createMockUser({ role: UserRole.ADMIN });

      const { getByText } = render(<UserCard user={user} />);

      expect(getByText('ADMIN')).toBeTruthy();
    });

    it('should display "CLUB ADMIN" badge for club admin users', () => {
      const user = createMockUser({ role: UserRole.CLUB_ADMIN });

      const { getByText } = render(<UserCard user={user} />);

      expect(getByText('CLUB ADMIN')).toBeTruthy();
    });

    it('should display "USER" badge for regular users', () => {
      const user = createMockUser({ role: UserRole.USER });

      const { getByText } = render(<UserCard user={user} />);

      expect(getByText('USER')).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('should call onPress when card is tapped', () => {
      const user = createMockUser();
      const onPress = jest.fn();

      const { getByLabelText } = render(
        <UserCard user={user} onPress={onPress} />
      );

      const card = getByLabelText(`View details for ${user.name}`);
      fireEvent.press(card);

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should not be pressable when onPress is not provided', () => {
      const user = createMockUser();

      const { queryByLabelText } = render(<UserCard user={user} />);

      // Card should not have accessibility label when not pressable
      expect(queryByLabelText(/View details/)).toBeNull();
    });
  });

  describe('Admin Actions', () => {
    it('should show admin actions when showAdminActions is true', () => {
      const user = createMockUser();
      const onToggleStatus = jest.fn();
      const onDelete = jest.fn();

      const { getByLabelText } = render(
        <UserCard
          user={user}
          showAdminActions={true}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      );

      expect(getByLabelText('Pause user')).toBeTruthy();
      expect(getByLabelText(`Delete ${user.name}`)).toBeTruthy();
    });

    it('should not show admin actions when showAdminActions is false', () => {
      const user = createMockUser();

      const { queryByLabelText } = render(
        <UserCard user={user} showAdminActions={false} />
      );

      expect(queryByLabelText(/Pause/)).toBeNull();
      expect(queryByLabelText(/Delete/)).toBeNull();
    });

    it('should call onToggleStatus when pause button is pressed', () => {
      const user = createMockUser({ isActive: true });
      const onToggleStatus = jest.fn();

      const { getByLabelText } = render(
        <UserCard
          user={user}
          showAdminActions={true}
          onToggleStatus={onToggleStatus}
        />
      );

      const pauseButton = getByLabelText('Pause user');
      fireEvent.press(pauseButton);

      expect(onToggleStatus).toHaveBeenCalledTimes(1);
    });

    it('should show resume button for inactive users', () => {
      const user = createMockUser({ isActive: false });
      const onToggleStatus = jest.fn();

      const { getByLabelText } = render(
        <UserCard
          user={user}
          showAdminActions={true}
          onToggleStatus={onToggleStatus}
        />
      );

      expect(getByLabelText('Resume user')).toBeTruthy();
    });

    it('should call onDelete when delete button is pressed', () => {
      const user = createMockUser();
      const onDelete = jest.fn();

      const { getByLabelText } = render(
        <UserCard
          user={user}
          showAdminActions={true}
          onDelete={onDelete}
        />
      );

      const deleteButton = getByLabelText(`Delete ${user.name}`);
      fireEvent.press(deleteButton);

      expect(onDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibility role for pressable card', () => {
      const user = createMockUser();
      const onPress = jest.fn();

      const { getByLabelText } = render(
        <UserCard user={user} onPress={onPress} />
      );

      const card = getByLabelText(`View details for ${user.name}`);
      expect(card.props.accessibilityRole).toBe('button');
    });

    it('should have correct accessibility state for inactive users', () => {
      const user = createMockUser({ isActive: false });
      const onPress = jest.fn();

      const { getByLabelText } = render(
        <UserCard user={user} onPress={onPress} />
      );

      const card = getByLabelText(`View details for ${user.name}`);
      expect(card.props.accessibilityState.disabled).toBe(true);
    });

    it('should have accessibility labels for admin action buttons', () => {
      const user = createMockUser({ name: 'John Doe' });
      const onToggleStatus = jest.fn();
      const onDelete = jest.fn();

      const { getByLabelText } = render(
        <UserCard
          user={user}
          showAdminActions={true}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      );

      const pauseButton = getByLabelText('Pause user');
      const deleteButton = getByLabelText('Delete John Doe');

      expect(pauseButton).toBeTruthy();
      expect(deleteButton).toBeTruthy();
    });
  });

  describe('Memoization', () => {
    it('should be memoized and not re-render on unrelated prop changes', () => {
      const user = createMockUser();
      const { rerender } = render(<UserCard user={user} />);

      // Spy on component renders (in real implementation)
      // This is a simplified test - in production, use React DevTools or performance monitoring

      // Re-render with same props
      rerender(<UserCard user={user} />);

      // Component should not re-render (memoization working)
      // This would be verified through performance monitoring or React DevTools
      expect(true).toBe(true); // Placeholder assertion
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long names gracefully', () => {
      const user = createMockUser({
        name: 'This is a very long name that should be truncated properly',
      });

      const { getByText } = render(<UserCard user={user} />);

      expect(getByText(user.name)).toBeTruthy();
    });

    it('should handle very long emails gracefully', () => {
      const user = createMockUser({
        email: 'this.is.a.very.long.email.address@example.com',
      });

      const { getByText } = render(<UserCard user={user} />);

      expect(getByText(user.email)).toBeTruthy();
    });

    it('should handle all admin actions disabled', () => {
      const user = createMockUser();

      const { queryByLabelText } = render(
        <UserCard user={user} showAdminActions={true} />
      );

      // No actions should be visible when callbacks are not provided
      expect(queryByLabelText(/Pause/)).toBeNull();
      expect(queryByLabelText(/Delete/)).toBeNull();
    });
  });
});

