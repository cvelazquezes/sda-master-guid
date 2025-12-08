# Theme Usage Guide

This guide explains how to correctly use the theme system in this React Native application.

## Quick Start

```typescript
import { useTheme } from '@/ui';

function MyComponent() {
  const { colors, spacing, radii, typography, iconSizes } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background, padding: spacing.lg }}>
      <Text style={{ color: colors.textPrimary }}>Hello!</Text>
    </View>
  );
}
```

## Architecture Overview

### Single Source of Truth

The application uses a centralized theme system with:

1. **ThemeProvider** - Wraps the app at root level
2. **useTheme()** - Hook to access all theme values
3. **Design Tokens** - Raw values (only used by UI primitives)

### What `useTheme()` Returns

```typescript
interface ThemeContextType {
  // Theme mode
  mode: 'light' | 'dark' | 'system';
  activeTheme: 'light' | 'dark';
  isDark: boolean;

  // Visual tokens (USE THESE!)
  colors: ThemeColors; // Theme-aware colors
  spacing: SpacingTokens; // Spacing scale (xs, sm, md, lg, xl, etc.)
  radii: RadiusTokens; // Border radius values
  typography: TypographyTokens; // Font sizes, weights, line heights
  shadows: ShadowTokens; // Shadow presets
  iconSizes: IconSizeTokens; // Icon size scale
  componentSizes: ComponentSizeTokens; // Button, input heights, etc.

  // Theme-aware semantic colors
  statusColors: StatusColors; // active, inactive, pending, etc.
  roleColors: RoleColors; // admin, club_admin, user

  // Actions
  setTheme: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
}
```

## Rules

### ✅ DO: Use `useTheme()` for Colors

```typescript
// ✅ CORRECT
const { colors } = useTheme();

<View style={{ backgroundColor: colors.background }}>
  <Text style={{ color: colors.textPrimary }}>Hello</Text>
</View>
```

### ❌ DON'T: Import designTokens in Features

```typescript
// ❌ FORBIDDEN in feature code (screens/, features/)
import { designTokens } from '../../shared/theme/designTokens';

// Use useTheme() instead:
const { spacing, radii } = useTheme();
```

### ❌ DON'T: Use Hardcoded Colors

```typescript
// ❌ FORBIDDEN
<View style={{ backgroundColor: '#FFFFFF' }}>
<View style={{ backgroundColor: isDark ? '#000' : '#FFF' }}>

// ✅ CORRECT
<View style={{ backgroundColor: colors.surface }}>
```

### ❌ DON'T: Use `useColorScheme()` for Styling

```typescript
// ❌ FORBIDDEN in features
import { useColorScheme } from 'react-native';
const scheme = useColorScheme();
const bg = scheme === 'dark' ? '#000' : '#fff';

// ✅ CORRECT
const { colors } = useTheme();
const bg = colors.background; // Automatically correct
```

### ❌ DON'T: Branch on `isDark` for Colors

```typescript
// ❌ FORBIDDEN
const { isDark, colors } = useTheme();
const textColor = isDark ? colors.white : colors.black;

// ✅ CORRECT - Use semantic colors
const { colors } = useTheme();
const textColor = colors.textPrimary; // Automatically correct for theme
```

## Semantic Colors

Always use semantic color names instead of literal colors:

| Instead of        | Use                    |
| ----------------- | ---------------------- |
| `white` / `black` | `colors.textPrimary`   |
| `gray`            | `colors.textSecondary` |
| `lightGray`       | `colors.border`        |
| `blue`            | `colors.primary`       |
| `red`             | `colors.error`         |
| `green`           | `colors.success`       |
| `yellow`          | `colors.warning`       |

## Common Color Keys

```typescript
// Text colors
colors.textPrimary; // Main text
colors.textSecondary; // Muted text
colors.textTertiary; // Very muted text
colors.textDisabled; // Disabled state
colors.textOnPrimary; // Text on primary color background

// Background colors
colors.background; // Main background
colors.backgroundSecondary; // Secondary background
colors.surface; // Card/elevated surfaces

// Interactive colors
colors.primary; // Primary actions
colors.secondary; // Secondary actions
colors.accent; // Accent/highlight

// Semantic colors
colors.success; // Success states
colors.warning; // Warning states
colors.error; // Error states
colors.info; // Information states

// Borders
colors.border; // Default border
colors.borderLight; // Light border
colors.borderFocus; // Focused input border
colors.borderError; // Error state border
```

## Using Spacing

```typescript
const { spacing } = useTheme();

// Spacing scale
spacing.none; // 0
spacing.xxs; // 2
spacing.xs; // 4
spacing.sm; // 8
spacing.md; // 12
spacing.lg; // 16
spacing.xl; // 20
spacing.xxl; // 24
spacing['3xl']; // 32
spacing['4xl']; // 40
```

## Using Border Radius

```typescript
const { radii } = useTheme();

radii.none; // 0
radii.xs; // 2
radii.sm; // 4
radii.md; // 6
radii.lg; // 8
radii.xl; // 12
radii['2xl']; // 16
radii.full; // 9999 (circular)
```

## Status Colors

For status indicators (badges, chips, etc.):

```typescript
const { statusColors } = useTheme();

// Each status has: primary, light, medium, text, icon
statusColors.active.primary; // Green for active
statusColors.pending.primary; // Orange for pending
statusColors.inactive.primary; // Gray for inactive
statusColors.completed.primary; // Blue for completed
```

## Role Colors

For user role badges:

```typescript
const { roleColors } = useTheme();

roleColors.admin.primary; // Red for admin
roleColors.club_admin.primary; // Blue for club admin
roleColors.user.primary; // Gray for regular user
```

## Complete Example

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/ui';
import { Text, Card, Button } from '@/ui';

function ProfileCard({ user }) {
  const { colors, spacing, radii, statusColors } = useTheme();

  // Dynamic styles using theme
  const containerStyle = {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: user.isActive
      ? statusColors.active.primary
      : statusColors.inactive.primary,
  };

  return (
    <View style={containerStyle}>
      <Text variant="h3">{user.name}</Text>
      <Text variant="body" color="secondary">{user.email}</Text>
      <Button
        title="View Profile"
        onPress={() => {}}
        variant="primary"
      />
    </View>
  );
}
```

## Migration Guide

If you're updating old code that imports `designTokens`:

### Before

```typescript
import { designTokens } from '../../shared/theme/designTokens';

const styles = StyleSheet.create({
  container: {
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.md,
  },
});
```

### After

For static styles that don't need theme awareness:

```typescript
import { useTheme } from '@/ui';

function MyComponent() {
  const { spacing, radii } = useTheme();

  return (
    <View style={{ padding: spacing.lg, borderRadius: radii.md }}>
      {/* content */}
    </View>
  );
}
```

## Where Token Imports ARE Allowed

| Location          | Can Import designTokens? |
| ----------------- | ------------------------ |
| `src/shared/`     | ✅ Yes                   |
| `src/ui/`         | ✅ Yes                   |
| `src/screens/`    | ❌ No - use useTheme()   |
| `src/features/`   | ❌ No - use useTheme()   |
| `src/components/` | ❌ No - use useTheme()   |

## PR Checklist

When reviewing PRs, check:

- [ ] No `designTokens` imports in feature code
- [ ] No hardcoded colors (hex, rgb, etc.)
- [ ] No `useColorScheme()` for styling decisions
- [ ] No `isDark ? X : Y` for color values
- [ ] Uses semantic color names (textPrimary, not white)
- [ ] Uses spacing/radii from useTheme()
