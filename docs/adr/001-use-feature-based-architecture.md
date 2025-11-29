# ADR-001: Use Feature-Based Architecture

## Status

**Accepted** - 2024

## Context

We needed to choose an organizational structure for the React Native codebase that would:

- Support multiple developers working in parallel
- Allow easy feature isolation and testing
- Scale as the application grows
- Maintain clear boundaries between domains

We considered two main approaches:

1. **Layer-based architecture** - organizing by technical layers (components, services, utils)
2. **Feature-based architecture** - organizing by business features (auth, matches, clubs)

## Decision

We will use **feature-based architecture** with the following structure:

```
src/
├── features/          # Feature modules (auth, matches, clubs)
│   └── [feature]/
│       ├── services/  # Business logic
│       ├── types/     # Type definitions
│       └── utils/     # Feature-specific utilities
├── screens/           # UI screens organized by feature
├── shared/            # Shared code across features
│   ├── api/          # API client
│   ├── components/   # Reusable UI components
│   ├── services/     # Shared services
│   └── utils/        # Shared utilities
```

Each feature is self-contained with:

- Domain models and types
- Business logic (services)
- Feature-specific utilities

## Consequences

### Positive

- **Team Autonomy**: Multiple teams can work on different features independently
- **Clear Boundaries**: Each feature has well-defined responsibilities
- **Easy Testing**: Features can be tested in isolation
- **Scalability**: New features can be added without affecting existing code
- **Code Organization**: Related code is co-located

### Negative

- **Some Duplication**: Shared code must be explicitly moved to `shared/`
- **Initial Setup**: Requires more upfront planning
- **Navigation**: Developers need to understand the feature structure

### Mitigation

- Use `shared/` for truly shared functionality
- Create clear guidelines for when to create a new feature
- Document the feature structure in README.md

## Alternatives Considered

### Layer-Based Architecture

```
src/
├── components/
├── services/
├── utils/
├── types/
```

**Rejected because:**

- Poor scalability - all components/services in one folder
- Difficult to find related code
- No clear feature boundaries
- Hard to parallelize development

## Related Decisions

- ADR-002: Expo vs React Native CLI
- ADR-003: Zod for Validation

## References

- [Screaming Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Netflix Engineering Blog](https://netflixtechblog.com/)
