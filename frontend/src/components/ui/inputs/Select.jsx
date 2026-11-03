'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Label } from '@/components/ui/typography/Label';
import { HelperText } from '@/components/ui/typography/HelperText';
import { ErrorText } from '@/components/ui/typography/ErrorText';

/**
 * @param {{
 *   label?: string,
 *   name: string,
 *   id?: string,
 *   value?: string,
 *   onChange?: Function,
 *   options: Array<{value: string, label: string}>,
 *   placeholder?: string,
 *   error?: string,
 *   disabled?: boolean,
 *   required?: boolean,
 *   helperText?: string,
 *   className?: string
 * }} props
 */
export function Select({
  label,
  name,
  id,
  value,
  onChange,
  options = [],
  placeholder,
  error,
  disabled = false,
  required = false,
  helperText,
  className,
  ...props
}) {
  const inputId = id ?? name;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <Label htmlFor={inputId} required={required} className="mb-1.5">
          {label}
        </Label>
      )}
      <div className="relative">
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
          aria-invalid={!!error}
          className={cn(
            'block w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-slate-900',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
            'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
            error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : 'border-slate-300'
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
      {helperText && !error && <HelperText id={helperId}>{helperText}</HelperText>}
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </div>
  );
}

export default Select;

