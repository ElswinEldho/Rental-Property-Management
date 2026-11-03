/**
 * Data Sanitization & Masking Utilities
 */

/**
 * Strips script tags with content, general HTML tags, and trims whitespace.
 *
 * @param {string} input
 * @returns {string}
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * Masks a sensitive string like an email or phone number for display.
 *
 * @param {string} value
 * @returns {string}
 */
export function maskSensitive(value) {
  if (!value || typeof value !== 'string') return '';
  if (value.includes('@')) {
    const [name, domain] = value.split('@');
    const maskedName = name.length > 2 ? `${name[0]}***${name[name.length - 1]}` : '***';
    return `${maskedName}@${domain}`;
  }
  if (value.length >= 10) {
    return `${value.slice(0, 2)}******${value.slice(-2)}`;
  }
  return '******';
}
