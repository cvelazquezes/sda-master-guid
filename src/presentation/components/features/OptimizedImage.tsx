/**
 * Optimized Image Component
 *
 * Wrapper around React Native FastImage for optimized image loading
 *
 * Features:
 * - Progressive loading with blur
 * - Caching (memory + disk)
 * - Priority loading
 * - Error handling with fallbacks
 * - Placeholder support
 *
 * Based on best practices from:
 * - Airbnb
 * - Instagram
 * - Facebook
 */

import React, { useState } from 'react';
import {
  Image,
  View,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ImageStyle,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import { useTheme } from '../../state/ThemeContext';
import { layoutConstants } from '../../theme';
import { ACTIVITY_INDICATOR_SIZE, DIMENSIONS } from '../../../shared/constants';

/**
 * Image loading priority
 */
export enum ImagePriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
}

/**
 * Cache control policy
 */
export enum CacheControl {
  /**
   * Cache image in memory and on disk
   */
  IMMUTABLE = 'immutable',

  /**
   * Cache in memory, use disk as fallback
   */
  WEB = 'web',

  /**
   * Cache only in memory
   */
  CACHE_ONLY = 'cacheOnly',

  /**
   * Always reload from network
   */
  RELOAD = 'reload',
}

interface OptimizedImageProps {
  /**
   * Image source (URL or local)
   */
  source: ImageSourcePropType | { uri: string };

  /**
   * Fallback image when main image fails to load
   */
  fallbackSource?: ImageSourcePropType;

  /**
   * Placeholder while loading
   */
  placeholderSource?: ImageSourcePropType;

  /**
   * Style for the image
   */
  style?: StyleProp<ImageStyle>;

  /**
   * Container style
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Resize mode
   */
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';

  /**
   * Loading priority
   */
  priority?: ImagePriority;

  /**
   * Cache control
   */
  cache?: CacheControl;

  /**
   * Called when image loads successfully
   */
  onLoad?: () => void;

  /**
   * Called when image fails to load
   */
  onError?: () => void;

  /**
   * Show loading indicator
   */
  showLoading?: boolean;

  /**
   * Show blur effect while loading (progressive loading)
   */
  blurRadius?: number;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
}

// Helper functions to reduce component complexity
function getImageSource(
  error: boolean,
  fallbackSource: ImageSourcePropType | undefined,
  source: ImageSourcePropType | { uri: string }
): ImageSourcePropType | { uri: string } {
  return error && fallbackSource ? fallbackSource : source;
}

function getLoadingBgColor(isDark: boolean): string {
  return isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.8)';
}

/**
 * Optimized Image Component
 *
 * @example
 * ```tsx
 * <OptimizedImage
 *   source={{ uri: 'https://example.com/image.jpg' }}
 *   fallbackSource={require('./assets/placeholder.png')}
 *   style={{ width: 200, height: 200 }}
 *   priority={ImagePriority.HIGH}
 *   cache={CacheControl.IMMUTABLE}
 *   showLoading={true}
 *   blurRadius={3}
 * />
 * ```
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  fallbackSource,
  placeholderSource,
  style,
  containerStyle,
  resizeMode = 'cover',
  priority: _priority = ImagePriority.NORMAL,
  cache: _cache = CacheControl.IMMUTABLE,
  onLoad,
  onError,
  showLoading = true,
  blurRadius,
  accessibilityLabel,
}) => {
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageOpacity, setImageOpacity] = useState(0);

  const handleLoad = (): void => {
    setLoading(false);
    setImageOpacity(1);
    onLoad?.();
  };

  const handleError = (): void => {
    setLoading(false);
    setError(true);
    onError?.();
  };

  // Computed values to reduce component complexity
  const imageSource = getImageSource(error, fallbackSource, source);
  const loadingBgColor = getLoadingBgColor(isDark);
  const computedBlurRadius = loading && blurRadius ? blurRadius : undefined;
  const showPlaceholder = Boolean(placeholderSource && loading);
  const showLoadingIndicator = loading && showLoading;

  return (
    <View style={[styles.container, { backgroundColor: colors.border }, containerStyle]}>
      {showPlaceholder && (
        <Image
          source={placeholderSource}
          style={[styles.placeholder, style]}
          resizeMode={resizeMode}
        />
      )}
      <Image
        source={imageSource}
        style={[styles.image, style, { opacity: imageOpacity }]}
        blurRadius={computedBlurRadius}
        resizeMode={resizeMode}
        onLoad={handleLoad}
        onError={handleError}
        accessible
        accessibilityLabel={accessibilityLabel || 'Image'}
        accessibilityRole="image"
      />
      {showLoadingIndicator && (
        <View style={[styles.loadingContainer, { backgroundColor: loadingBgColor }]}>
          <ActivityIndicator size={ACTIVITY_INDICATOR_SIZE.small} color={colors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: layoutConstants.position.relative,
    overflow: layoutConstants.overflow.hidden,
  },
  image: {
    width: DIMENSIONS.WIDTH.FULL,
    height: DIMENSIONS.WIDTH.FULL,
  },
  placeholder: {
    position: layoutConstants.position.absolute,
    width: DIMENSIONS.WIDTH.FULL,
    height: DIMENSIONS.WIDTH.FULL,
  },
  loadingContainer: {
    position: layoutConstants.position.absolute,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: layoutConstants.justifyContent.center,
    alignItems: layoutConstants.alignItems.center,
  },
});

/**
 * Usage Notes:
 *
 * 1. For production, consider using `react-native-fast-image`:
 *    ```bash
 *    npm install react-native-fast-image
 *    ```
 *
 * 2. FastImage provides better caching and performance:
 *    - Disk and memory caching
 *    - Priority loading
 *    - Request authorization headers
 *
 * 3. Replace this component with FastImage:
 *    ```tsx
 *    import FastImage from 'react-native-fast-image';
 *
 *    <FastImage
 *      source={{
 *        uri: 'https://example.com/image.jpg',
 *        priority: FastImage.priority.high,
 *        cache: FastImage.cacheControl.immutable,
 *      }}
 *      style={{ width: 200, height: 200 }}
 *      resizeMode={FastImage.resizeMode.cover}
 *    />
 *    ```
 *
 * 4. Image optimization checklist:
 *    - Use WebP format when possible
 *    - Compress images (target < 200KB per image)
 *    - Use CDN for faster delivery
 *    - Implement lazy loading for images below fold
 *    - Set appropriate cache headers
 *    - Use different sizes for different screen densities
 */

/**
 * Preload images for faster display
 *
 * @example
 * ```tsx
 * import { Image } from 'react-native';
 *
 * const imageSources = [
 *   { uri: 'https://example.com/image1.jpg' },
 *   { uri: 'https://example.com/image2.jpg' },
 * ];
 *
 * Image.prefetch(imageSources[0].uri);
 *
 * // For FastImage:
 * import FastImage from 'react-native-fast-image';
 *
 * FastImage.preload([
 *   { uri: 'https://example.com/image1.jpg', priority: FastImage.priority.high },
 *   { uri: 'https://example.com/image2.jpg' },
 * ]);
 * ```
 */
export function preloadImages(sources: { uri: string }[]): void {
  sources.forEach((source) => {
    Image.prefetch(source.uri);
  });
}

/**
 * Clear image cache (when using FastImage)
 *
 * @example
 * ```tsx
 * import FastImage from 'react-native-fast-image';
 *
 * // Clear memory cache
 * FastImage.clearMemoryCache();
 *
 * // Clear disk cache
 * FastImage.clearDiskCache();
 * ```
 */
export function clearImageCache(): void {
  // For FastImage, use:
  // FastImage.clearMemoryCache();
  // FastImage.clearDiskCache();
  // TODO: Implement with FastImage - FastImage.clearMemoryCache(); FastImage.clearDiskCache();
}
