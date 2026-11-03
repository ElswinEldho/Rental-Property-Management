'use client';

import { useState, useMemo, useCallback } from 'react';

/**
 * Hook to manage table/list pagination state.
 *
 * @param {object} options
 * @param {number} [options.totalItems=0]
 * @param {number} [options.initialPage=1]
 * @param {number} [options.initialLimit=10]
 */
export function usePagination({ totalItems = 0, initialPage = 1, initialLimit = 10 } = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalItems / limit)), [totalItems, limit]);

  const goToPage = useCallback(
    (targetPage) => {
      setPage(Math.min(Math.max(1, targetPage), totalPages));
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1));
  }, []);

  return {
    page,
    limit,
    totalPages,
    totalItems,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    goToPage,
    nextPage,
    prevPage,
    setLimit,
  };
}

export default usePagination;

