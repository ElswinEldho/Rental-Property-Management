import { AppError } from '../errors/AppError.js';
import { mapPrismaError } from '../errors/prismaErrorMapper.js';
import { errorResponse } from '../http/response.js';
import { logger } from '../logger/logger.js';
import { config } from '../config/index.js';
import { ZodError } from 'zod';

/**
 * Centralized Error Handling Middleware for Express.
 * Catches domain, validation, and unhandled errors, ensuring consistent error responses.
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function errorHandlerMiddleware(err, req, res, next) {
  let error = err;

  // 1. Map Zod validation errors
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return errorResponse(res, {
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Request input validation failed.',
      details: formattedErrors,
    });
  }

  // 2. Map Prisma database errors
  if (error?.code && typeof error.code === 'string' && error.code.startsWith('P')) {
    error = mapPrismaError(error);
  }

  // 3. Operational AppErrors
  if (error instanceof AppError) {
    logger.warn(
      {
        correlationId: req.correlationId,
        code: error.code,
        statusCode: error.statusCode,
        message: error.message,
        details: error.details,
      },
      'Operational Application Error'
    );

    return errorResponse(res, {
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
      details: error.details,
    });
  }

  // 4. Unhandled / Unexpected Errors
  logger.error(
    {
      correlationId: req.correlationId,
      message: error.message,
      stack: error.stack,
    },
    'Unhandled System Error'
  );

  return errorResponse(res, {
    statusCode: 500,
    code: 'INTERNAL_SERVER_ERROR',
    message: config.NODE_ENV === 'production'
      ? 'An unexpected internal server error occurred.'
      : error.message || 'An unexpected internal server error occurred.',
  });
}

