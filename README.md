# SDA Master Guid - Coffee Chat App

A multi-platform hybrid application (Web, Android, iOS) built with React Native and Expo. This app facilitates coffee chat matching within SDA clubs, similar to Slack coffee apps but tailored for the SDA Master Guid context.

## ✨ Features

- **User Registration**: Users must join a registered club to use the app
  - WhatsApp number required for match notifications
  - Club membership required for all users (except platform admins)
- **Admin Module**: Full administration of users and clubs
  - Platform-wide user management
  - Club creation with organizational hierarchy
- **Club Admin**: Club-specific administration and match generation
  - Manage club members
  - Generate match rounds
  - Configure club settings
- **Coffee Chat Matching**: Automatic pairing/grouping of members for coffee chats
- **Match Scheduling**: Schedule and manage coffee chat meetings
- **User Preferences**: Pause matches, set timezone, language, and frequency
- **Organizational Hierarchy**: Clubs organized by Church → Association → Union → Division

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
npm install
```

> **Note:** The project uses `--legacy-peer-deps` configured in `.npmrc` to resolve React version conflicts.

### 2. Start Development Server

```bash
npm start
```

This will open the Expo development server with options to run on:
- **Web**: Press `w` or visit `http://localhost:8081`
- **iOS**: Press `i` (requires Xcode on macOS)
- **Android**: Press `a` (requires Android Studio and emulator)
- **Physical Device**: Install "Expo Go" app and scan the QR code

### 3. Test the App

Use these test credentials in mock mode (any password works):

| Role | Email | Club | Features |
|------|-------|------|----------|
| **Platform Admin** | admin@sda.com | None | Platform administration, user/club management |
| **Club Admin** | clubadmin@sda.com | SDA Master Guid - Main | Club management, match generation |
| **User** | user1@sda.com | SDA Master Guid - Main | View matches, schedule coffee chats |
| **User** | user2@sda.com | SDA Master Guid - Main | View matches, schedule coffee chats |
| **User (Paused)** | user3@sda.com | SDA Master Guid - Main | Matches paused |
| **User** | user4@sda.com | SDA Master Guid - Secondary | Different club |

## 📋 Prerequisites

Before you begin, ensure you have:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- For iOS development: [Xcode](https://developer.apple.com/xcode/) (macOS only)
- For Android development: [Android Studio](https://developer.android.com/studio)

## 🔧 Installation & Setup

### Development Mode

1. **Start the Expo development server**:
   ```bash
   npm start
   ```
   or
   ```bash
   yarn start
   ```

2. **Choose your platform**:
   - Press `w` to open in web browser
   - Press `a` to open in Android emulator/device
   - Press `i` to open in iOS simulator (macOS only)
   - Scan the QR code with Expo Go app on your physical device

### Platform-Specific Commands

- **Web**: `npm run web` or `yarn web`
- **Android**: `npm run android` or `yarn android`
- **iOS**: `npm run ios` or `yarn ios`

## Project Structure

```
sda-master-guid/
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/             # React Context providers (Auth, etc.)
│   ├── navigation/          # Navigation configuration
│   ├── screens/             # Screen components
│   │   ├── auth/            # Authentication screens
│   │   ├── main/            # Main app screens
│   │   ├── admin/           # Admin screens
│   │   └── club-admin/      # Club admin screens
│   ├── services/            # API services
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── assets/                  # Images, fonts, etc.
├── App.tsx                  # Main app entry point
├── app.json                 # Expo configuration
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

## ⚙️ Configuration

### API Configuration

The app expects a backend API. Update the API base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
```

You can also set it via environment variable:
```bash
EXPO_PUBLIC_API_URL=https://your-api-url.com/api
```

### Environment Variables

Create a `.env` file in the root directory (optional):

```bash
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Development Mode (set to false to use real API)
EXPO_PUBLIC_USE_MOCK_DATA=true
```

### Mock Mode vs Production

By default, the app uses mock data. To connect to a real backend:

1. Set `USE_MOCK_DATA = false` in service files:
   - `src/services/authService.ts`
   - `src/services/clubService.ts`
   - `src/services/matchService.ts`
   - `src/services/userService.ts`

2. Update `EXPO_PUBLIC_API_URL` to point to your backend

3. Ensure your backend implements the required API endpoints (see Backend API Requirements below)

## 👥 User Roles & Requirements

The app supports three user roles with different requirements:

### 1. Platform Admin
- **Role**: Full system administration
- **WhatsApp**: Not required
- **Club Membership**: Not required
- **Capabilities**:
  - Manage all users (create, activate/deactivate, delete)
  - Manage all clubs
  - View platform-wide analytics
  - No match participation

### 2. Club Admin
- **Role**: Club-specific administration
- **WhatsApp**: **Required** (for match notifications)
- **Club Membership**: **Required**
- **Capabilities**:
  - Manage club members
  - Generate match rounds
  - Configure club settings (frequency, group size)
  - Participate in matches

### 3. Regular User
- **Role**: Club member
- **WhatsApp**: **Required** (for match coordination)
- **Club Membership**: **Required**
- **Capabilities**:
  - View and manage personal matches
  - Schedule coffee chats
  - Update personal preferences
  - Pause/resume matches

> **Note**: All users except Platform Admins must provide a valid WhatsApp number (with country code) and select a club during registration. This enables direct match notifications and ensures proper organizational structure.

## Features Overview

### Authentication
- User registration with club selection
- Login/logout functionality
- Secure token storage

### Match System
- Automatic match generation based on club settings
- Configurable frequency (weekly, bi-weekly, monthly)
- Group sizes (2 or 3 people)
- Match status tracking (pending, scheduled, completed, skipped)

### User Management
- Pause/resume matches
- Timezone and language preferences
- Profile management

### Admin Features
- User management (create, edit, delete, activate/deactivate)
- Club management (create, edit, delete)
- View all users and clubs

### Club Admin Features
- View club members
- Generate match rounds
- Configure club settings (frequency, group size)

## Backend API Requirements

The app expects a REST API with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/me` - Update current user

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Clubs
- `GET /api/clubs` - Get all clubs
- `GET /api/clubs/:id` - Get club by ID
- `POST /api/clubs` - Create club (admin only)
- `PATCH /api/clubs/:id` - Update club
- `DELETE /api/clubs/:id` - Delete club (admin only)
- `POST /api/clubs/:id/join` - Join club
- `POST /api/clubs/:id/leave` - Leave club
- `GET /api/clubs/:id/members` - Get club members

### Matches
- `GET /api/matches` - Get matches (with clubId query param)
- `GET /api/matches/me` - Get current user's matches
- `GET /api/matches/:id` - Get match by ID
- `PATCH /api/matches/:id` - Update match
- `PATCH /api/matches/:id/status` - Update match status
- `POST /api/matches/generate` - Generate matches (club admin only)
- `GET /api/matches/rounds` - Get match rounds (with clubId query param)

## 🏗️ Architecture

This project follows **Clean Architecture** principles with a hybrid feature-based organization:

### Architecture Layers
- **Domain Layer**: Core business entities and interfaces (`src/types/`, `src/features/*/types/`)
- **Application Layer**: Use cases and business logic (`src/services/`, `src/features/*/services/`)
- **Infrastructure Layer**: External interfaces - API, storage (`src/shared/api/`)
- **Presentation Layer**: UI components and screens (`src/screens/`, `src/components/`)

### Design Patterns
- **Repository Pattern**: Abstracts data access (easy testing, swappable implementations)
- **Dependency Injection**: Services receive dependencies via constructor
- **Factory Pattern**: Creates appropriate implementations based on environment
- **Adapter Pattern**: Wraps external libraries with our interfaces

### SOLID Principles
- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes are substitutable for base types
- **Interface Segregation**: Clients don't depend on unused interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

### Project Structure
```
src/
├── features/          # Feature-based modules (auth, matches, clubs, users)
├── shared/            # Shared code (API, components, utils)
├── screens/           # Screen components
├── services/          # Business logic services
├── components/        # Reusable UI components
├── context/           # React Context providers
├── navigation/        # Navigation configuration
├── types/             # TypeScript definitions
└── utils/             # Utility functions
```

## 👨‍💻 Development

### Code Quality Standards
- Test coverage: ≥ 80%
- Function length: < 50 lines
- File length: < 300 lines
- Zero linter warnings
- TypeScript strict mode

### TypeScript
The project uses TypeScript in strict mode. Type definitions are in `src/types/`.

### Code Style
The project uses ESLint and Prettier:
```bash
npm run lint          # Check linting
npm run format        # Format code
```

### Testing
```bash
npm test              # Run tests
npm run test:coverage # Run with coverage report
```

### Git Workflow
Use conventional commits:
```bash
feat: add user authentication
fix: resolve login crash
docs: update API documentation
refactor: simplify auth logic
test: add user service tests
```

### Security Best Practices
- All inputs validated with Zod schemas
- Sensitive data stored in SecureStore
- All API calls use HTTPS
- Authentication required on protected routes
- No secrets committed to repository

## Building for Production

### Web

```bash
expo build:web
```

### Android

```bash
expo build:android
```

### iOS

```bash
expo build:ios
```

Or use EAS Build:
```bash
eas build --platform android
eas build --platform ios
```

## 🔧 Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| **Metro bundler cache issues** | Run `npm start -- --clear` or `expo start -c` |
| **Module not found errors** | Delete `node_modules` and run `npm install` again |
| **Port already in use** | Kill process: `lsof -ti:8081 \| xargs kill -9` (Unix/Mac) |
| **iOS build fails** | Clean Xcode build folder and rebuild |
| **Android build fails** | Clean gradle cache: `cd android && ./gradlew clean` |
| **Expo Go not connecting** | Ensure phone and computer are on same WiFi, or try tunnel mode: `expo start --tunnel` |
| **API connection errors** | Check that `EXPO_PUBLIC_API_URL` is set correctly or use mock mode |

### Getting Help

- **Expo**: [Documentation](https://docs.expo.dev/)
- **React Native**: [Documentation](https://reactnative.dev/)
- **TypeScript**: [Handbook](https://www.typescriptlang.org/docs/)
- **Clean Architecture**: [Book by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- **SOLID Principles**: [Principles Overview](https://en.wikipedia.org/wiki/SOLID)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Code Quality**: Follow the code quality standards above (80%+ test coverage, < 50 lines per function)
2. **Architecture**: Follow Clean Architecture and SOLID principles
3. **Testing**: Write tests for new features (unit, integration, and E2E where applicable)
4. **Commits**: Use conventional commit messages (feat:, fix:, docs:, refactor:, test:, chore:)
5. **Pull Requests**: Create clear descriptions with context and screenshots where applicable
6. **Security**: Follow security best practices (input validation, secure storage, HTTPS)
7. **Documentation**: Update README.md if adding new features or changing setup

### Pull Request Checklist
- [ ] Tests added/updated and passing
- [ ] Code follows style guide (ESLint passing)
- [ ] TypeScript types are properly defined
- [ ] No new linter warnings
- [ ] Documentation updated if needed
- [ ] Security considerations addressed

## 📄 License

[Add your license here]

## 🙏 Acknowledgments

Built with modern development practices inspired by leading tech companies (Google, Meta, Netflix, Amazon, Microsoft, Airbnb).

