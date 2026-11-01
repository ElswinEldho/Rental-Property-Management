import { randomUUID } from 'node:crypto';

/**
 * Attaches or propagates x-correlation-id for distributed request tracing
 */
export function correlationIdMiddleware(req, res, next) {
  const correlationId = req.headers['x-correlation-id'] || randomUUID();
  req.correlationId = correlationId;
  res.locals.correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  next();
}

