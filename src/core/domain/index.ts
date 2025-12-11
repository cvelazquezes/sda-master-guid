/**
 * Domain Layer
 *
 * Contains core domain value objects, enums, and types.
 * This layer has NO dependencies on external layers.
 */

// Value Objects (enums and types)
export {
  UserRole,
  ApprovalStatus,
  UserStatus,
  MatchFrequency,
  MatchStatus,
  PaymentStatus,
  ChargeType,
  FeeStatus,
  PaymentMethod,
  OrganizationType,
  PATHFINDER_CLASSES,
  Email,
  PhoneNumber,
} from './value-objects';

export type { PathfinderClass } from './value-objects';
