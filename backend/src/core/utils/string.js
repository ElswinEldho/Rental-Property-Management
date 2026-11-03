/**
 * String & Identifier Utilities
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validates whether a string is a valid UUID v4.
 *
 * @param {string} value
 * @returns {boolean}
 */
export function isValidUUID(value) {
  if (typeof value !== 'string') return false;
  return UUID_REGEX.test(value);
}

/**
 * Converts text into a clean URL-friendly slug.
 *
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  if (typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Capitalizes the first letter of each word.
 *
 * @param {string} text
 * @returns {string}
 */
export function capitalize(text) {
  if (typeof text !== 'string') return '';
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

