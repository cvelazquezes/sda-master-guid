/**
 * Optimized Components
 *
 * Examples of React.memo usage and performance best practices.
 * Use these patterns throughout the app for optimal performance.
 */

import React, { memo, useCallback, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewProps } from 'react-native';
import { useTheme, layoutConstants } from '../theme';
import { designTokens } from '../theme/designTokens';
import { COMPONENT_VARIANT, FLEX } from '../constants';
import { Text } from './Text';

// ============================================================================
// Basic React.memo Example
// ============================================================================

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: typeof COMPONENT_VARIANT.primary | typeof COMPONENT_VARIANT.secondary;
  disabled?: boolean;
}

/**
 * Optimized Button Component
 *
 * Only re-renders when props actually change.
 *
 * @example
 * ```typescript
 * <OptimizedButton
 *   title="Click Me"
 *   onPress={handleClick}
 *   variant="primary"
 * />
 * ```
 */
export const OptimizedButton = memo<ButtonProps>(function OptimizedButton({
  title,
  onPress,
  variant = COMPONENT_VARIANT.primary,
  disabled = false,
}) {
  const { theme } = useTheme();

  const backgroundColor =
    variant === COMPONENT_VARIANT.primary ? theme.colors.primary : theme.colors.secondary;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text variant="bodyLarge" weight="semibold" color="onPrimary">
        {title}
      </Text>
    </TouchableOpacity>
  );
});

// ============================================================================
// React.memo with Custom Comparison
// ============================================================================

interface CardProps {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  onPress: (id: string) => void;
}

/**
 * Optimized Card Component with custom comparison
 *
 * Only re-renders when specific props change (ignores onPress reference changes)
 */
export const OptimizedCard = memo<CardProps>(
  function OptimizedCard({ id, title, description, timestamp, onPress }) {
    const { theme } = useTheme();

    const handlePress = useCallback(() => {
      onPress(id);
    }, [id, onPress]);

    const formattedDate = useMemo(() => {
      return timestamp.toLocaleDateString();
    }, [timestamp]);

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        onPress={handlePress}
      >
        <Text variant="h3" style={styles.cardTitle}>
          {title}
        </Text>
        <Text variant="bodySmall" color="secondary" style={styles.cardDescription}>
          {description}
        </Text>
        <Text variant="caption" color="secondary">
          {formattedDate}
        </Text>
      </TouchableOpacity>
    );
  },
  // Custom comparison function
  (prevProps, nextProps) => {
    // Only re-render if these props change
    return (
      prevProps.id === nextProps.id &&
      prevProps.title === nextProps.title &&
      prevProps.description === nextProps.description &&
      prevProps.timestamp.getTime() === nextProps.timestamp.getTime()
    );
    // onPress is intentionally excluded from comparison
  }
);

// ============================================================================
// Optimized List Item
// ============================================================================

interface ListItemProps {
  id: string;
  name: string;
  email: string;
  onPress: (id: string) => void;
  selected?: boolean;
}

/**
 * Optimized List Item for use in FlatList
 *
 * @example
 * ```typescript
 * <FlatList
 *   data={items}
 *   renderItem={({ item }) => (
 *     <OptimizedListItem
 *       id={item.id}
 *       name={item.name}
 *       email={item.email}
 *       onPress={handlePress}
 *       selected={item.id === selectedId}
 *     />
 *   )}
 *   keyExtractor={(item) => item.id}
 * />
 * ```
 */
export const OptimizedListItem = memo<ListItemProps>(function OptimizedListItem({
  id,
  name,
  email,
  onPress,
  selected = false,
}) {
  const { theme, colors } = useTheme();

  const handlePress = useCallback(() => {
    onPress(id);
  }, [id, onPress]);

  const backgroundColor = selected ? theme.colors.primaryLight : theme.colors.surface;

  return (
    <TouchableOpacity
      style={[styles.listItem, { backgroundColor, borderBottomColor: colors.border }]}
      onPress={handlePress}
    >
      <View style={styles.listItemContent}>
        <Text variant="body" weight="semibold" style={styles.listItemName}>
          {name}
        </Text>
        <Text variant="bodySmall" color="secondary">
          {email}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

// ============================================================================
// Optimized Container with Children
// ============================================================================

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  padding?: number;
}

/**
 * Optimized Container Component
 *
 * Memoizes container to prevent re-renders when parent updates
 * but container props haven't changed.
 */
export const OptimizedContainer = memo<ContainerProps>(function OptimizedContainer({
  children,
  padding = designTokens.spacing.lg,
  style,
  ...rest
}) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.background,
          padding,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
});

// ============================================================================
// Performance Best Practices Guide
// ============================================================================

/**
 * BEST PRACTICES:
 *
 * 1. Use React.memo for components that:
 *    - Render often with same props
 *    - Are in lists (FlatList items)
 *    - Have expensive render logic
 *    - Receive stable props
 *
 * 2. DON'T use React.memo for:
 *    - Components that rarely re-render
 *    - Components with always-changing props
 *    - Very simple components (overhead > benefit)
 *
 * 3. Combine with useMemo and useCallback:
 *    - useMemo for expensive calculations
 *    - useCallback for stable function references
 *
 * 4. Custom comparison functions:
 *    - Use when you want fine-grained control
 *    - Ignore props that don't affect render
 *    - Keep comparison logic simple
 *
 * 5. List optimization:
 *    - Always use keyExtractor
 *    - Memoize list items
 *    - Use FlatList's built-in optimizations
 *    - Consider using FlashList for very large lists
 *
 * @example
 * ```typescript
 * // Good: Stable callback
 * const handlePress = useCallback((id: string) => {
 *   console.log(id);
 * }, []); // Empty deps = stable reference
 *
 * // Good: Memoized expensive calculation
 * const sortedData = useMemo(() => {
 *   return data.sort((a, b) => a.name.localeCompare(b.name));
 * }, [data]); // Only recalculate when data changes
 *
 * // Good: Memoized component
 * const MemoizedItem = memo(Item);
 * ```
 */

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: designTokens.spacing.xxl,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.md,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
  },
  disabled: {
    opacity: designTokens.opacity.medium,
  },
  card: {
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    marginBottom: designTokens.spacing.md,
  },
  cardTitle: {
    marginBottom: designTokens.spacing.sm,
  },
  cardDescription: {
    marginBottom: designTokens.spacing.sm,
  },
  listItem: {
    padding: designTokens.spacing.lg,
    borderBottomWidth: designTokens.borderWidth.thin,
    // borderBottomColor is set dynamically via useTheme
  },
  listItemContent: {
    flex: FLEX.ONE,
  },
  listItemName: {
    marginBottom: designTokens.spacing.xs,
  },
});
