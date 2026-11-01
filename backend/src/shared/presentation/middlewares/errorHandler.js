import { logger } from '../../infrastructure/logger/logger.js';
import { errorResponse } from '../utils/response.js';

export function errorHandlerMiddleware(err, req, res, next) {
  const correlationId = req.correlationId || 'unknown';

  logger.error(
    {
      correlationId,
      errorName: err.name,
      errorMessage: err.message,
      stack: err.stack,
    },
    'Unhandled Application Error'
  );

  const statusCode = err.statusCode || 500;
  const code = err.errorCode || 'INTERNAL_SERVER_ERROR';
  const message = statusCode === 500 ? 'An unexpected server error occurred' : err.message;

  return errorResponse(res, {
    statusCode,
    code,
    message,
    details: err.details || null,
    correlationId,
  });
}

