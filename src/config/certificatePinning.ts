/**
 * Certificate Pinning Configuration
 * Prevents man-in-the-middle attacks by pinning SSL certificates
 *
 * Based on OWASP Mobile Security guidelines
 */

export interface CertificatePinConfig {
  hostname: string;
  includeSubdomains: boolean;
  pins: string[]; // SHA-256 hashes of certificates
}

/**
 * Certificate pins for production API
 *
 * To generate certificate pins:
 * 1. Run the following command to generate a pin:
 *    openssl s_client -servername api.yourdomain.com -connect api.yourdomain.com:443 \
 *    | openssl x509 -pubkey -noout | openssl pkey -pubin -outform der \
 *    | openssl dgst -sha256 -binary | openssl enc -base64
 * 2. Add backup pins (at least 2) for rotation
 */
export const certificatePins: Record<string, CertificatePinConfig> = {
  production: {
    hostname: 'api.yourdomain.com',
    includeSubdomains: true,
    pins: [
      // Primary certificate pin (update with real pin before production)
      'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
      // Backup certificate pin (for rotation)
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
export function getCertificatePinConfig(environment: string): CertificatePinConfig | null {
  if (environment === 'production' || environment === 'staging') {
    return certificatePins[environment];
  }
  // No pinning for development
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

/**
 * Instructions for implementing certificate pinning:
 *
 * For React Native (iOS/Android):
 * 1. Install: npm install react-native-ssl-pinning
 * 2. Configure pins in native code (iOS: Info.plist, Android: network_security_config.xml)
 * 3. Use fetch with pinning:
 *
 * import { fetch as sslFetch } from 'react-native-ssl-pinning';
 *
 * sslFetch('https://api.yourdomain.com', {
 *   method: 'GET',
 *   timeoutInterval: 10000,
 *   sslPinning: {
 *     certs: ['cert1', 'cert2']
 *   }
 * });
 *
 * For Web:
 * Certificate pinning is handled by the browser and HSTS headers
 */
