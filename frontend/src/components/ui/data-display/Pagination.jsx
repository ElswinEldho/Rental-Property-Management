'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * Pagination controls.
 * @param {{
 *   page: number,
 *   totalPages: number,
 *   onPageChange: (page: number) => void,
 *   className?: string
 * }} props
 */
export function Pagination({ page, totalPages, onPageChange, className }) {
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const delta = 2;
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      <button
        type="button"
        onClick={() => hasPrev && onPageChange(page - 1)}
        disabled={!hasPrev}
        aria-label="Previous page"
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors',
          hasPrev
            ? 'text-slate-600 hover:bg-slate-100'
            : 'cursor-not-allowed text-slate-300'
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pageNumbers[0] > 1 && (
        <>
          <PageBtn num={1} current={page} onClick={onPageChange} />
          {pageNumbers[0] > 2 && <span className="px-1 text-slate-400">…</span>}
        </>
      )}

      {pageNumbers.map((n) => (
        <PageBtn key={n} num={n} current={page} onClick={onPageChange} />
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="px-1 text-slate-400">…</span>
          )}
          <PageBtn num={totalPages} current={page} onClick={onPageChange} />
        </>
      )}

      <button
        type="button"
        onClick={() => hasNext && onPageChange(page + 1)}
        disabled={!hasNext}
        aria-label="Next page"
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors',
          hasNext
            ? 'text-slate-600 hover:bg-slate-100'
            : 'cursor-not-allowed text-slate-300'
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

function PageBtn({ num, current, onClick }) {
  const isActive = num === current;
  return (
    <button
      type="button"
      onClick={() => onClick(num)}
      aria-label={`Page ${num}`}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
        isActive
          ? 'bg-brand-600 text-white'
          : 'text-slate-600 hover:bg-slate-100'
      )}
    >
      {num}
    </button>
  );
}

export default Pagination;

