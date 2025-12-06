# Design System Guide

This document outlines the architecture and rules for the UI design system in this codebase.

## Table of Contents

1. [Token Architecture](#token-architecture)
2. [UI Primitives](#ui-primitives)
3. [Screen Refactoring](#screen-refactoring)
4. [Feature Structure](#feature-structure)
5. [Storybook](#storybook)
6. [ESLint Enforcement](#eslint-enforcement)
7. [Component Extraction](#component-extraction)

---

## 1. Token Architecture

**Goal**: No more "random" colors/sizes. All visual decisions go through tokens.

### Token Structure

```
src/shared/theme/tokens/
├── primitives.ts    # Raw values (colors, numbers) - Theme agnostic
├── semantic.ts      # Semantic tokens mapped to primitives - Theme aware
├── components.ts    # Component-specific tokens - Composed from semantic
├── motion.ts        # Animation and transition tokens
├── layout.ts        # Breakpoints, grid, density configurations
├── behavior.ts      # UI timing, interactions, validation
├── types.ts         # TypeScript definitions
└── index.ts         # Main export
```

### Rules

| ❌ Bad | ✅ Good |
|--------|---------|
| `color: '#333'` | `color: colors.textPrimary` |
| `primaryBlue = '#0055ff'` | `primary = '#0055ff'` |
| `padding: 16` | `padding: designTokens.spacing.lg` |

### Theme Support

```typescript
// Light and Dark themes are ready from day 1
import { lightTheme, darkTheme } from '@/ui';

// Theme type structure
export type Theme = {
  colors: typeof colors;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
};
```

---

## 2. UI Primitives

**Goal**: All screens use the same basic building blocks.

### Import from `@/ui`

```typescript
// ❌ BAD - Don't import directly from react-native in features
import { Text, View, TextInput } from 'react-native';

// ✅ GOOD - Import from UI library
import { Text, Card, Button, Input } from '../../shared/components';
// or
import { Text, Card, Button, Input } from '@/ui';
```

### Available Primitives

| Component | Purpose |
|-----------|---------|
| `Text` | ALL text rendering |
| `Button` | Interactive buttons |
| `Input` | Text inputs |
| `Card` | Content containers |
| `Badge` | Status indicators |
| `IconButton` | Icon-only buttons |
| `Divider` | Visual separators |
| `EmptyState` | Empty state placeholders |
| `Modal` | Modal dialogs |

### Text Primitive Example

```tsx
// ❌ BAD - Raw RN Text with inline styles
<Text style={{ fontSize: 18, fontWeight: '600', color: '#333' }}>Title</Text>

// ✅ GOOD - Text primitive with variant
<Text variant="h3">Title</Text>
<Text variant="body" color="secondary">Description</Text>
<Text variant="caption" weight="bold">Label</Text>
```

### Rules

1. **Primitives are generic** - No business meaning
   - ✅ `Button`, `Card`, `Input`
   - ❌ `CheckoutButton`, `ProductCard`

2. **Primitives read tokens** - Never define magic values
   - All padding, font sizes, radii sourced from tokens

3. **Use variant prop** - Prefer over boolean flags
   - ✅ `variant="primary" | "secondary" | "ghost"`
   - ❌ `primary`, `secondary`, `outline`, `danger`

4. **Primitives never fetch data** - They only accept props and render UI

---

## 3. Screen Refactoring

**Goal**: Screens stop talking directly to React Native's `Text`, `View`, `TextInput`.

### Before/After Example

```tsx
// ❌ BEFORE
import { Text, View, TouchableOpacity } from 'react-native';

<View style={{ padding: 16, backgroundColor: '#fff' }}>
  <Text style={{ fontSize: 18, fontWeight: '600' }}>Title</Text>
  <TouchableOpacity /* ... */>
    <Text style={{ color: '#fff' }}>Continue</Text>
  </TouchableOpacity>
</View>

// ✅ AFTER
import { Card, Text, Button } from '@/ui';

<Card>
  <Text variant="heading">Title</Text>
  <Button title="Continue" onPress={handleContinue} />
</Card>
```

### Allowed Escape Hatches

- `View` - Only for layout (flex, margin), no colors/styles
- `TouchableOpacity` - For custom press handling
- `Pressable` - For custom press states

### Migration Strategy

1. **New screens**: Must use primitives from day 1
2. **Existing screens**: Refactor when touched or during UI tasks
3. **Gradual adoption**: Don't rewrite everything at once

---

## 4. Feature Structure

**Goal**: Code is organized by domain, not by React "type".

### Folder Structure

```
src/
├── ui/                    # @yourorg/ui implementation
│   └── index.ts           # Public API
├── shared/
│   ├── components/        # UI primitives
│   ├── theme/             # Design tokens
│   └── hooks/             # Shared hooks
├── features/
│   ├── auth/
│   │   ├── screens/
│   │   └── components/
│   ├── checkout/
│   │   ├── screens/
│   │   └── components/
│   └── profile/
│       ├── screens/
│       └── components/
├── screens/               # Legacy - migrate to features
└── app/
    ├── navigation/
    └── providers/
```

### Rules

1. **Feature components belong to their feature**
   - Anything that knows about products, prices, orders → feature folder

2. **Cross-feature dependencies**
   - Features CAN depend on: `@/ui`, shared modules
   - Features should NOT import each other's components

3. **Reuse across features**: Extract to shared (see [Component Extraction](#component-extraction))

---

## 5. Storybook

**Goal**: UI package is visible, testable, and documentable.

### Rules

1. **Every exported component must have stories**
   - Minimum: default state + one variant

2. **Stories are for visuals, not business logic**
   - Show different props, states (loading, disabled, error)
   - Don't call real APIs

3. **Organization**
   ```typescript
   // Text.stories.tsx
   export default {
     title: 'Primitives/Text',
     component: Text,
   };
   ```

### Running Storybook

```bash
# Install dependencies (if not already)
npm install @storybook/react-native @storybook/addon-ondevice-controls

# Run Storybook
npm run storybook
```

---

## 6. ESLint Enforcement

**Goal**: Rules are not just "culture" - they're enforced by tools.

### Configured Rules

```javascript
// .eslintrc.js
{
  'no-restricted-imports': ['error', {
    paths: [{
      name: 'react-native',
      importNames: ['Text', 'TextInput'],
      message: 'Use Text and Input from @/ui instead.'
    }]
  }]
}
```

### What's Enforced

| Rule | Scope | Severity |
|------|-------|----------|
| Ban raw `Text`, `TextInput` | `src/screens/**`, `src/features/**` | Error |
| Warn inline styles | All | Warning |
| Allow raw imports | `src/shared/components/**` | Off |

---

## 7. Component Extraction

**Goal**: Don't build a huge UI library upfront. Promote components when they prove reusable.

### Extraction Criteria

Promote a component when:
1. **Used in 2-3+ different places**
2. **Has no feature-specific business logic** (or it can be removed)
3. **Makes sense as a generic UI pattern**

### Promotion Flow

```
1. Identify duplication
   └── Same "ListItem with icon and trailing chevron" in 3 features

2. Extract generic API
   └── Remove business copy, API calls, feature-specific props

3. Move to appropriate location
   └── ui/composed/       → Purely visual components
   └── features/common/   → Semi-domain shared components

4. Clean up old usage
   └── Replace ALL usages in same PR (avoid two versions)
```

### Naming Rules

| ❌ Bad | ✅ Good |
|--------|---------|
| `SettingsListItem` | `ListItem` |
| `CheckoutButton` | `Button` |
| `UserProfileCard` | `Card` |

Domains plug in props: `title`, `subtitle`, `icon`, `onPress`.

### Example Extraction

```tsx
// BEFORE: Duplicated in multiple features
// features/settings/components/SettingsRow.tsx
// features/profile/components/ProfileRow.tsx
// features/menu/components/MenuItem.tsx

// All share the same pattern: icon + text + chevron

// AFTER: Extracted to shared
// shared/components/ListItem.tsx
interface ListItemProps {
  icon?: string;
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  onPress?: () => void;
}

export const ListItem: React.FC<ListItemProps> = ({ ... }) => {
  // Generic implementation using tokens
};

// Usage in features
<ListItem
  icon="settings"
  title="Privacy Settings"
  onPress={navigateToPrivacy}
/>
```

---

## Quick Reference

### Import Patterns

```typescript
// Primitives (for screens and features)
import { Text, Button, Card, Input } from '../../shared/components';

// Tokens (for custom styling)
import { designTokens } from '../../shared/theme';
import { useDesignTokens } from '../../shared/hooks/useDesignTokens';

// Theme
import { useTheme } from '../../contexts/ThemeContext';
```

### Variant Cheat Sheet

**Text variants**: `displayLarge`, `h1`-`h4`, `body`, `bodySmall`, `label`, `caption`

**Text colors**: `primary`, `secondary`, `tertiary`, `disabled`, `error`, `success`, `link`

**Button variants**: `primary`, `secondary`, `accent`, `danger`, `outline`, `ghost`

**Card variants**: `default`, `elevated`, `outlined`, `flat`

---

## Migration Checklist

When touching a screen:

- [ ] Replace `import { Text } from 'react-native'` with `import { Text } from '@/ui'`
- [ ] Replace `<Text style={...}>` with `<Text variant="..." color="...">`
- [ ] Remove typography styles from `StyleSheet.create`
- [ ] Replace hardcoded colors with token references
- [ ] Add Storybook stories for any new components
- [ ] Run ESLint to verify: `npm run lint`

