/**
 * API Endpoints Constants
 *
 * Centralized API endpoint paths.
 *
 * ⚠️ COMPLIANCE RULE:
 * ❌ NEVER write: api.post('/auth/login', data)
 * ✅ ALWAYS use: api.post(API_ENDPOINTS.AUTH.LOGIN, data)
 *
 * @version 1.0.0
 */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
    USERS: (userId: string) => `/auth/users/${userId}`,
  },

  USERS: {
    BASE: '/users',
    BY_ID: (userId: string) => `/users/${userId}`,
    PROFILE: '/users/profile',
    PREFERENCES: '/users/preferences',
  },

  CLUBS: {
    BASE: '/clubs',
    BY_ID: (clubId: string) => `/clubs/${clubId}`,
    MEMBERS: (clubId: string) => `/clubs/${clubId}/members`,
    USERS: (clubId: string) => `/clubs/${clubId}/users`,
    JOIN: (clubId: string) => `/clubs/${clubId}/join`,
    LEAVE: (clubId: string) => `/clubs/${clubId}/leave`,
  },

  MATCHES: {
    BASE: '/matches',
    BY_ID: (matchId: string) => `/matches/${matchId}`,
    BY_CLUB: (clubId: string) => `/matches?clubId=${clubId}`,
    BY_CLUB_ALT: (clubId: string) => `/matches/club/${clubId}`,
    ME: '/matches/me',
    STATUS: (matchId: string) => `/matches/${matchId}/status`,
    GENERATE: '/matches/generate',
    ROUNDS: (clubId: string) => `/matches/rounds?clubId=${clubId}`,
    SCHEDULE: '/matches/schedule',
  },

  PAYMENTS: {
    BASE: '/payments',
    BY_ID: (paymentId: string) => `/payments/${paymentId}`,
    BY_USER: (userId: string) => `/payments/user/${userId}`,
    BY_MEMBER: (userId: string, clubId: string) => `/payments/member/${userId}?clubId=${clubId}`,
    BY_CLUB: (clubId: string, year?: number) =>
      year ? `/payments?clubId=${clubId}&year=${year}` : `/payments?clubId=${clubId}`,
    PROCESS: (paymentId: string) => `/payments/${paymentId}/process`,
    REFUND: (paymentId: string) => `/payments/${paymentId}/refund`,
    HISTORY: '/payments/history',
    STATS: (clubId: string) => `/payments/stats/${clubId}`,
    GENERATE: '/payments/generate',
    BALANCE: (userId: string, clubId: string) => `/payments/balance/${userId}?clubId=${clubId}`,
  },

  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (notificationId: string) => `/notifications/${notificationId}`,
    READ: (notificationId: string) => `/notifications/${notificationId}/read`,
    PREFERENCES: '/notifications/preferences',
    SEND: '/notifications/send',
    BULK: '/notifications/bulk',
    SCHEDULE: '/notifications/schedule',
    SCHEDULED: (notificationId: string) => `/notifications/scheduled/${notificationId}`,
  },

  CHARGES: {
    CUSTOM: '/charges/custom',
    BY_CLUB: (clubId: string) => `/charges/custom?clubId=${clubId}`,
    BY_ID: (chargeId: string) => `/charges/custom/${chargeId}`,
  },

  HEALTH: {
    CHECK: '/health',
    READY: '/health/ready',
    LIVE: '/health/live',
  },
} as const;
