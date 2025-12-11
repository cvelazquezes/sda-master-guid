/**
 * Shared Layer
 *
 * Cross-cutting concerns used across all layers.
 * Contains constants, utilities, validation, configuration, and testing helpers.
 *
 * NOTE: Due to duplicate type definitions across modules, we use explicit exports
 * to avoid conflicts. Types should be imported from their canonical source:
 * - HTTP types (HttpMethod, ContentType, HttpStatus) → ./constants/http
 * - Theme types (SpacingKey, RadiusKey) → ./types/theme
 * - Component types (ComponentSize, ComponentVariant) → ./constants/components
 */

// Constants - canonical source for most constants (includes HTTP types)
export * from './constants';

// Utilities - canonical source for utility functions (ValidationError comes from here)
export * from './utils';

// Validation schemas (excluding ValidationError and validate which come from utils)
export {
  validateSafe,
  CommonSchemas,
  AuthSchemas,
  UserSchemas,
  ClubSchemas,
  MatchSchemas,
  ApiSchemas,
  type LoginInput,
  type RegisterInput,
  type UpdateProfileInput,
  type ChangePasswordInput,
  type CreateUserInput,
  type UpdateUserInput,
  type UserFilterInput,
  type CreateClubInput,
  type UpdateClubInput,
  type CreateMatchInput,
  type UpdateMatchInput,
  type MatchFilterInput,
  type PaginationInput,
} from './validation';

// Configuration - domain, features, storage, environment
// NOTE: Excludes api.ts types (HttpMethod, ContentType, HttpStatus) which conflict with constants
export * from './config/domain';
export * from './config/features';
export * from './config/storage';
export * from './config/environment';

// Types - exclude duplicates that are already in constants
export type {
  ThemeColors,
  ThemeMode,
  ShadowPreset,
  BackgroundColor,
  BorderColor,
  DividerColor,
  InteractiveBackgroundColor,
  PressableBorderColor,
  BorderWidthKey,
} from './types/theme';

// Internationalization (explicit to avoid LANGUAGES conflict with constants)
export { i18n, changeLanguage, getCurrentLanguage, t, type Language } from './i18n';
