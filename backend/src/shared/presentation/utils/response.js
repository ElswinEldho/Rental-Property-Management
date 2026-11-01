/**
 * Formats a standardized JSON success response envelope
 * @param {import('express').Response} res
 * @param {Object} options
 * @param {number} [options.statusCode=200]
 * @param {*} [options.data=null]
 * @param {string} [options.message='Success']
 * @param {Object} [options.meta=null]
 */
export function successResponse(res, { statusCode = 200, data = null, message = 'Success', meta = null } = {}) {
  const payload = {
    success: true,
    message,
    data,
  };

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
}

/**
 * Formats a standardized JSON error response envelope
 * @param {import('express').Response} res
 * @param {Object} options
 * @param {number} [options.statusCode=500]
 * @param {string} [options.code='INTERNAL_SERVER_ERROR']
 * @param {string} [options.message='An unexpected error occurred']
 * @param {*} [options.details=null]
 * @param {string} [options.correlationId=null]
 */
export function errorResponse(res, { statusCode = 500, code = 'INTERNAL_SERVER_ERROR', message = 'An unexpected error occurred', details = null, correlationId = null } = {}) {
  const payload = {
    success: false,
    error: {
      code,
      message,
      details,
    },
    correlationId: correlationId || res.locals?.correlationId || null,
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(payload);
}

