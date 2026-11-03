import { config } from '../config/index.js';

/**
 * Returns standardized options for setting secure HttpOnly cookies.
 *
 * @param {object} [customOptions]
 * @returns {import('express').CookieOptions}
 */
export function getSecureCookieOptions(customOptions = {}) {
  const isProduction = config.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction, // HTTPS required in production
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
    ...customOptions,
  };
}

/**
 * Sets an authenticated session cookie.
 *
 * @param {import('express').Response} res
 * @param {string} name
 * @param {string} value
 * @param {number} [maxAgeMs=604800000] Default 7 days
 */
export function setAuthCookie(res, name, value, maxAgeMs = 7 * 24 * 60 * 60 * 1000) {
  res.cookie(name, value, getSecureCookieOptions({ maxAge: maxAgeMs }));
}

/**
 * Clears an authenticated cookie.
 *
 * @param {import('express').Response} res
 * @param {string} name
 */
export function clearAuthCookie(res, name) {
  res.clearCookie(name, getSecureCookieOptions());
}

