import { AuthenticationError, AuthorizationError } from '../errors/AppError.js';

/**
 * Foundation authentication guard.
 * Verifies authenticated session or identity context attached to req.user.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function requireAuth(req, res, next) {
  if (!req.user || !req.user.id) {
    return next(new AuthenticationError('Authentication required. Please log in.'));
  }
  next();
}

/**
 * Foundation role-based authorization guard.
 * Requires user to have at least one of the specified roles.
 *
 * @param {string[]} allowedRoles
 * @returns {import('express').RequestHandler}
 */
export function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.id) {
      return next(new AuthenticationError('Authentication required.'));
    }

    const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [];
    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return next(
        new AuthorizationError('You do not have permission to access this resource.', {
          required: allowedRoles,
          assigned: userRoles,
        })
      );
    }

    next();
  };
}

