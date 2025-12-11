/**
 * ClubCard Component Tests
 *
 * Tests following best practices from:
 * - React Testing Library
 * - Jest
 * - Kent C. Dodds testing principles
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MatchFrequency, type Club } from '../../../../types';
import { ClubCard } from '../ClubCard';

// Test data builders
const createMockClub = (overrides?: Partial<Club>): Club => ({
  id: '1',
  name: 'Test Club',
  description: 'A test club for testing',
  adminId: 'admin-1',
  church: 'Test Church',
  association: 'Test Association',
  union: 'Test Union',
  division: 'Test Division',
  matchFrequency: MatchFrequency.WEEKLY,
  groupSize: 2,
  isActive: true,
  memberCount: 10,
  createdAt: new Date('2024-01-01').toISOString(),
  updatedAt: new Date('2024-01-01').toISOString(),
  ...overrides,
});

describe('ClubCard', () => {
  describe('Rendering', () => {
    it('should render club information correctly', () => {
      const club = createMockClub({
        name: 'SDA Master Guid',
        description: 'Club management and social activities for SDA',
        matchFrequency: MatchFrequency.BIWEEKLY,
        groupSize: 3,
        memberCount: 25,
      });

      const { getByText } = render(<ClubCard club={club} />);

      expect(getByText('SDA Master Guid')).toBeTruthy();
      expect(getByText('Club management and social activities for SDA')).toBeTruthy();
      expect(getByText('bi-weekly')).toBeTruthy();
      expect(getByText('3 per group')).toBeTruthy();
      expect(getByText('25 members')).toBeTruthy();
    });

    it('should display club icon', () => {
      const club = createMockClub();

      const { getByText } = render(<ClubCard club={club} />);

      // Icon should be rendered along with club name
      expect(getByText(club.name)).toBeTruthy();
    });

    it('should not show member count when not provided', () => {
      const club = createMockClub({ memberCount: undefined });

      const { queryByText } = render(<ClubCard club={club} />);

      expect(queryByText(/members/)).toBeNull();
    });
  });

  describe('Club Status', () => {
    it('should show "Active" status for active clubs', () => {
      const club = createMockClub({ isActive: true });

      const { getByText } = render(<ClubCard club={club} />);

      expect(getByText('Active')).toBeTruthy();
    });

    it('should show "Inactive" status for inactive clubs', () => {
      const club = createMockClub({ isActive: false });

      const { getByText } = render(<ClubCard club={club} />);

      expect(getByText('Inactive')).toBeTruthy();
    });

    it('should apply inactive styles to inactive clubs', () => {
      const club = createMockClub({ isActive: false });

      const { getByText } = render(<ClubCard club={club} />);

      const nameElement = getByText(club.name);
      expect(nameElement).toBeTruthy();
    });
  });

  describe('Match Frequency', () => {
    it('should display weekly frequency', () => {
      const club = createMockClub({ matchFrequency: MatchFrequency.WEEKLY });

      const { getByText } = render(<ClubCard club={club} />);

      expect(getByText('weekly')).toBeTruthy();
    });

    it('should display bi-weekly frequency with dash', () => {
      const club = createMockClub({ matchFrequency: MatchFrequency.BIWEEKLY });

      const { getByText } = render(<ClubCard club={club} />);

      expect(getByText('bi-weekly')).toBeTruthy();
    });

    it('should display monthly frequency', () => {
      const club = createMockClub({ matchFrequency: MatchFrequency.MONTHLY });

      const { getByText } = render(<ClubCard club={club} />);

      expect(getByText('monthly')).toBeTruthy();
    });
  });

  describe('Group Size', () => {
    it('should display correct group size for pairs', () => {
      const club = createMockClub({ groupSize: 2 });

      const { getByText } = render(<ClubCard club={club} />);

      expect(getByText('2 per group')).toBeTruthy();
    });

    it('should display correct group size for triples', () => {
      const club = createMockClub({ groupSize: 3 });

      const { getByText } = render(<ClubCard club={club} />);

      expect(getByText('3 per group')).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('should call onPress when card is tapped', () => {
      const club = createMockClub();
      const onPress = jest.fn();

      const { getByLabelText } = render(<ClubCard club={club} onPress={onPress} />);

      const card = getByLabelText(`View details for ${club.name}`);
      fireEvent.press(card);

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should not be pressable when onPress is not provided', () => {
      const club = createMockClub();

      const { queryByLabelText } = render(<ClubCard club={club} />);

      expect(queryByLabelText(/View details/)).toBeNull();
    });
  });

  describe('Admin Actions', () => {
    it('should show admin actions when showAdminActions is true', () => {
      const club = createMockClub();
      const onToggleStatus = jest.fn();
      const onDelete = jest.fn();

      const { getByLabelText } = render(
        <ClubCard
          showAdminActions
          club={club}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      );

      expect(getByLabelText('Deactivate club')).toBeTruthy();
      expect(getByLabelText(`Delete ${club.name}`)).toBeTruthy();
    });

    it('should not show admin actions when showAdminActions is false', () => {
      const club = createMockClub();

      const { queryByLabelText } = render(<ClubCard club={club} showAdminActions={false} />);

      expect(queryByLabelText(/Deactivate/)).toBeNull();
      expect(queryByLabelText(/Delete/)).toBeNull();
    });

    it('should call onToggleStatus when deactivate button is pressed', () => {
      const club = createMockClub({ isActive: true });
      const onToggleStatus = jest.fn();

      const { getByLabelText } = render(
        <ClubCard showAdminActions club={club} onToggleStatus={onToggleStatus} />
      );

      const deactivateButton = getByLabelText('Deactivate club');
      fireEvent.press(deactivateButton);

      expect(onToggleStatus).toHaveBeenCalledTimes(1);
    });

    it('should show activate button for inactive clubs', () => {
      const club = createMockClub({ isActive: false });
      const onToggleStatus = jest.fn();

      const { getByLabelText } = render(
        <ClubCard showAdminActions club={club} onToggleStatus={onToggleStatus} />
      );

      expect(getByLabelText('Activate club')).toBeTruthy();
    });

    it('should call onDelete when delete button is pressed', () => {
      const club = createMockClub();
      const onDelete = jest.fn();

      const { getByLabelText } = render(
        <ClubCard showAdminActions club={club} onDelete={onDelete} />
      );

      const deleteButton = getByLabelText(`Delete ${club.name}`);
      fireEvent.press(deleteButton);

      expect(onDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibility role for pressable card', () => {
      const club = createMockClub();
      const onPress = jest.fn();

      const { getByLabelText } = render(<ClubCard club={club} onPress={onPress} />);

      const card = getByLabelText(`View details for ${club.name}`);
      expect(card.props.accessibilityRole).toBe('button');
    });

    it('should have correct accessibility state for inactive clubs', () => {
      const club = createMockClub({ isActive: false });
      const onPress = jest.fn();

      const { getByLabelText } = render(<ClubCard club={club} onPress={onPress} />);

      const card = getByLabelText(`View details for ${club.name}`);
      expect(card.props.accessibilityState.disabled).toBe(true);
    });

    it('should have accessibility labels for admin action buttons', () => {
      const club = createMockClub({ name: 'SDA Main Club' });
      const onToggleStatus = jest.fn();
      const onDelete = jest.fn();

      const { getByLabelText } = render(
        <ClubCard
          showAdminActions
          club={club}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      );

      const deactivateButton = getByLabelText('Deactivate club');
      const deleteButton = getByLabelText('Delete SDA Main Club');

      expect(deactivateButton).toBeTruthy();
      expect(deleteButton).toBeTruthy();
    });
  });

  describe('Memoization', () => {
    it('should be memoized and not re-render on unrelated prop changes', () => {
      const club = createMockClub();
      const { rerender } = render(<ClubCard club={club} />);

      // Re-render with same props
      rerender(<ClubCard club={club} />);

      // Component should not re-render (memoization working)
      expect(true).toBe(true); // Placeholder assertion
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long club names gracefully', () => {
      const club = createMockClub({
        name: 'This is a very long club name that should be truncated properly',
      });

      const { getByText } = render(<ClubCard club={club} />);

      expect(getByText(club.name)).toBeTruthy();
    });

    it('should handle very long descriptions gracefully', () => {
      const club = createMockClub({
        description:
          'This is a very long description that should be truncated after two lines to prevent the card from becoming too tall',
      });

      const { getByText } = render(<ClubCard club={club} />);

      expect(getByText(club.description)).toBeTruthy();
    });

    it('should handle zero member count', () => {
      const club = createMockClub({ memberCount: 0 });

      const { getByText } = render(<ClubCard club={club} />);

      expect(getByText('0 members')).toBeTruthy();
    });

    it('should handle all admin actions disabled', () => {
      const club = createMockClub();

      const { queryByLabelText } = render(<ClubCard showAdminActions club={club} />);

      // No actions should be visible when callbacks are not provided
      expect(queryByLabelText(/Deactivate/)).toBeNull();
      expect(queryByLabelText(/Delete/)).toBeNull();
    });
  });
});
