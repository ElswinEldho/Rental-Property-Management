import { ConflictError, NotFoundError, ValidationError, DatabaseError, AppError } from './AppError.js';

/**
 * Maps Prisma Client error codes to standard domain/application errors.
 * Prevents internal SQL / ORM details from leaking to clients while ensuring
 * semantic HTTP response codes (409, 404, 400).
 *
 * @param {Error} error
 * @returns {Error}
 */
export function mapPrismaError(error) {
  // If the error is already an AppError (e.g. AuthenticationError thrown inside transaction), preserve it!
  if (error instanceof AppError) {
    return error;
  }

  // Check for Prisma Known Request Error code
  if (error && typeof error.code === 'string') {
    switch (error.code) {
      // P2002: Unique constraint failed
      case 'P2002': {
        const target = Array.isArray(error.meta?.target)
          ? error.meta.target.join(', ')
          : error.meta?.target || 'field';
        return new ConflictError(`A record with this ${target} already exists.`, {
          field: target,
          prismaCode: error.code,
        });
      }

      // P2025: Record to update/delete not found
      case 'P2025': {
        const cause = error.meta?.cause || 'The requested record was not found.';
        return new NotFoundError(cause);
      }

      // P2003: Foreign key constraint failed
      case 'P2003': {
        const fieldName = error.meta?.field_name || 'relation';
        return new ValidationError(`Referenced entity (${fieldName}) does not exist or cannot be modified.`, {
          field: fieldName,
          prismaCode: error.code,
        });
      }

      // P2014: Required relation violation
      case 'P2014': {
        return new ConflictError('Operation violates required relational constraint.', {
          prismaCode: error.code,
        });
      }

      default:
        return new DatabaseError(error.message || 'Database query error', {
          prismaCode: error.code,
        });
    }
  }

  return error;
}
