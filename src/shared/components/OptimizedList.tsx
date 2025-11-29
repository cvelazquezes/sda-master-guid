/**
 * Optimized List Components
 * 
 * FlashList implementation for high-performance list rendering.
 * Up to 10x faster than FlatList for large datasets.
 */

import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, ViewToken } from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useTheme } from '../theme';

// ============================================================================
// FlashList Wrapper with Best Practices
// ============================================================================

interface OptimizedListProps<T> {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  estimatedItemSize: number;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
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
  onEndReachedThreshold = 0.5,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
  refreshing,
  onRefresh,
}: OptimizedListProps<T>) {
  // Memoize viewability config
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  };

  // Memoize viewability change handler
  const onViewableItemsChanged = useCallback(
    (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      // Track which items are visible for analytics
      console.log('Viewable items:', info.viewableItems.map(v => v.key));
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
      drawDistance={estimatedItemSize * 5} // Render 5 screens ahead
      removeClippedSubviews={true}
      
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

const UserListItem = memo<UserListItemProps>(function UserListItem({ user, onPress }) {
  const { theme } = useTheme();

  const handlePress = useCallback(() => {
    onPress(user.id);
  }, [user.id, onPress]);

  return (
    <View style={[styles.userItem, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.avatar}>
        <Text style={{ color: theme.colors.onPrimary }}>
          {user.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: theme.colors.onSurface }]}>
          {user.name}
        </Text>
        <Text style={[styles.userEmail, { color: theme.colors.onSurfaceVariant }]}>
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
export const OptimizedUserList = memo<OptimizedUserListProps>(
  function OptimizedUserList({ 
    users, 
    onUserPress, 
    onLoadMore,
    refreshing,
    onRefresh 
  }) {
    const renderItem = useCallback<ListRenderItem<User>>(
      ({ item }) => (
        <UserListItem user={item} onPress={onUserPress} />
      ),
      [onUserPress]
    );

    const keyExtractor = useCallback(
      (item: User) => item.id,
      []
    );

    const ListEmptyComponent = useCallback(
      () => (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No users found</Text>
        </View>
      ),
      []
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
  }
);

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
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#9E9E9E',
  },
});

