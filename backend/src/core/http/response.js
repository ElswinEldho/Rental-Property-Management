import { HttpStatus } from '../constants/httpStatusCodes.js';

/**
 * Sends a structured standard success JSON response.
 *
 * @param {import('express').Response} res
 * @param {object} params
 * @param {number} [params.statusCode=200]
 * @param {string} [params.message='Operation completed successfully']
 * @param {any} [params.data=null]
 * @param {object} [params.meta=null]
 */
export function successResponse(res, {
  statusCode = HttpStatus.OK,
  message = 'Operation completed successfully',
  data = null,
  meta = null,
} = {}) {
  const correlationId = res.getHeader?.('x-correlation-id') || res.req?.correlationId || null;
  const envelope = {
    success: true,
    message,
    data,
    correlationId,
    timestamp: new Date().toISOString(),
  };

  if (meta) {
    envelope.meta = meta;
  }

  return res.status(statusCode).json(envelope);
}

/**
 * Sends a structured paginated success JSON response.
 *
 * @param {import('express').Response} res
 * @param {object} params
 * @param {string} [params.message='Data retrieved successfully']
 * @param {Array<any>} params.data - List of items
 * @param {object} params.pagination - Pagination metadata
 */
export function paginatedResponse(res, {
  message = 'Data retrieved successfully',
  data = [],
  pagination,
}) {
  const correlationId = res.getHeader?.('x-correlation-id') || res.req?.correlationId || null;
  return res.status(HttpStatus.OK).json({
    success: true,
    message,
    data,
    pagination,
    correlationId,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Sends a structured standard error JSON response.
 *
 * @param {import('express').Response} res
 * @param {object} params
 * @param {number} [params.statusCode=500]
 * @param {string} [params.code='INTERNAL_ERROR']
 * @param {string} [params.message='An unexpected error occurred']
 * @param {any} [params.details=null]
 */
export function errorResponse(res, {
  statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
  code = 'INTERNAL_ERROR',
  message = 'An unexpected error occurred',
  details = null,
} = {}) {
  const correlationId = res.getHeader?.('x-correlation-id') || res.req?.correlationId || null;
  const envelope = {
    success: false,
    error: {
      code,
      message,
    },
    correlationId,
    timestamp: new Date().toISOString(),
  };

  if (details) {
    envelope.error.details = details;
  }

  return res.status(statusCode).json(envelope);
}
