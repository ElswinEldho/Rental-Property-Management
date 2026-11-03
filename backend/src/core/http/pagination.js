/**
 * Pagination Parameter Parser & Metadata Builder
 */

/**
 * Parses page and limit query parameters safely.
 *
 * @param {object} query - Express req.query
 * @param {object} [defaults]
 * @param {number} [defaults.defaultLimit=20]
 * @param {number} [defaults.maxLimit=100]
 * @returns {{ page: number, limit: number, skip: number }}
 */
export function parsePaginationParams(query, { defaultLimit = 20, maxLimit = 100 } = {}) {
  const page = Math.max(1, parseInt(query?.page, 10) || 1);
  const rawLimit = parseInt(query?.limit, 10) || defaultLimit;
  const limit = Math.min(Math.max(1, rawLimit), maxLimit);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Creates standardized pagination metadata.
 *
 * @param {number} totalItems - Total matching count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {{ page: number, limit: number, totalItems: number, totalPages: number, hasNext: boolean, hasPrev: boolean }}
 */
export function createPaginationMeta(totalItems, page, limit) {
  const totalPages = Math.ceil(totalItems / limit) || 1;

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

