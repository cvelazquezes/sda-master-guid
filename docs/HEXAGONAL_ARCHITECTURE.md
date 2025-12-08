# Hexagonal Architecture Guide

This project follows **Hexagonal Architecture** (also known as Ports and Adapters) for a clean, maintainable, and testable codebase.

## Directory Structure

```
src/
├── core/                      # 🎯 CORE LAYER (innermost, no dependencies)
│   ├── domain/               # Business logic
│   │   ├── entities/         # Domain entities (User, Club)
│   │   └── value-objects/    # Value objects (Email, UserRole, MatchFrequency)
│   └── ports/                # Interfaces (contracts)
│       ├── repositories/     # IUserRepository, IClubRepository
│       ├── services/         # IAuthService
│       └── storage/          # ISecureStorage
│
├── application/              # 📱 APPLICATION LAYER (depends on core)
│   └── use-cases/           # Application use cases
│       ├── auth/            # LoginUseCase, RegisterUseCase
│       └── clubs/           # GetClubsUseCase, CreateClubUseCase
│
├── infrastructure/           # 🔧 INFRASTRUCTURE LAYER (implements ports)
│   ├── adapters/            # Port implementations
│   │   ├── api/             # ApiClubRepository (wraps existing services)
│   │   └── storage/         # SecureStorageAdapter
│   ├── http/                # apiService (HTTP client)
│   ├── logging/             # logger
│   ├── config/              # environment, certificatePinning
│   └── persistence/         # mockData (for development)
│
├── presentation/            # 🎨 PRESENTATION LAYER (UI)
│   ├── state/               # Re-exports: AuthProvider, ThemeProvider
│   └── components/          # Re-exports: UI primitives and feature components
│
├── ui/                      # 🎨 PUBLIC UI API (design system entry point)
│   └── index.ts             # Public API for all UI primitives & tokens
│
├── screens/                 # 📱 Screen components
├── components/              # 🧩 Feature components
├── shared/                  # 🔗 SHARED (constants, utils, theme, components)
├── services/                # 📡 Legacy services (being migrated to infrastructure)
├── contexts/                # 🔄 React contexts (AuthContext, ThemeContext)
├── navigation/              # 🧭 React Navigation setup
├── i18n/                    # 🌐 Internationalization
└── types/                   # 📝 TypeScript type definitions
```

## Layer Responsibilities

### 1. Core Layer (`src/core/`)

The **innermost layer** containing pure business logic with **zero external dependencies**.

#### Domain (`core/domain/`)
- **Entities**: Objects with identity (User, Club, Match)
- **Value Objects**: Immutable objects without identity (Email, UserRole, MatchFrequency)

#### Ports (`core/ports/`)
- **Repository Interfaces**: Define data persistence contracts
- **Service Interfaces**: Define external service contracts
- **Storage Interfaces**: Define storage contracts

```typescript
// Example: Repository Port
export interface IClubRepository {
  findAll(filters?: ClubFilters): Promise<Club[]>;
  findById(id: string): Promise<Club | null>;
  create(data: CreateClubData): Promise<Club>;
  update(id: string, data: UpdateClubData): Promise<Club>;
  delete(id: string): Promise<void>;
}
```

### 2. Application Layer (`src/application/`)

Contains **use cases** that orchestrate domain logic.

```typescript
// Example: Use Case
export class CreateClubUseCase {
  constructor(private readonly clubRepository: IClubRepository) {}

  async execute(data: CreateClubData): Promise<CreateClubResult> {
    // Validation and business logic
    const club = await this.clubRepository.create(data);
    return { success: true, club };
  }
}
```

### 3. Infrastructure Layer (`src/infrastructure/`)

The **outermost layer** containing implementations of ports.

#### Adapters
- Implement core port interfaces
- Connect to external systems (APIs, databases, storage)

```typescript
// Example: API Adapter implementing IClubRepository
export class ApiClubRepository implements IClubRepository {
  async findAll(filters?: ClubFilters): Promise<Club[]> {
    return apiService.get<Club[]>('/clubs');
  }
  // ... other methods
}
```

### 4. Presentation Layer (`src/presentation/`)

UI components, screens, and navigation.

- **Screens**: Page components
- **Components**: Reusable UI components
- **Navigation**: React Navigation setup
- **Theme**: Theme provider and tokens
- **i18n**: Internationalization

## Dependency Rule

**Dependencies ALWAYS point INWARD**:

```
Presentation → Infrastructure → Application → Core
```

- Core has NO dependencies on other layers
- Application depends ONLY on Core
- Infrastructure depends on Core (implements ports)
- Presentation can use Application and Infrastructure

## Import Guidelines

### ✅ Correct Imports

```typescript
// In Application layer - import from Core
import { User, Club } from '@/core/domain';
import { IClubRepository } from '@/core/ports';

// In Infrastructure layer - import from Core
import { IClubRepository } from '@/core/ports';
import { Club, CreateClubData } from '@/core/domain';

// In Presentation layer - import from Application and Infrastructure
import { GetClubsUseCase } from '@/application';
import { ApiClubRepository } from '@/infrastructure';
```

### ❌ Incorrect Imports

```typescript
// Core should NEVER import from other layers
import { ApiClubRepository } from '@/infrastructure'; // ❌ WRONG!

// Application should NEVER import from Infrastructure
import { apiService } from '@/infrastructure/http'; // ❌ WRONG!
```

## Benefits

1. **Testability**: Core and Application layers can be tested without external dependencies
2. **Flexibility**: Swap adapters without changing business logic
3. **Maintainability**: Clear boundaries prevent spaghetti code
4. **Scalability**: Easy to add new features following the pattern

## Migration Path

When adding new features:

1. Define **entities** in `core/domain/entities/`
2. Define **value objects** in `core/domain/value-objects/`
3. Define **repository interface** in `core/ports/repositories/`
4. Create **use cases** in `application/use-cases/`
5. Implement **adapters** in `infrastructure/adapters/`
6. Build **UI** in `presentation/`

