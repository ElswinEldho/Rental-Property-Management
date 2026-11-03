'use client';

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
 *   error?: string,
 *   placeholder?: string,
 *   disabled?: boolean,
 *   required?: boolean,
 *   helperText?: string,
 *   leftIcon?: React.ReactNode,
 *   rightIcon?: React.ReactNode,
 *   type?: string,
 *   className?: string
 * }} props
 */
export function TextInput({
  label,
  name,
  id,
  value,
  onChange,
  error,
  placeholder,
  disabled = false,
  required = false,
  helperText,
  leftIcon,
  rightIcon,
  type = 'text',
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
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-describedby={[helperId, errorId].filter(Boolean).join(' ') || undefined}
          aria-invalid={!!error}
          className={cn(
            'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900',
            'placeholder:text-slate-400',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
            'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
            error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : 'border-slate-300',
            leftIcon ? 'pl-10' : '',
            rightIcon ? 'pr-10' : ''
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
      {helperText && !error && <HelperText id={helperId}>{helperText}</HelperText>}
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </div>
  );
}

export default TextInput;

