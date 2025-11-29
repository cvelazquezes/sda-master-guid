# ADR-003: Use Zod for Schema Validation

## Status

**Accepted** - 2024

## Context

We needed a robust validation library that:

- Validates API responses and user input
- Provides TypeScript type inference
- Has good error messages
- Supports complex validation rules
- Works on both client and server

Options considered:

1. **Zod** - TypeScript-first schema validation
2. **Yup** - Widely used, JavaScript-first
3. **Joi** - Mature, originally for Node.js
4. **Custom validation** - Build our own

## Decision

We will use **Zod** (v3.22.4+) for all validation needs:

- User input validation (forms, API requests)
- API response validation (runtime type checking)
- Environment variable validation
- Configuration validation

## Rationale

### Zod Advantages

1. **TypeScript-First**

   ```typescript
   const UserSchema = z.object({
     email: z.string().email(),
     age: z.number().min(0),
   });

   type User = z.infer<typeof UserSchema>; // Automatic type inference!
   ```

2. **Strong Type Inference**
   - Types are inferred from schemas
   - No need to define types separately
   - Compile-time and runtime safety

3. **Excellent Error Messages**

   ```typescript
   const result = UserSchema.safeParse(data);
   if (!result.success) {
     console.log(result.error.errors); // Detailed error info
   }
   ```

4. **Composability**

   ```typescript
   const PasswordSchema = z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/);

   const LoginSchema = z.object({
     email: EmailSchema,
     password: PasswordSchema,
   });
   ```

5. **Small Bundle Size**: ~8KB gzipped

### vs. Alternatives

**Yup**

- ❌ No native TypeScript support
- ❌ Types must be defined separately
- ❌ Less intuitive API
- ✅ More mature ecosystem

**Joi**

- ❌ Server-only (large bundle)
- ❌ No TypeScript inference
- ✅ Very mature

**Custom Validation**

- ❌ Maintenance burden
- ❌ Missing edge cases
- ❌ No type inference

## Consequences

### Positive

- ✅ Type-safe validation everywhere
- ✅ Single source of truth (schema = type)
- ✅ Great developer experience
- ✅ Catches errors at compile time AND runtime
- ✅ Clear error messages for users

### Negative

- ⚠️ Learning curve for team
- ⚠️ Schema definitions can be verbose
- ⚠️ Newer library (less Stack Overflow answers)

### Mitigation

- Create reusable schema patterns
- Document common validation patterns
- Build helper functions for complex validations

## Implementation

### Password Validation

```typescript
// src/shared/utils/validation.ts
export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[a-z]/, 'Must contain lowercase letter')
  .regex(/[0-9]/, 'Must contain number')
  .regex(/[^A-Za-z0-9]/, 'Must contain special character');
```

### Email Validation

```typescript
export const EmailSchema = z
  .string()
  .email('Invalid email address')
  .max(255, 'Email too long')
  .toLowerCase();
```

### Form Validation

```typescript
export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type LoginCredentials = z.infer<typeof LoginSchema>;
```

### API Response Validation

```typescript
const UserResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['user', 'admin', 'club_admin']),
});

// Runtime validation
const user = UserResponseSchema.parse(apiResponse);
```

## Validation Strategy

### Input Validation

1. **Client-side** (immediate feedback)
   - Form fields (email, password, etc.)
   - User settings
2. **API requests** (prevent bad data)
   - Validate before sending
   - Clear error messages

### Output Validation

3. **API responses** (runtime type safety)
   - Validate all external data
   - Fail fast on schema mismatch

### Configuration Validation

4. **Environment variables** (startup validation)
   - Validate all config on app start
   - Fail fast if misconfigured

## Success Metrics

- ✅ Zero runtime type errors from validated data
- ✅ 100% of user inputs validated
- ✅ 100% of API responses validated
- ✅ Clear error messages for validation failures

## Related Decisions

- ADR-001: Feature-Based Architecture
- ADR-005: Error Handling Strategy

## References

- [Zod Documentation](https://zod.dev/)
- [Zod GitHub](https://github.com/colinhacks/zod)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
