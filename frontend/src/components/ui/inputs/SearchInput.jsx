'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * Search input with clear button.
 * @param {{
 *   value?: string,
 *   onChange?: Function,
 *   onClear?: Function,
 *   placeholder?: string,
 *   disabled?: boolean,
 *   className?: string
 * }} props
 */
export function SearchInput({ value = '', onChange, onClear, placeholder = 'Search…', disabled = false, className }) {
  const handleClear = () => {
    onChange?.({ target: { value: '' } });
    onClear?.();
  };

  return (
    <div className={cn('relative w-full', className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'block w-full rounded-lg border border-slate-300 bg-white pl-10 pr-10 py-2 text-sm text-slate-900',
          'placeholder:text-slate-400',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
          'disabled:cursor-not-allowed disabled:bg-slate-50',
          '[&::-webkit-search-cancel-button]:hidden'
        )}
      />
      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default SearchInput;

