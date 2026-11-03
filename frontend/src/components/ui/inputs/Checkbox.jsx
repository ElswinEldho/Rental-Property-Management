'use client';

import { cn } from '@/lib/utils/cn';
import { ErrorText } from '@/components/ui/typography/ErrorText';

/**
 * @param {{
 *   label: string,
 *   name: string,
 *   id?: string,
 *   checked?: boolean,
 *   onChange?: Function,
 *   disabled?: boolean,
 *   error?: string,
 *   className?: string
 * }} props
 */
export function Checkbox({ label, name, id, checked, onChange, disabled = false, error, className }) {
  const inputId = id ?? name;

  return (
    <div className={cn('w-full', className)}>
      <label className={cn('flex items-center gap-3 cursor-pointer', disabled && 'cursor-not-allowed opacity-60')}>
        <input
          type="checkbox"
          id={inputId}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={!!error}
          className={cn(
            'h-4 w-4 rounded border-slate-300 text-brand-600',
            'focus:ring-2 focus:ring-brand-500 focus:ring-offset-1',
            'disabled:cursor-not-allowed'
          )}
        />
        <span className="text-sm text-slate-700 select-none">{label}</span>
      </label>
      {error && <ErrorText className="mt-1">{error}</ErrorText>}
    </div>
  );
}

export default Checkbox;

