import { HttpStatus, ErrorCode } from '../constants/httpStatusCodes.js';

/**
 * Base Application Error
 * All domain, application, and infrastructure errors inherit from this class.
 */
export class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} [statusCode=500] - HTTP status code
   * @param {string} [code='INTERNAL_ERROR'] - Machine-readable error code
   * @param {any} [details=null] - Additional contextual details
   * @param {boolean} [isOperational=true] - Whether error is trusted/expected
   */
  constructor(
    message,
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    code = ErrorCode.INTERNAL_ERROR,
    details = null,
    isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = null) {
    super(message, HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required or invalid credentials', details = null) {
    super(message, HttpStatus.UNAUTHORIZED, ErrorCode.AUTHENTICATION_ERROR, details);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied: insufficient permissions', details = null) {
    super(message, HttpStatus.FORBIDDEN, ErrorCode.AUTHORIZATION_ERROR, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource', id = null) {
    const message = id ? `${resource} with identifier '${id}' was not found.` : `${resource} was not found.`;
    super(message, HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, { resource, id });
  }
}

export class ConflictError extends AppError {
  constructor(message = 'A resource with these details already exists.', details = null) {
    super(message, HttpStatus.CONFLICT, ErrorCode.CONFLICT, details);
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'A database operation error occurred.', details = null) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.DATABASE_ERROR, details, false);
  }
}

