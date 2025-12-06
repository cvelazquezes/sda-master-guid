/**
 * Auth Feature - Domain Types and Interfaces
 *
 * This file contains the domain models and repository interfaces
 * following Clean Architecture and Repository Pattern principles.
 */

// ============================================================================
// Domain Models
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  clubId: string;
  isActive: boolean;
  isPaused: boolean;
  timezone: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'user' | 'admin' | 'club_admin';

export interface AuthToken {
  token: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  clubId: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ============================================================================
// Repository Interfaces (Ports)
// ============================================================================

/**
 * IAuthRepository - Port for authentication operations
 *
 * This interface defines the contract for authentication data access.
 * Implementations can be API-based, mock-based, or local storage-based.
 */
export interface IAuthRepository {
  /**
   * Authenticate user with credentials
   */
  login(credentials: LoginCredentials): Promise<AuthResponse>;

  /**
   * Register a new user
   */
  register(data: RegisterData): Promise<AuthResponse>;

  /**
   * Sign out current user
   */
  logout(): Promise<void>;

  /**
   * Get currently authenticated user
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Update user profile
   */
  updateUser(userId: string, data: Partial<User>): Promise<User>;

  /**
   * Refresh authentication token
   */
  refreshToken(refreshToken: string): Promise<AuthToken>;
}

/**
 * ITokenStorage - Port for token storage operations
 *
 * This interface defines the contract for secure token storage.
 * Implementations should use platform-specific secure storage.
 */
export interface ITokenStorage {
  /**
   * Store authentication token securely
   */
  setToken(token: string): Promise<void>;

  /**
   * Retrieve authentication token
   */
  getToken(): Promise<string | null>;

  /**
   * Remove authentication token
   */
  removeToken(): Promise<void>;

  /**
   * Store user ID
   */
  setUserId(userId: string): Promise<void>;

  /**
   * Retrieve user ID
   */
  getUserId(): Promise<string | null>;

  /**
   * Remove user ID
   */
  removeUserId(): Promise<void>;

  /**
   * Store refresh token securely
   */
  setRefreshToken(token: string): Promise<void>;

  /**
   * Retrieve refresh token
   */
  getRefreshToken(): Promise<string | null>;

  /**
   * Remove refresh token
   */
  removeRefreshToken(): Promise<void>;

  /**
   * Clear all auth data
   */
  clearAll(): Promise<void>;
}

// ============================================================================
// Use Case Interfaces
// ============================================================================

/**
 * IAuthService - Application use cases for authentication
 *
 * This interface defines the business logic layer for authentication.
 * It orchestrates repository calls and implements business rules.
 */
export interface IAuthService {
  login(email: string, password: string): Promise<AuthResponse>;
  register(email: string, password: string, name: string, clubId: string): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  updateUser(userData: Partial<User>): Promise<User>;
  refreshSession(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
}
