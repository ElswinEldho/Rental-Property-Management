import { AppError } from '../errors/AppError.js';
import { HttpStatus, ErrorCode } from '../constants/httpStatusCodes.js';

/**
 * Lightweight in-memory sliding window rate limiter.
 * Protects endpoints from abuse/spam without external dependencies.
 *
 * @param {object} options
 * @param {number} [options.windowMs=60000] - Window duration in milliseconds (1 min)
 * @param {number} [options.max=100] - Max requests allowed per IP within window
 * @param {string} [options.message='Too many requests, please try again later.']
 * @returns {import('express').RequestHandler}
 */
export function rateLimiter({
  windowMs = 60 * 1000,
  max = 100,
  message = 'Too many requests from this IP, please try again later.',
} = {}) {
  const ipHits = new Map();

  // Periodic cleanup of expired windows
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipHits.entries()) {
      if (now - record.startTime > windowMs) {
        ipHits.delete(ip);
      }
    }
  }, windowMs).unref();

  return (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();

    const record = ipHits.get(ip);

    if (!record) {
      ipHits.set(ip, { count: 1, startTime: now });
      return next();
    }

    if (now - record.startTime < windowMs) {
      record.count += 1;
      if (record.count > max) {
        return next(
          new AppError(
            message,
            HttpStatus.TOO_MANY_REQUESTS,
            ErrorCode.RATE_LIMIT_EXCEEDED,
            { retryAfterSeconds: Math.ceil((windowMs - (now - record.startTime)) / 1000) }
          )
        );
      }
    } else {
      record.count = 1;
      record.startTime = now;
    }

    next();
  };
}

