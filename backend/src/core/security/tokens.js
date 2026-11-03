import crypto from 'node:crypto';

/**
 * Generates a cryptographically random token (base64url encoded).
 *
 * @param {number} [byteLength=32]
 * @returns {string}
 */
export function generateSecureToken(byteLength = 32) {
  return crypto.randomBytes(byteLength).toString('base64url');
}

/**
 * Computes a SHA-256 hash of a token for secure database storage.
 * (e.g. Refresh token hashes)
 *
 * @param {string} token
 * @returns {string} hex digest
 */
export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generates an RFC4122 v4 UUID.
 *
 * @returns {string}
 */
export function generateUUID() {
  return crypto.randomUUID();
}

