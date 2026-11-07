import crypto from 'node:crypto';
import { config } from '../../../../core/config/index.js';
import { AuthenticationError } from '../../../../core/errors/AppError.js';

const ISSUER = 'rental-property-management';
const AUDIENCE = 'rental-property-management-api';

/**
 * Service for issuing and verifying cryptographic access tokens.
 * Uses Node.js native crypto HMAC-SHA256 (standard signed compact tokens).
 */
export class TokenService {
  /**
   * Generates a signed compact access token.
   */
  static generateAccessToken(payload, expiresInSeconds = config.ACCESS_TOKEN_EXPIRY_SECONDS) {
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);
    const fullPayload = {
      ...payload,
      iss: ISSUER,
      aud: AUDIENCE,
      iat: now,
      exp: now + expiresInSeconds,
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    const signature = crypto
      .createHmac('sha256', config.JWT_ACCESS_SECRET)
      .update(signatureInput)
      .digest('base64url');

    return `${signatureInput}.${signature}`;
  }

  /**
   * Verifies and decodes a signed compact access token.
   *
   * @param {string} token
   * @returns {object} Decoded token payload
   * @throws {AuthenticationError}
   */
  static verifyAccessToken(token) {
    if (!token || typeof token !== 'string') {
      throw new AuthenticationError('Authentication token is required.');
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new AuthenticationError('Malformed authentication token structure.');
    }

    const [encodedHeader, encodedPayload, signature] = parts;
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    const expectedSignature = crypto
      .createHmac('sha256', config.JWT_ACCESS_SECRET)
      .update(signatureInput)
      .digest('base64url');

    const signatureValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!signatureValid) {
      throw new AuthenticationError('Invalid token signature.');
    }

    let payload;
    try {
      payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    } catch {
      throw new AuthenticationError('Invalid token payload encoding.');
    }

    // Verify Claims
    if (payload.iss !== ISSUER) {
      throw new AuthenticationError('Invalid token issuer.');
    }

    if (payload.aud !== AUDIENCE) {
      throw new AuthenticationError('Invalid token audience.');
    }

    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      throw new AuthenticationError('Authentication token has expired.');
    }

    return payload;
  }
}
