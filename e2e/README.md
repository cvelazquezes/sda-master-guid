# E2E Testing with Detox

This directory contains end-to-end tests using Detox.

## Setup

### Prerequisites

1. **Install Detox CLI globally:**
   ```bash
   npm install -g detox-cli
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **iOS Setup (macOS only):**
   ```bash
   # Install applesimutils for iOS simulator control
   brew tap wix/brew
   brew install applesimutils
   
   # Build the app for testing
   detox build --configuration ios.sim.debug
   ```

4. **Android Setup:**
   ```bash
   # Create Android emulator (if not exists)
   $ANDROID_HOME/tools/bin/avdmanager create avd \
     --name Pixel_5_API_31 \
     --device "pixel_5" \
     --package "system-images;android-31;google_apis;x86_64"
   
   # Build the app for testing
   detox build --configuration android.emu.debug
   ```

## Running Tests

### iOS

```bash
# Run all E2E tests on iOS simulator (debug)
detox test --configuration ios.sim.debug

# Run specific test file
detox test --configuration ios.sim.debug e2e/auth.test.ts

# Run with video recording
detox test --configuration ios.sim.debug --record-videos all

# Run in release mode
detox test --configuration ios.sim.release
```

### Android

```bash
# Start Android emulator
emulator -avd Pixel_5_API_31

# Run all E2E tests on Android emulator (debug)
detox test --configuration android.emu.debug

# Run specific test file
detox test --configuration android.emu.debug e2e/auth.test.ts

# Run with video recording
detox test --configuration android.emu.debug --record-videos all

# Run in release mode
detox test --configuration android.emu.release
```

## Test Structure

```
e2e/
├── init.ts              # Detox initialization and setup
├── jest.config.js       # Jest configuration for E2E tests
├── auth.test.ts         # Authentication flow tests
├── matches.test.ts      # Match creation and viewing tests
├── admin.test.ts        # Admin functionality tests
└── README.md           # This file
```

## Writing Tests

### Best Practices

1. **Use testID for elements:**
   ```tsx
   <Button testID="login-button" />
   ```

2. **Use waitFor for async operations:**
   ```typescript
   await waitFor(element(by.id('home-screen')))
     .toBeVisible()
     .withTimeout(5000);
   ```

3. **Clean up after each test:**
   ```typescript
   beforeEach(async () => {
     await device.reloadReactNative();
   });
   ```

4. **Use descriptive test names:**
   ```typescript
   it('should show validation error for empty email field', async () => {
     // ...
   });
   ```

### Common Patterns

#### Finding Elements

```typescript
// By testID
element(by.id('button-id'))

// By text
element(by.text('Login'))

// By label
element(by.label('Email Input'))

// By type
element(by.type('RCTTextInput'))
```

#### Interactions

```typescript
// Tap
await element(by.id('button')).tap();

// Type text
await element(by.id('input')).typeText('Hello');

// Replace text
await element(by.id('input')).replaceText('New Text');

// Scroll
await element(by.id('scroll-view')).scroll(200, 'down');

// Swipe
await element(by.id('list')).swipe('up');
```

#### Assertions

```typescript
// Visibility
await expect(element(by.id('button'))).toBeVisible();
await expect(element(by.id('button'))).not.toBeVisible();

// Text
await expect(element(by.id('label'))).toHaveText('Hello');

// Value
await expect(element(by.id('input'))).toHaveValue('text');

// Existence
await expect(element(by.id('element'))).toExist();
```

## CI/CD Integration

The E2E tests are integrated into the CI/CD pipeline:

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Build iOS app
        run: detox build --configuration ios.sim.release
      - name: Run E2E tests
        run: detox test --configuration ios.sim.release --cleanup
      
  e2e-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Build Android app
        run: detox build --configuration android.emu.release
      - name: Run E2E tests
        run: detox test --configuration android.emu.release --headless --cleanup
```

## Debugging

### Enable Synchronization Debugging

```bash
detox test --configuration ios.sim.debug --loglevel trace
```

### Take Screenshots on Failure

```typescript
afterEach(async function() {
  if (this.currentTest.state === 'failed') {
    await device.takeScreenshot(this.currentTest.title);
  }
});
```

### Record Videos

```bash
detox test --configuration ios.sim.debug --record-videos failing
```

## Troubleshooting

### Common Issues

1. **App fails to build:**
   - Clean build: `detox clean-framework-cache && detox build-framework-cache`
   - Rebuild app: `detox build --configuration <config>`

2. **Tests timeout:**
   - Increase timeout in jest.config.js
   - Check if app is responding
   - Disable animations: Settings → Accessibility → Reduce Motion

3. **Element not found:**
   - Verify testID is set correctly
   - Use `waitFor` for async elements
   - Check element hierarchy with Detox Debug View

## Resources

- [Detox Documentation](https://wix.github.io/Detox/)
- [Jest Matchers](https://wix.github.io/Detox/docs/api/matchers)
- [Detox Actions](https://wix.github.io/Detox/docs/api/actions)
- [Best Practices](https://wix.github.io/Detox/docs/guide/testing-best-practices)

