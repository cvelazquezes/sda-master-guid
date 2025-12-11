/**
 * Text Component Tests
 * Testing the core Text primitive component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../../../state/ThemeContext';
import { Text, type TextVariant, type TextColor, type TextWeight } from '../Text';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

// Mock logger
jest.mock('../../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// Helper to render with provider
const renderWithTheme = (ui: React.ReactElement): ReturnType<typeof render> => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Text Component', () => {
  describe('Basic Rendering', () => {
    it('should render text content', () => {
      const { getByText } = renderWithTheme(<Text>Hello World</Text>);
      expect(getByText('Hello World')).toBeTruthy();
    });

    it('should render children nodes', () => {
      const { getByText } = renderWithTheme(
        <Text>
          <Text>Nested</Text>
        </Text>
      );
      expect(getByText('Nested')).toBeTruthy();
    });

    it('should render with testID for testing', () => {
      const { getByTestId } = renderWithTheme(<Text testID="test-text">Content</Text>);
      expect(getByTestId('test-text')).toBeTruthy();
    });
  });

  describe('Typography Variants', () => {
    const variants: TextVariant[] = [
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
    ];

    variants.forEach((variant) => {
      it(`should render ${variant} variant without errors`, () => {
        const { getByText } = renderWithTheme(<Text variant={variant}>Text</Text>);
        expect(getByText('Text')).toBeTruthy();
      });
    });

    it('should apply default body variant when not specified', () => {
      const { getByText } = renderWithTheme(<Text>Default</Text>);
      expect(getByText('Default')).toBeTruthy();
    });
  });

  describe('Text Colors', () => {
    const colors: TextColor[] = [
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
      'inherit',
    ];

    colors.forEach((color) => {
      it(`should render ${color} color without errors`, () => {
        const { getByText } = renderWithTheme(<Text color={color}>Colored Text</Text>);
        expect(getByText('Colored Text')).toBeTruthy();
      });
    });
  });

  describe('Font Weights', () => {
    const weights: TextWeight[] = ['light', 'regular', 'medium', 'semibold', 'bold', 'extrabold'];

    weights.forEach((weight) => {
      it(`should render ${weight} weight without errors`, () => {
        const { getByText } = renderWithTheme(<Text weight={weight}>Weighted Text</Text>);
        expect(getByText('Weighted Text')).toBeTruthy();
      });
    });
  });

  describe('Text Alignment', () => {
    const alignments = ['left', 'center', 'right', 'auto'] as const;

    alignments.forEach((align) => {
      it(`should render ${align} alignment without errors`, () => {
        const { getByText } = renderWithTheme(<Text align={align}>Aligned Text</Text>);
        expect(getByText('Aligned Text')).toBeTruthy();
      });
    });
  });

  describe('Text Decorations', () => {
    it('should render uppercase text', () => {
      const { getByText } = renderWithTheme(<Text uppercase>text</Text>);
      expect(getByText('text')).toBeTruthy();
    });

    it('should render italic text', () => {
      const { getByText } = renderWithTheme(<Text italic>Italic</Text>);
      expect(getByText('Italic')).toBeTruthy();
    });

    it('should render strikethrough text', () => {
      const { getByText } = renderWithTheme(<Text strikethrough>Struck</Text>);
      expect(getByText('Struck')).toBeTruthy();
    });

    it('should render underlined text', () => {
      const { getByText } = renderWithTheme(<Text underline>Underlined</Text>);
      expect(getByText('Underlined')).toBeTruthy();
    });
  });

  describe('Combined Props', () => {
    it('should handle multiple style props', () => {
      const { getByText } = renderWithTheme(
        <Text uppercase variant="h1" color="primary" weight="bold" align="center">
          Combined Styles
        </Text>
      );
      expect(getByText('Combined Styles')).toBeTruthy();
    });

    it('should handle variant with decorations', () => {
      const { getByText } = renderWithTheme(
        <Text italic strikethrough variant="body">
          Decorated Body
        </Text>
      );
      expect(getByText('Decorated Body')).toBeTruthy();
    });
  });

  describe('Number of Lines', () => {
    it('should accept numberOfLines prop', () => {
      const longText =
        'This is a very long text that should be truncated after a certain number of lines to prevent overflow in the UI';
      const { getByText } = renderWithTheme(<Text numberOfLines={2}>{longText}</Text>);
      expect(getByText(longText)).toBeTruthy();
    });

    it('should accept ellipsizeMode prop', () => {
      const { getByText } = renderWithTheme(
        <Text numberOfLines={1} ellipsizeMode="tail">
          Truncated text
        </Text>
      );
      expect(getByText('Truncated text')).toBeTruthy();
    });
  });

  describe('Custom Styles', () => {
    it('should accept custom style prop', () => {
      const { getByText } = renderWithTheme(<Text style={{ marginTop: 10 }}>Custom styled</Text>);
      expect(getByText('Custom styled')).toBeTruthy();
    });

    it('should merge custom styles with variant styles', () => {
      const { getByText } = renderWithTheme(
        <Text variant="h1" style={{ marginBottom: 20 }}>
          Merged styles
        </Text>
      );
      expect(getByText('Merged styles')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should accept accessibility props', () => {
      const { getByText } = renderWithTheme(
        <Text
          accessible
          accessibilityLabel="Accessible text"
          accessibilityRole="header"
          accessibilityHint="This is a heading"
        >
          Accessible
        </Text>
      );
      expect(getByText('Accessible')).toBeTruthy();
    });

    it('should support accessibilityState', () => {
      const { getByText } = renderWithTheme(
        <Text accessibilityState={{ disabled: true }}>Disabled text</Text>
      );
      expect(getByText('Disabled text')).toBeTruthy();
    });
  });

  describe('Press Events', () => {
    it('should handle onPress event', () => {
      const onPress = jest.fn();
      const { getByText } = renderWithTheme(<Text onPress={onPress}>Pressable</Text>);

      const text = getByText('Pressable');
      expect(text).toBeTruthy();
    });

    it('should handle onLongPress event', () => {
      const onLongPress = jest.fn();
      const { getByText } = renderWithTheme(<Text onLongPress={onLongPress}>Long Press</Text>);

      const text = getByText('Long Press');
      expect(text).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should render empty string', () => {
      const { container } = renderWithTheme(<Text />);
      expect(container).toBeTruthy();
    });

    it('should render number children', () => {
      const { getByText } = renderWithTheme(<Text>{123}</Text>);
      expect(getByText('123')).toBeTruthy();
    });

    it('should handle undefined children', () => {
      const { container } = renderWithTheme(<Text>{undefined}</Text>);
      expect(container).toBeTruthy();
    });

    it('should handle null children', () => {
      const { container } = renderWithTheme(<Text>{null}</Text>);
      expect(container).toBeTruthy();
    });
  });
});
