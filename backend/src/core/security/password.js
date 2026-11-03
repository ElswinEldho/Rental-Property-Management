import bcrypt from 'bcryptjs';

const BCRYPT_SALT_ROUNDS = 12;

/**
 * Hashes a plaintext password using bcrypt with 12 salt rounds.
 *
 * @param {string} plaintextPassword
 * @returns {Promise<string>}
 */
export async function hashPassword(plaintextPassword) {
  if (!plaintextPassword || typeof plaintextPassword !== 'string') {
    throw new Error('Password must be a non-empty string.');
  }
  return await bcrypt.hash(plaintextPassword, BCRYPT_SALT_ROUNDS);
}

/**
 * Verifies a plaintext password against a bcrypt hash.
 *
 * @param {string} plaintextPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(plaintextPassword, hashedPassword) {
  if (!plaintextPassword || !hashedPassword) {
    return false;
  }
  return await bcrypt.compare(plaintextPassword, hashedPassword);
}

