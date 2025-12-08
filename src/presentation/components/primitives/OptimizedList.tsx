/**
 * Optimized List Components
 *
 * FlashList implementation for high-performance list rendering.
 * Up to 10x faster than FlatList for large datasets.
 */

import React, { memo, useCallback } from 'react';
import { View, StyleSheet, ViewToken } from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useTheme, layoutConstants } from '../../theme';
import { designTokens } from '../../theme/designTokens';
import { logger } from '../../../shared/utils/logger';
import {
  LIST_THRESHOLDS,
  FLEX,
  TEXT_VARIANT,
  TEXT_COLOR,
  TEXT_WEIGHT,
  LOG_MESSAGES,
} from '../../../shared/constants';
import { MATH } from '../../../shared/constants/numbers';
import { Text } from './Text';

// ============================================================================
// FlashList Wrapper with Best Practices
// ============================================================================

export interface OptimizedListProps<T> {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  estimatedItemSize: number;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  ListEmptyComponent?: React.ComponentType<object> | React.ReactElement | null;
  ListHeaderComponent?: React.ComponentType<object> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<object> | React.ReactElement | null;
  refreshing?: boolean;
  onRefresh?: () => void;
}

/**
 * Optimized List Component using FlashList
 *
 * @example
 * ```typescript
 * <OptimizedList
 *   data={items}
 *   renderItem={({ item }) => <ItemCard {...item} />}
 *   keyExtractor={(item) => item.id}
 *   estimatedItemSize={100}
 *   onEndReached={loadMore}
 * />
 * ```
 */
export function OptimizedList<T>({
  data,
  renderItem,
  keyExtractor,
  estimatedItemSize,
  onEndReached,
  onEndReachedThreshold = LIST_THRESHOLDS.ON_END_REACHED,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
  refreshing,
  onRefresh,
}: OptimizedListProps<T>): React.JSX.Element {
  // Memoize viewability config
  const viewabilityConfig = {
    itemVisiblePercentThreshold: LIST_THRESHOLDS.ITEM_VISIBLE_PERCENT,
    minimumViewTime: LIST_THRESHOLDS.MINIMUM_VIEW_TIME,
  };

  // Memoize viewability change handler
  const onViewableItemsChanged = useCallback(
    (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      // Track which items are visible for analytics
      logger.debug(LOG_MESSAGES.LIST.VIEWABLE_ITEMS, {
        count: info.viewableItems.length,
        items: info.viewableItems.map((v) => v.key),
      });
    },
    []
  );

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={estimatedItemSize}
      // Performance optimizations
      drawDistance={estimatedItemSize * MATH.FIVE} // Render 5 screens ahead
      removeClippedSubviews
      // Pagination
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      // Viewability tracking
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
      // Pull to refresh
      refreshing={refreshing}
      onRefresh={onRefresh}
      // Components
      ListEmptyComponent={ListEmptyComponent}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
    />
  );
}

// ============================================================================
// Example: Optimized User List
// ============================================================================

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UserListItemProps {
  user: User;
  onPress: (id: string) => void;
}

const UserListItem = memo<UserListItemProps>(function UserListItem({ user, onPress: _onPress }) {
  const { theme, colors } = useTheme();

  return (
    <View
      style={[
        styles.userItem,
        { backgroundColor: theme.colors.surface, borderBottomColor: colors.border },
      ]}
    >
      <View style={[styles.avatar, { backgroundColor: colors.info }]}>
        <Text variant={TEXT_VARIANT.BODY} color={TEXT_COLOR.ON_PRIMARY}>
          {user.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.userInfo}>
        <Text variant={TEXT_VARIANT.BODY} weight={TEXT_WEIGHT.SEMIBOLD} style={styles.userName}>
          {user.name}
        </Text>
        <Text variant={TEXT_VARIANT.BODY_SMALL} color={TEXT_COLOR.SECONDARY}>
          {user.email}
        </Text>
      </View>
    </View>
  );
});

interface OptimizedUserListProps {
  users: User[];
  onUserPress: (id: string) => void;
  onLoadMore?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  /** Empty state message (pass translated string from screen) */
  emptyMessage?: string;
}

/**
 * Example: Optimized User List with FlashList
 *
 * @example
 * ```typescript
 * <OptimizedUserList
 *   users={users}
 *   onUserPress={handleUserPress}
 *   onLoadMore={loadMoreUsers}
 *   refreshing={isRefreshing}
 *   onRefresh={handleRefresh}
 * />
 * ```
 */
export const OptimizedUserList = memo<OptimizedUserListProps>(function OptimizedUserList({
  users,
  onUserPress,
  onLoadMore,
  refreshing,
  onRefresh,
  emptyMessage,
}) {
  const renderItem = useCallback<ListRenderItem<User>>(
    ({ item }) => <UserListItem user={item} onPress={onUserPress} />,
    [onUserPress]
  );

  const keyExtractor = useCallback((item: User) => item.id, []);

  const ListEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text variant={TEXT_VARIANT.BODY_LARGE} color={TEXT_COLOR.SECONDARY}>
          {emptyMessage}
        </Text>
      </View>
    ),
    [emptyMessage]
  );

  return (
    <OptimizedList
      data={users}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={80}
      onEndReached={onLoadMore}
      ListEmptyComponent={ListEmptyComponent}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
});

// ============================================================================
// FlashList Best Practices
// ============================================================================

/**
 * FLASHLIST BEST PRACTICES:
 *
 * 1. Always provide estimatedItemSize:
 *    - Should be close to actual item size
 *    - Better estimation = better performance
 *    - Measure actual rendered items to get accurate size
 *
 * 2. Use consistent item sizes:
 *    - FlashList works best with similar item sizes
 *    - For variable sizes, provide getItemType
 *
 * 3. Memoize renderItem:
 *    - Use useCallback to prevent re-creating function
 *    - Memoize item components with React.memo
 *
 * 4. Provide stable keyExtractor:
 *    - Use unique, stable IDs (not index)
 *    - Memoize keyExtractor function
 *
 * 5. Optimize item components:
 *    - Keep items simple and lightweight
 *    - Avoid complex layouts in items
 *    - Use React.memo for list items
 *
 * 6. Configure drawDistance:
 *    - Default is usually good
 *    - Increase for smoother scrolling
 *    - Decrease to reduce memory usage
 *
 * 7. Handle viewability:
 *    - Track visible items for analytics
 *    - Pause/play videos based on visibility
 *    - Load images only when visible
 *
 * 8. Migration from FlatList:
 *    - FlashList API is very similar
 *    - Main difference: estimatedItemSize is required
 *    - Remove horizontal prop (use FlashList's horizontal support)
 *
 * @example
 * ```typescript
 * // Migration example:
 *
 * // Before (FlatList):
 * <FlatList
 *   data={items}
 *   renderItem={renderItem}
 *   keyExtractor={keyExtractor}
 * />
 *
 * // After (FlashList):
 * <FlashList
 *   data={items}
 *   renderItem={renderItem}
 *   keyExtractor={keyExtractor}
 *   estimatedItemSize={100} // Add this!
 * />
 * ```
 *
 * Performance Comparison:
 * - FlatList: ~30 FPS with 1000 items
 * - FlashList: ~60 FPS with 1000 items
 * - Memory: FlashList uses ~30% less memory
 */

const styles = StyleSheet.create({
  userItem: {
    flexDirection: layoutConstants.flexDirection.row,
    padding: designTokens.spacing.lg,
    alignItems: layoutConstants.alignItems.center,
    borderBottomWidth: designTokens.borderWidth.thin,
  },
  avatar: {
    width: designTokens.componentSizes.iconContainer.lg,
    height: designTokens.componentSizes.iconContainer.lg,
    borderRadius: designTokens.borderRadius['3xl'],
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    marginRight: designTokens.spacing.lg,
  },
  userInfo: {
    flex: FLEX.ONE,
  },
  userName: {
    marginBottom: designTokens.spacing.xs,
  },
  emptyContainer: {
    flex: FLEX.ONE,
    alignItems: layoutConstants.alignItems.center,
    justifyContent: layoutConstants.justifyContent.center,
    padding: designTokens.spacing['4xl'],
  },
});
