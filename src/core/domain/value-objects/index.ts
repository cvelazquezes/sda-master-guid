/**
 * Value Objects
 *
 * Immutable domain primitives that represent concepts without identity.
 * Value objects are compared by their attributes, not by reference.
 */

/* eslint-disable max-classes-per-file -- Domain value objects are intentionally co-located */

// ============================================================================
// USER VALUE OBJECTS
// ============================================================================

export enum UserRole {
  ADMIN = 'admin',
  CLUB_ADMIN = 'club_admin',
  USER = 'user',
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// ============================================================================
// CLUB VALUE OBJECTS
// ============================================================================

export enum MatchFrequency {
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
}

// ============================================================================
// MATCH VALUE OBJECTS
// ============================================================================

export enum MatchStatus {
  PENDING = 'pending',
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
  CANCELLED = 'cancelled',
}

// ============================================================================
// FEE VALUE OBJECTS
// ============================================================================

export enum PaymentStatus {
  PAID = 'paid',
  PENDING = 'pending',
  OVERDUE = 'overdue',
  EXEMPT = 'exempt',
}

export enum ChargeType {
  MONTHLY_FEE = 'monthly_fee',
  CUSTOM = 'custom',
}

export enum FeeStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CASH = 'cash',
  TRANSFER = 'transfer',
  CARD = 'card',
}

// ============================================================================
// ORGANIZATION VALUE OBJECTS
// ============================================================================

export enum OrganizationType {
  DIVISION = 'division',
  UNION = 'union',
  ASSOCIATION = 'association',
  CHURCH = 'church',
}

// ============================================================================
// PATHFINDER CLASSES
// ============================================================================

export const PATHFINDER_CLASSES = [
  'Friend',
  'Companion',
  'Explorer',
  'Ranger',
  'Voyager',
  'Guide',
] as const;

export type PathfinderClass = (typeof PATHFINDER_CLASSES)[number];

// ============================================================================
// COMMON VALUE OBJECTS
// ============================================================================

export class Email {
  // eslint-disable-next-line no-useless-constructor
  private constructor(private readonly _value: string) {}

  static create(email: string): Email {
    const normalized = email.toLowerCase().trim();
    if (!Email.isValid(normalized)) {
      throw new Error('Invalid email format');
    }
    return new Email(normalized);
  }

  static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getValue(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }
}

export class PhoneNumber {
  // eslint-disable-next-line no-useless-constructor
  private constructor(private readonly _value: string) {}

  static create(phone: string): PhoneNumber {
    const normalized = phone.replace(/[^+\d]/g, '');
    if (!PhoneNumber.isValid(normalized)) {
      throw new Error('Invalid phone number format');
    }
    return new PhoneNumber(normalized);
  }

  static isValid(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{6,14}$/;
    return phoneRegex.test(phone);
  }

  getValue(): string {
    return this._value;
  }

  equals(other: PhoneNumber): boolean {
    return this._value === other._value;
  }
}
