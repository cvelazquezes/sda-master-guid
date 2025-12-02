# SDA Master Guid - Pathfinder Club Management App

A comprehensive mobile application for managing Seventh-day Adventist Pathfinder clubs, facilitating member management, fee tracking, and coffee chat meetings.

## 🚀 Features

### For Regular Users

- **Home Dashboard**: View club information and upcoming activities
- **Members Directory**: Browse and connect with fellow club members
- **Activities**: Track participation in club activities
- **My Account**: Manage personal profile and settings
- **Fee Management**: View and track membership fees

### For Club Administrators

- **Dashboard**: Overview of club operations and statistics
- **Member Management**:
  - Approve/reject new member registrations
  - Manage member status (active/inactive)
  - Assign Pathfinder classes (Friend, Companion, Explorer, Ranger, Voyager, Guide)
  - View member payment history
- **Meeting Planner**: Schedule and organize club meetings
- **Fee Management**:
  - Configure monthly fees
  - Create custom charges
  - Track payments and balances
  - Send WhatsApp payment reminders
- **Activity Management**: Generate and manage member activities
- **Club Settings**: Configure club information and preferences

### For Platform Administrators

- **User Management**: Oversee all users across the platform
- **Club Management**: Manage all clubs and their settings
- **System Configuration**: Platform-wide settings and controls

---

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- iOS Simulator (for iOS) or Android Studio (for Android)
- JDK 17 (for Android builds)

---

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd sda-master-guid

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
```

---

## 📱 Running the App

### Development Mode

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

### Building Production APK

```bash
# Prebuild Android
npx expo prebuild --platform android

# Build release APK
cd android && ./gradlew assembleRelease

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

### Install on Device

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

## 🧪 Test Credentials (Mock Mode)

The app includes persistent mock data for testing:

| Role             | Email             | Features                               |
| ---------------- | ----------------- | -------------------------------------- |
| **Admin**        | admin@sda.com     | Full system access                     |
| **Club Admin**   | clubadmin@sda.com | Club management, member approval, fees |
| **Regular User** | user@sda.com      | Member features                        |
| **Pending User** | pending1@sda.com  | Pending approval screen                |

> **Note**: Any password works in mock mode.

---

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/             # App screens organized by role
│   ├── admin/           # Platform admin screens
│   ├── auth/            # Authentication screens
│   ├── club-admin/      # Club admin screens
│   └── main/            # Regular user screens
├── navigation/          # Navigation configuration
├── context/             # React Context providers
├── services/            # Business logic and API calls
├── shared/
│   ├── api/             # API client configuration
│   ├── components/      # Standard UI components
│   ├── config/          # App configuration
│   ├── constants/       # App constants (messages, validation, timing)
│   ├── hooks/           # Custom React hooks
│   ├── theme/           # Design tokens and theming
│   ├── utils/           # Utility functions
│   └── validation/      # Input validation schemas
├── types/               # TypeScript type definitions
└── utils/               # Helper functions
```

---

## 🎨 Design System

The app uses a comprehensive design system with SDA branding:

### Standard Components

Located in `src/shared/components/`:

- `StandardButton` - Primary button with variants
- `StandardInput` - Text input with validation
- `StandardModal` - Consistent modal dialogs
- `StandardPicker` - Selection dropdowns
- `Badge` - Status and role indicators
- `Card` - Content containers
- `EmptyState` - Empty list states

### Design Tokens

Located in `src/shared/theme/`:

```typescript
import { designTokens } from '@/shared/theme/designTokens';
import { mobileTypography, mobileIconSizes } from '@/shared/theme';

// Colors
designTokens.colors.primary; // SDA Blue
designTokens.colors.secondary; // Master Guide Red
designTokens.colors.accent; // Achievement Gold

// Spacing
designTokens.spacing.sm; // 8px
designTokens.spacing.md; // 12px
designTokens.spacing.lg; // 16px

// Typography
mobileTypography.heading1; // 24px bold
mobileTypography.bodyLarge; // 16px regular

// Icons
mobileIconSizes.medium; // 20px
```

### Best Practices

- ✅ Use `StandardButton` instead of custom TouchableOpacity
- ✅ Use `designTokens` for all colors, spacing, and sizing
- ✅ Use `mobileTypography` for all text styles
- ❌ Never hardcode colors, spacing, or font sizes

---

## 👥 User Roles & Approval

### Role Hierarchy

1. **Platform Admin** - Full system access, approves club admin requests
2. **Club Admin** - Manages their club, approves regular user requests
3. **Regular User** - Member features only

### Registration Flow

- New users register with pending status
- Club admins can approve/reject regular users
- Platform admins can approve/reject club admin requests
- Users see "Pending Approval" screen until approved

---

## 💰 Club Fees Feature

Club administrators can:

- Configure monthly fee amounts and active months
- Generate fees for all approved members
- Create custom charges (events, camps, etc.)
- Track member balances (paid, pending, overdue)
- Send WhatsApp payment reminders

---

## 🔧 API Configuration

```typescript
// In .env file
EXPO_PUBLIC_USE_MOCK_DATA=true    # false for real API
EXPO_PUBLIC_API_URL=https://your-api-url.com
```

### Required Backend Endpoints

- **Authentication**: `/auth/login`, `/auth/register`, `/auth/logout`
- **Users**: `/users`, `/users/:id`
- **Clubs**: `/clubs`, `/clubs/:id`
- **Payments**: `/payments`, `/charges`

See `docs/api/openapi.yaml` for complete API specification.

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests (Detox)
detox test --configuration ios.sim.debug
```

---

## 🛡️ Architecture

The app follows **Clean Architecture** principles:

- **Feature-based organization** - Code grouped by feature
- **Separation of concerns** - UI, business logic, and data layers
- **TypeScript** - Type-safe codebase
- **Design patterns** - Repository, Factory, Observer

### Key Technologies

- **Expo** - React Native framework
- **React Navigation** - Robust navigation
- **Zod** - Runtime validation
- **AsyncStorage** - Local data persistence

### Architecture Decision Records

Located in `docs/adr/`:

- Feature-based architecture
- Expo vs React Native CLI
- Zod for validation
- Circuit breaker pattern

---

## 🐛 Troubleshooting

### Common Issues

**Metro bundler not starting:**

```bash
npm start -- --reset-cache
```

**Android build fails:**

```bash
cd android && ./gradlew clean
cd .. && npm run android
```

**ANDROID_HOME not set:**

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
```

**App crashes on startup:**

```bash
adb logcat | grep ReactNative
```

**Reset mock data:**
Clear app storage in Android settings, or reinstall the app.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes following the design system
4. Run tests: `npm test`
5. Commit with conventional messages: `feat: add new feature`
6. Push and create a pull request

### Code Style

- Functional components with hooks
- TypeScript strict mode
- Use standard components from `src/shared/components/`
- Use design tokens from `src/shared/theme/`

---

## 📄 License

[Your License Here]

---

**Built with ❤️ for the SDA Pathfinder Community**
