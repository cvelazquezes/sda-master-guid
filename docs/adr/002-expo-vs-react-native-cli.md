# ADR-002: Use Expo for React Native Development

## Status

**Accepted** - 2024

## Context

We needed to choose between two main approaches for React Native development:

1. **Expo** - Managed React Native with pre-configured tooling
2. **React Native CLI** - Bare React Native requiring manual configuration

Requirements:

- Fast development iteration
- Easy deployment to multiple platforms (iOS, Android, Web)
- Good developer experience
- Support for native modules when needed
- Continuous deployment capabilities

## Decision

We will use **Expo** with the following configuration:

- Expo SDK ~51.0.0
- EAS Build for production builds
- Expo Go for development testing
- Support for custom native modules via development builds

## Rationale

### Expo Advantages

1. **Zero Configuration**: Pre-configured tooling (Metro, Babel, TypeScript)
2. **Multi-Platform**: Build for iOS, Android, and Web from single codebase
3. **OTA Updates**: Over-the-air updates for non-native changes
4. **EAS Build**: Cloud-based builds without Mac/Xcode requirement
5. **Developer Experience**: Hot reloading, debugging, error handling
6. **Community**: Large ecosystem of compatible libraries

### Trade-offs Accepted

1. **Native Modules**: Some native modules require custom dev builds
   - **Mitigation**: Use EAS Build for custom native code
2. **App Size**: Expo apps are slightly larger (~30-40MB)
   - **Acceptable**: Modern devices have sufficient storage
3. **Version Updates**: Must wait for Expo SDK updates
   - **Acceptable**: Expo has regular releases and good support

## Consequences

### Positive

- ✅ Fast development setup (< 5 minutes)
- ✅ Easy testing on physical devices via Expo Go
- ✅ Web support out-of-the-box
- ✅ Simplified CI/CD with EAS
- ✅ Hot reloading and debugging
- ✅ TypeScript configured by default

### Negative

- ⚠️ Some native modules require ejection to development builds
- ⚠️ Slightly larger app size
- ⚠️ Must follow Expo release cycle

### Mitigation Strategies

- Use EAS Build for custom native modules (no ejection needed)
- Optimize bundle size using code splitting and tree shaking
- Monitor Expo release notes for breaking changes

## Implementation

### Development Build

```bash
npx expo start
```

### Production Build

```bash
eas build --platform all --profile production
```

### OTA Updates

```bash
eas update --branch production
```

## Alternatives Considered

### React Native CLI

```
+ Full control over native code
+ Smaller app size
- Complex setup and configuration
- Separate builds for iOS/Android/Web
- No OTA updates built-in
- Requires Mac for iOS development
```

**Rejected because:**

- Higher initial setup cost
- More complex CI/CD pipeline
- No web support
- Steeper learning curve

### Flutter

```
+ Fast development
+ Good performance
- Different language (Dart)
- Smaller ecosystem
- Less web support
```

**Rejected because:**

- Team expertise is in React/TypeScript
- Larger React Native ecosystem

## Success Metrics

- ✅ Development setup time: < 5 minutes
- ✅ Build time: < 15 minutes (EAS)
- ✅ Hot reload time: < 2 seconds
- ✅ Platform support: iOS, Android, Web

## Related Decisions

- ADR-001: Feature-Based Architecture
- ADR-004: Circuit Breaker Implementation

## References

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [React Native CLI vs Expo](https://docs.expo.dev/faq/)
