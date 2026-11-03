import { cn } from '@/lib/utils/cn';

/**
 * Standard Form Field wrapper with label and error/helper support.
 * @param {{
 *   label?: string,
 *   required?: boolean,
 *   error?: string,
 *   helperText?: string,
 *   className?: string,
 *   children: React.ReactNode
 * }} props
 */
export function FormField({ label, required, error, helperText, className, children }) {
  return (
    <div className={cn('w-full space-y-1', className)}>
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {helperText && !error && (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      )}
      {error && (
        <p role="alert" className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
}

export default FormField;

