import { logger } from '../logger/logger.js';

/**
 * Logs HTTP request lifecycle details with timing and correlation ID.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function requestLoggerMiddleware(req, res, next) {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

    logger.info(
      {
        correlationId: req.correlationId,
        method: req.method,
        url: req.originalUrl || req.url,
        statusCode: res.statusCode,
        duration: `${durationMs}ms`,
      },
      'HTTP Request Completed'
    );
  });

  next();
}

