# Internationalization (i18n) Usage Guide

This guide explains how to correctly use translations in this React Native application.

## Quick Start

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <View>
      <Text>{t('common.save')}</Text>
      <Text>{t('errors.failedToLoadData')}</Text>
    </View>
  );
}
```

## Architecture Overview

### Central Configuration

The i18n system is configured in `src/i18n/config.ts`:

- **Library**: i18next with react-i18next
- **Languages**: English (en), Spanish (es)
- **Default**: English
- **Storage**: AsyncStorage for language persistence
- **Detection**: Automatic device locale detection

### Translation Files

Located in `src/i18n/locales/`:

```
src/i18n/
├── config.ts         # i18n initialization
├── index.ts          # Public exports
└── locales/
    ├── en.ts         # English translations
    ├── es.ts         # Spanish translations
    └── index.ts      # Language exports
```

## Rules

### ✅ DO: Use `t()` for All User-Facing Text

```typescript
// ✅ CORRECT
const { t } = useTranslation();

<Text>{t('common.save')}</Text>
<Text>{t('screens.home.welcomeBack', { name: user.name })}</Text>
```

### ❌ DON'T: Use `MESSAGES` Constants for Text

```typescript
// ❌ DEPRECATED - Don't use MESSAGES for new code
import { MESSAGES } from '../../shared/constants';
Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD);

// ✅ CORRECT
const { t } = useTranslation();
Alert.alert(t('common.error'), t('errors.failedToLoadData'));
```

### ❌ DON'T: Use i18n in UI Primitives

```typescript
// ❌ FORBIDDEN in src/shared/components/ or src/ui/
import { useTranslation } from 'react-i18next';

function Button({ label }) {
  const { t } = useTranslation(); // ❌ NO!
  return <Text>{t(label)}</Text>;
}

// ✅ CORRECT - Primitives receive already-translated strings
function Button({ label }) {
  return <Text>{label}</Text>;
}

// In feature code:
<Button label={t('common.save')} />
```

### ❌ DON'T: Hardcode User-Facing Text

```typescript
// ❌ FORBIDDEN
<Text>Loading...</Text>
<Button title="Save" />
Alert.alert('Error', 'Something went wrong');

// ✅ CORRECT
<Text>{t('common.loading')}</Text>
<Button title={t('common.save')} />
Alert.alert(t('common.error'), t('errors.somethingWentWrong'));
```

### ❌ DON'T: Concatenate Translated Strings

```typescript
// ❌ FORBIDDEN - Word order varies by language
t('cart.items') + ' ' + count;

// ✅ CORRECT - Use interpolation
t('cart.items', { count });
```

## Translation Key Structure

Keys are namespaced and hierarchical:

```typescript
// Translation structure in en.ts
{
  common: {
    save: 'Save',
    cancel: 'Cancel',
    error: 'Error',
    loading: 'Loading...',
  },
  auth: {
    login: 'Login',
    logout: 'Logout',
    loginFailed: 'Login Failed',
  },
  errors: {
    failedToLoadData: 'Failed to load data',
    networkError: 'Network error. Please check your connection.',
  },
  screens: {
    home: {
      welcomeBack: 'Welcome back, {{name}}!',
      clubHappenings: "Here's what's happening in your club",
    },
    profile: {
      title: 'My Profile',
      // ...
    },
  },
}
```

## Common Namespaces

| Namespace           | Purpose                       |
| ------------------- | ----------------------------- |
| `common`            | Shared text (buttons, labels) |
| `auth`              | Authentication-related        |
| `errors`            | Error messages                |
| `success`           | Success messages              |
| `warnings`          | Warning messages              |
| `screens.{name}`    | Screen-specific text          |
| `components.{name}` | Component-specific text       |
| `accessibility`     | Accessibility labels          |

## Interpolation

For dynamic values, use interpolation:

```typescript
// In en.ts
{
  screens: {
    members: {
      subtitle: '{{count}} members',
      welcomeBack: 'Welcome back, {{name}}!',
    },
  },
}

// In component
t('screens.members.subtitle', { count: members.length })
t('screens.home.welcomeBack', { name: user.name })
```

## Pluralization

Use built-in pluralization (not manual if/else):

```typescript
// In en.ts - note the _plural suffix
{
  screens: {
    members: {
      subtitle: '{{count}} member',
      subtitle_plural: '{{count}} members',
    },
  },
}

// In component - i18next handles selection automatically
t('screens.members.subtitle', { count: memberCount })
// Returns "1 member" or "5 members" based on count
```

## Using in Hooks and Services

For code outside React components, use `i18next` directly:

```typescript
import i18next from 'i18next';

// In a custom hook
function useMyData() {
  const loadData = async () => {
    try {
      // ...
    } catch {
      // Use i18next.t() outside React component context
      Alert.alert(i18next.t('common.error'), i18next.t('errors.failedToLoadData'));
    }
  };
}
```

## Adding New Translations

### Step 1: Add to English (Required)

```typescript
// src/i18n/locales/en.ts
export const en = {
  // ... existing keys
  myFeature: {
    title: 'My Feature Title',
    description: 'This is my feature description',
    button: 'Click Me',
    greeting: 'Hello, {{name}}!',
  },
};
```

### Step 2: Add to Spanish (Optional but Recommended)

```typescript
// src/i18n/locales/es.ts
export const es = {
  // ... existing keys
  myFeature: {
    title: 'Título de Mi Función',
    description: 'Esta es la descripción de mi función',
    button: 'Haz Clic',
    greeting: '¡Hola, {{name}}!',
  },
};
```

### Step 3: Use in Component

```typescript
function MyFeature({ name }) {
  const { t } = useTranslation();

  return (
    <View>
      <Text variant="h1">{t('myFeature.title')}</Text>
      <Text>{t('myFeature.description')}</Text>
      <Text>{t('myFeature.greeting', { name })}</Text>
      <Button title={t('myFeature.button')} />
    </View>
  );
}
```

## Complete Example

```typescript
import React from 'react';
import { View, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { Text, Button, Card } from '@/ui';

// Feature component - uses translations
function MemberList({ members, onLoadError }) {
  const { t } = useTranslation();

  const handleError = () => {
    // Can use i18next directly or pass error message up
    Alert.alert(
      t('common.error'),
      t('errors.failedToLoadMembers')
    );
  };

  if (members.length === 0) {
    return (
      <Card>
        <Text variant="h3">{t('screens.members.noMembersYet')}</Text>
        <Text color="secondary">
          {t('screens.members.noMembersMatchSearch')}
        </Text>
      </Card>
    );
  }

  return (
    <View>
      {/* Subtitle with pluralization */}
      <Text variant="caption">
        {t('screens.members.subtitle', { count: members.length })}
      </Text>

      {members.map(member => (
        <Card key={member.id}>
          {/* Welcome message with interpolation */}
          <Text>{t('screens.home.welcomeBack', { name: member.name })}</Text>
        </Card>
      ))}
    </View>
  );
}
```

## Migration: MESSAGES to t()

### Before (Deprecated)

```typescript
import { MESSAGES } from '../../shared/constants';

Alert.alert(MESSAGES.TITLES.ERROR, MESSAGES.ERRORS.FAILED_TO_LOAD_DATA);
```

### After (Correct)

```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
Alert.alert(t('common.error'), t('errors.failedToLoadData'));
```

## Where i18n Usage IS Allowed

| Location                    | Can Use useTranslation/t()?                  |
| --------------------------- | -------------------------------------------- |
| `src/screens/`              | ✅ Yes                                       |
| `src/features/`             | ✅ Yes                                       |
| `src/components/` (feature) | ✅ Yes                                       |
| `src/shared/components/`    | ❌ No - receive translated strings via props |
| `src/ui/`                   | ❌ No - receive translated strings via props |

## Language Switching

```typescript
import { changeLanguage, getCurrentLanguage, LANGUAGES } from '@/i18n';

// Get current language
const currentLang = getCurrentLanguage(); // 'en' or 'es'

// Change language
await changeLanguage(LANGUAGES.SPANISH); // Switch to Spanish
await changeLanguage(LANGUAGES.ENGLISH); // Switch to English
```

## PR Checklist

When reviewing PRs, check:

- [ ] No `useTranslation()` in UI primitives (`src/shared/components/`, `src/ui/`)
- [ ] No new usages of `MESSAGES` constants for user-facing text
- [ ] No hardcoded user-facing strings in feature code
- [ ] No string concatenation for translations
- [ ] Interpolation used for dynamic values: `t('key', { value })`
- [ ] Pluralization uses `_plural` suffix pattern
- [ ] New translation keys added to both `en.ts` and `es.ts`
- [ ] Translation keys are namespaced properly
