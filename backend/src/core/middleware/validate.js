import { ValidationError } from '../errors/AppError.js';

/**
 * Creates an Express middleware that validates req.body, req.query, or req.params against Zod schemas.
 *
 * @param {object} schemas
 * @param {import('zod').ZodSchema} [schemas.body]
 * @param {import('zod').ZodSchema} [schemas.query]
 * @param {import('zod').ZodSchema} [schemas.params]
 * @returns {import('express').RequestHandler}
 */
export function validateRequest({ body, query, params }) {
  return async (req, res, next) => {
    try {
      if (body) {
        req.body = await body.parseAsync(req.body);
      }
      if (query) {
        req.query = await query.parseAsync(req.query);
      }
      if (params) {
        req.params = await params.parseAsync(req.params);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

