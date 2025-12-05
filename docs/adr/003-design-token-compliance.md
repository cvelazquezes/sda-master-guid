# ADR-003: Design Token Compliance Guide

## Status

**Accepted** - Required for all new code, gradual migration for existing code

## Context

World-class applications require a single source of truth for all visual and business constants. This eliminates:

- Inconsistent styling across the app
- Difficulty maintaining a cohesive design system
- Bugs from typos in hardcoded values
- Theme switching issues
- Accessibility problems from inconsistent sizing

## Decision

### Rule 1: Visual Values → Design Tokens

**ALL visual values MUST come from design tokens.** No exceptions.

### Rule 2: Business/Technical Constants → Domain Config

**ALL business logic values MUST come from shared config.**

### Rule 3: Zero Magic Numbers/Strings

**No new magic numbers or strings anywhere except in central token/config files.**

---

## Implementation Guide

### Imports Required

```typescript
// For static styles (StyleSheet.create)
import { DesignConstants } from '@/shared/theme';

// For theme-aware dynamic styles (recommended)
import { useDesignTokens } from '@/shared/hooks/useDesignTokens';

// For business constants
import { domainConfig } from '@/shared/config';
import { TIMING, VALIDATION, MESSAGES } from '@/shared/constants';
```

---

## Migration Patterns

### ❌ BAD → ✅ GOOD: Spacing

```typescript
// ❌ BAD - Magic numbers
const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 8,
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
});

// ✅ GOOD - Token-based
import { DesignConstants } from '@/shared/theme';

const styles = StyleSheet.create({
  container: {
    padding: DesignConstants.spacing.lg, // 16
    marginTop: DesignConstants.spacing.sm, // 8
    gap: DesignConstants.spacing.md, // 12
    paddingHorizontal: DesignConstants.spacing.xl, // 20
    paddingVertical: DesignConstants.spacing['2xl'], // 24
  },
});
```

### ❌ BAD → ✅ GOOD: Border Radius

```typescript
// ❌ BAD
borderRadius: 10,
borderRadius: 50,
borderRadius: 9999,

// ✅ GOOD
borderRadius: DesignConstants.radius.lg,      // 8 (use closest token)
borderRadius: DesignConstants.radius['5xl'],  // 32
borderRadius: DesignConstants.radius.full,    // 9999 (circular)

// ✅ EVEN BETTER - Semantic
borderRadius: DesignConstants.radius.card,    // card-specific radius
borderRadius: DesignConstants.radius.button,  // button-specific radius
borderRadius: DesignConstants.radius.avatar,  // avatar-specific radius
```

### ❌ BAD → ✅ GOOD: Font Sizes

```typescript
// ❌ BAD
fontSize: 12,
fontSize: 16,
fontSize: 24,
fontSize: 36,

// ✅ GOOD
fontSize: DesignConstants.fontSize.xs,   // 13 (min accessible size)
fontSize: DesignConstants.fontSize.lg,   // 16
fontSize: DesignConstants.fontSize['3xl'], // 24
fontSize: DesignConstants.fontSize['6xl'], // 36
```

### ❌ BAD → ✅ GOOD: Icon Sizes

```typescript
// ❌ BAD - Hardcoded in JSX
<MaterialCommunityIcons name="check" size={20} />
<MaterialCommunityIcons name="close" size={24} />
<MaterialCommunityIcons name="account" size={48} />

// ✅ GOOD - Token-based
import { DesignConstants } from '@/shared/theme';

<MaterialCommunityIcons name="check" size={DesignConstants.iconSize.md} />   // 20
<MaterialCommunityIcons name="close" size={DesignConstants.iconSize.lg} />   // 24
<MaterialCommunityIcons name="account" size={DesignConstants.iconSize['4xl']} /> // 48
```

### ❌ BAD → ✅ GOOD: Width/Height for Avatars

```typescript
// ❌ BAD
width: 48,
height: 48,
borderRadius: 24,

// ✅ GOOD
width: DesignConstants.avatarSize.lg,                    // 48
height: DesignConstants.avatarSize.lg,                   // 48
borderRadius: DesignConstants.avatarSize.lg / 2,         // 24

// ✅ EVEN BETTER - Use avatar tokens directly
const { components } = useDesignTokens();
width: components.avatar.sizes.lg,
height: components.avatar.sizes.lg,
borderRadius: components.avatar.borderRadius,
```

### ❌ BAD → ✅ GOOD: Colors (Hardcoded)

```typescript
// ❌ BAD - Hardcoded hex/rgba
shadowColor: '#000',
color: '#fff',
backgroundColor: 'rgba(0, 0, 0, 0.5)',
color: '#25D366', // WhatsApp green

// ✅ GOOD - Static colors
shadowColor: DesignConstants.colors.black,
color: DesignConstants.colors.white,
backgroundColor: DesignConstants.overlay.darkMedium,
color: DesignConstants.colors.social.whatsapp,

// ✅ EVEN BETTER - Theme-aware (in component)
const { colors } = useDesignTokens();
<View style={{ backgroundColor: colors.background.surface }}>
  <Text style={{ color: colors.text.primary }}>Hello</Text>
</View>
```

### ❌ BAD → ✅ GOOD: Overlay/Transparency

```typescript
// ❌ BAD
backgroundColor: 'rgba(0, 0, 0, 0.5)',
backgroundColor: 'rgba(255, 255, 255, 0.2)',
backgroundColor: 'rgba(255, 255, 255, 0.9)',

// ✅ GOOD
backgroundColor: DesignConstants.overlay.darkMedium,    // Modal backdrop
backgroundColor: DesignConstants.overlay.light,         // Light overlay
backgroundColor: DesignConstants.overlay.lightOpaque,   // Near-opaque white
```

### ❌ BAD → ✅ GOOD: Shadows

```typescript
// ❌ BAD - Manual shadow props
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
elevation: 3,

// ✅ GOOD - Shadow tokens
...DesignConstants.shadow.md,

// Or for specific shadow levels:
...DesignConstants.shadow.xs,   // Subtle
...DesignConstants.shadow.sm,   // Light
...DesignConstants.shadow.md,   // Medium (default cards)
...DesignConstants.shadow.lg,   // Elevated
...DesignConstants.shadow.xl,   // Floating
...DesignConstants.shadow['2xl'], // Modal/Dialog
...DesignConstants.shadow['3xl'], // Max elevation
```

### ❌ BAD → ✅ GOOD: Touch Targets

```typescript
// ❌ BAD - Non-accessible sizes
width: 36,
height: 36,

// ✅ GOOD - Accessible touch targets
width: DesignConstants.touchTarget.minimum,     // 44px (iOS min)
height: DesignConstants.touchTarget.comfortable, // 48px (Material min)
```

---

## Theme-Aware Styles (Dynamic)

For colors that need to change with theme:

```typescript
import { useDesignTokens } from '@/shared/hooks/useDesignTokens';
import { DesignConstants } from '@/shared/theme';

const MyComponent = () => {
  // Theme-aware tokens
  const { colors, components, semantic } = useDesignTokens();

  return (
    <View style={[
      styles.container, // Static styles
      { backgroundColor: colors.background.surface } // Dynamic theme color
    ]}>
      <Text style={[
        styles.title, // Static styles
        { color: colors.text.primary } // Dynamic theme color
      ]}>
        Hello World
      </Text>
    </View>
  );
};

// Static styles using DesignConstants
const styles = StyleSheet.create({
  container: {
    padding: DesignConstants.spacing.lg,
    borderRadius: DesignConstants.radius.card,
    ...DesignConstants.shadow.md,
  },
  title: {
    fontSize: DesignConstants.fontSize['2xl'],
    fontWeight: DesignConstants.fontWeight.bold,
  },
});
```

---

## Business Logic Constants

```typescript
// ❌ BAD
if (members.length > 100) { ... }
if (password.length < 6) { ... }
setTimeout(() => {}, 3000);

// ✅ GOOD
import { domainConfig } from '@/shared/config';
import { TIMING, VALIDATION } from '@/shared/constants';

if (members.length > domainConfig.club.members.max) { ... }
if (password.length < VALIDATION.PASSWORD.MIN_LENGTH) { ... }
setTimeout(() => {}, TIMING.TIMEOUT.SHORT);
```

---

## File-by-File Priority

### High Priority (Fix First)

1. `ProfileScreen.tsx` - 20+ violations
2. `SettingsScreen.tsx` - 15+ violations
3. `MyFeesScreen.tsx` - 15+ violations
4. `ClubFeesScreen.tsx` - 30+ violations
5. `UserCard.tsx`, `ClubCard.tsx` - Shadow violations

### Medium Priority

6. All screens in `screens/admin/`
7. All screens in `screens/club-admin/`
8. Modal components

### Lower Priority

9. Shared components (already better)
10. Navigation config

---

## ESLint Rule (Future)

Consider adding a custom ESLint rule to catch violations:

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/^#[0-9a-fA-F]{3,8}$/]',
        message: 'Use DesignConstants.colors or useDesignTokens() for colors',
      },
      {
        selector:
          'Property[key.name=/^(padding|margin|gap|borderRadius|fontSize|width|height)$/][value.type="Literal"][value.value>0]',
        message: 'Use DesignConstants for spacing, sizing, and layout values',
      },
    ],
  },
};
```

---

## Consequences

### Positive

- Consistent visual language across the app
- Easy to maintain and update design system
- Theme switching works automatically
- Better accessibility through standardized sizing
- Faster development with predictable tokens
- Easier design-dev handoff

### Negative

- Initial migration effort required
- Slightly more verbose code
- Team needs to learn token system

---

## References

- Design Tokens: `src/shared/theme/tokens/`
- Static Constants: `src/shared/theme/designConstants.ts`
- System Config: `src/shared/config/`
- Constants: `src/shared/constants/`
- useDesignTokens Hook: `src/shared/hooks/useDesignTokens.ts`
