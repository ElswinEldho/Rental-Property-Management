import { logger } from '../../infrastructure/logger/logger.js';

export function requestLoggerMiddleware(req, res, next) {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(
      {
        correlationId: req.correlationId,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
      },
      'HTTP Request Completed'
    );
  });

  next();
}

