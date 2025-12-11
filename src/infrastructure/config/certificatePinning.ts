/**
 * Certificate Pinning Configuration
 * Prevents man-in-the-middle attacks by pinning SSL certificates
 *
 * Based on OWASP Mobile Security guidelines
 */

export type CertificatePinConfig = {
  hostname: string;
  includeSubdomains: boolean;
  pins: string[]; // SHA-256 hashes of certificates
};

/**
 * Certificate pins for production API
 */
export const certificatePins: Record<string, CertificatePinConfig> = {
  production: {
    hostname: 'api.yourdomain.com',
    includeSubdomains: true,
    pins: [
      'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
      'sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=',
    ],
  },
  staging: {
    hostname: 'api.staging.yourdomain.com',
    includeSubdomains: true,
    pins: [
      'sha256/CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC=',
      'sha256/DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD=',
    ],
  },
};

/**
 * Gets certificate pin configuration for current environment
 */
export function getCertificatePinConfig(env: string): CertificatePinConfig | null {
  if (env === 'production' || env === 'staging') {
    return certificatePins[env];
  }
  return null;
}

/**
 * Validates certificate pin
 */
export function validateCertificatePin(
  hostname: string,
  receivedPin: string,
  config: CertificatePinConfig
): boolean {
  if (hostname !== config.hostname && !config.includeSubdomains) {
    return false;
  }
  return config.pins.includes(receivedPin);
}

/**
 * Certificate Pinning Error
 */
export class CertificatePinningError extends Error {
  constructor(
    message: string,
    public hostname: string
  ) {
    super(message);
    this.name = 'CertificatePinningError';
  }
}
