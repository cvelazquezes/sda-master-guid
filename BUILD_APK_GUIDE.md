# Building a Functional APK Without Backend

This guide explains how to build a fully functional APK for the SDA Master Guid app using mock data (no backend required).

## Overview

The app is configured to work with **persistent mock data** that:

- ✅ Survives app restarts
- ✅ Supports all CRUD operations
- ✅ Provides realistic test data
- ✅ Works completely offline

## Prerequisites

### Required Software

1. **Node.js** (v18 or later)

   ```bash
   node --version
   ```

2. **Java Development Kit (JDK 17)**

   ```bash
   java -version
   ```

3. **Android Studio** with:
   - Android SDK Platform 34
   - Android SDK Build-Tools
   - Android Emulator (optional, for testing)

4. **EAS CLI** (for building)
   ```bash
   npm install -g eas-cli
   ```

### Environment Setup

1. Set ANDROID_HOME environment variable:

   ```bash
   # On macOS/Linux (add to ~/.zshrc or ~/.bashrc)
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

   # On Windows (System Environment Variables)
   ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
   ```

2. Verify Android SDK is installed:
   ```bash
   adb version
   ```

## Configuration

### 1. Environment Variables

The app is already configured for mock data mode. Verify in `src/config/environment.ts`:

```typescript
useMockData: getBoolEnvVar('EXPO_PUBLIC_USE_MOCK_DATA', true);
```

### 2. Mock Data Features

The app includes:

**Test Users:**

- `admin@sda.com` - System Administrator
- `clubadmin@sda.com` - Club Administrator
- `user@sda.com` - Regular User
- Plus 3 additional test users

**Test Clubs:**

- 3 pre-configured clubs with different settings
- Organizational hierarchies (Church → Association → Union → Division)

**Mock Features:**

- User authentication (any password works in mock mode)
- User registration
- Club creation and management
- Match generation and scheduling
- User profile management
- All data persists using AsyncStorage

## Building the APK

### Option 1: Local Build (Recommended for Development)

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Build the Android App**

   ```bash
   npx expo prebuild --platform android
   ```

3. **Build APK**

   ```bash
   cd android
   ./gradlew assembleRelease
   ```

4. **Find Your APK**
   The APK will be located at:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

### Option 2: EAS Build (Recommended for Production)

1. **Login to Expo**

   ```bash
   eas login
   ```

2. **Configure EAS**

   ```bash
   eas build:configure
   ```

3. **Build APK**

   ```bash
   # For development build (larger, includes dev tools)
   eas build -p android --profile development

   # For production build (optimized, smaller)
   eas build -p android --profile production
   ```

4. **Download APK**
   After build completes, EAS will provide a download link.

### Option 3: Quick Local Debug Build

For quick testing without signing:

```bash
npm run android
# Then in android/ folder:
./gradlew assembleDebug
```

Debug APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

## Installing the APK

### On Physical Device

1. **Enable Developer Options:**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times

2. **Enable USB Debugging:**
   - Settings → Developer Options → USB Debugging

3. **Install via ADB:**

   ```bash
   adb install android/app/build/outputs/apk/release/app-release.apk
   ```

4. **Or Transfer APK:**
   - Copy APK to phone
   - Open file manager and tap APK
   - Allow "Install from Unknown Sources" if prompted

### On Emulator

1. **Start Emulator:**

   ```bash
   emulator -avd Pixel_4_API_34
   ```

2. **Install APK:**
   ```bash
   adb install android/app/build/outputs/apk/release/app-release.apk
   ```

## Testing the App

### Test Credentials

Login with any of these users (any password works in mock mode):

- **Admin:** `admin@sda.com`
- **Club Admin:** `clubadmin@sda.com`
- **Regular User:** `user@sda.com`

### Features to Test

1. **Authentication**
   - ✅ Login with test credentials
   - ✅ Register new user
   - ✅ Logout

2. **User Management (Admin)**
   - ✅ View all users
   - ✅ Create/Edit/Delete users
   - ✅ Change user roles
   - ✅ Pause/Resume users

3. **Club Management (Admin/Club Admin)**
   - ✅ View all clubs
   - ✅ Create new club
   - ✅ Edit club settings
   - ✅ View club members

4. **Match Management (Club Admin)**
   - ✅ Generate matches
   - ✅ View match rounds
   - ✅ Schedule matches

5. **User Features**
   - ✅ View my matches
   - ✅ Update profile
   - ✅ View settings

### Data Persistence

- All changes persist across app restarts
- Data stored in AsyncStorage
- To reset data: Clear app data in Android settings

## Troubleshooting

### Build Errors

**Problem:** `ANDROID_HOME not set`

```bash
# Solution: Set environment variable
export ANDROID_HOME=$HOME/Library/Android/sdk
```

**Problem:** `SDK location not found`

```bash
# Solution: Create local.properties in android/ folder
echo "sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk" > android/local.properties
```

**Problem:** `Java version mismatch`

```bash
# Solution: Install JDK 17
brew install openjdk@17
```

**Problem:** Gradle build fails

```bash
# Solution: Clean and rebuild
cd android
./gradlew clean
./gradlew assembleRelease
```

### Installation Errors

**Problem:** `INSTALL_FAILED_UPDATE_INCOMPATIBLE`

```bash
# Solution: Uninstall old version first
adb uninstall com.sda.masterguid
adb install app-release.apk
```

**Problem:** App crashes on startup

```bash
# Solution: Check logs
adb logcat | grep "ReactNative"
```

### Mock Data Issues

**Problem:** Data not persisting

- Clear app storage: Settings → Apps → SDA Master Guid → Storage → Clear Data
- Restart app
- Data should initialize with defaults

**Problem:** Want to reset to default data

- Clear app data in Android settings
- Or use Settings → Reset Data (if implemented)

## Signing the APK (Optional)

For production distribution:

1. **Generate Keystore**

   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore \
     -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure Signing** in `android/app/build.gradle`:

   ```gradle
   signingConfigs {
     release {
       storeFile file('my-release-key.keystore')
       storePassword 'your-password'
       keyAlias 'my-key-alias'
       keyPassword 'your-password'
     }
   }
   ```

3. **Build Signed APK**
   ```bash
   ./gradlew assembleRelease
   ```

## Size Optimization

To reduce APK size:

1. **Enable ProGuard** (already configured)
2. **Use APK Split:**
   ```bash
   ./gradlew bundleRelease  # Creates AAB instead of APK
   ```
3. **Remove unused resources** in `build.gradle`:
   ```gradle
   android {
     buildTypes {
       release {
         shrinkResources true
         minifyEnabled true
       }
     }
   }
   ```

## Next Steps

### When Backend is Ready

1. Set environment variable:

   ```
   EXPO_PUBLIC_USE_MOCK_DATA=false
   EXPO_PUBLIC_API_URL=https://your-api.com/api
   ```

2. Rebuild the app

3. All services will automatically switch to real API calls

### Enhancing Mock Data

To add more test data, edit:

- `src/services/mockData.ts` - Add users, clubs, matches
- Data automatically persists via AsyncStorage

## Support

For issues:

1. Check logs: `adb logcat | grep ReactNative`
2. Review environment configuration
3. Verify Android SDK installation
4. Check this guide's troubleshooting section

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Build APK (local)
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease

# Build APK (EAS)
eas build -p android --profile production

# Install on device
adb install android/app/build/outputs/apk/release/app-release.apk

# View logs
adb logcat | grep ReactNative

# Uninstall app
adb uninstall com.sda.masterguid
```
