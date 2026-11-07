import { TokenService } from '../../application/services/TokenService.js';
import { AuthenticationError } from '../../../../core/errors/AppError.js';

export const ACCESS_COOKIE_NAME = 'rpm_access_token';
export const REFRESH_COOKIE_NAME = 'rpm_refresh_token';

/**
 * Authentication Middleware:
 * Inspects incoming request for the access token (via HttpOnly cookie or Bearer header).
 * Verifies the token signature and expiry, attaching user payload to `req.user`.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function authenticate(req, res, next) {
  let token = null;

  // 1. Check HttpOnly cookie
  if (req.cookies && req.cookies[ACCESS_COOKIE_NAME]) {
    token = req.cookies[ACCESS_COOKIE_NAME];
  }
  // 2. Fallback to Authorization Header (Bearer)
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.slice(7).trim();
  }

  if (!token) {
    return next(new AuthenticationError('Authentication required. Please log in.'));
  }

  try {
    const payload = TokenService.verifyAccessToken(token);

    req.user = {
      id: payload.userId,
      email: payload.email,
      roles: payload.roles || [],
      tenantId: payload.tenantId || null,
    };

    next();
  } catch (error) {
    next(error);
  }
}

