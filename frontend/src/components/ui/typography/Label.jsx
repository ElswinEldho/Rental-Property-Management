import { cn } from '@/lib/utils/cn';

/**
 * Form field label.
 * @param {{ htmlFor?: string, required?: boolean, className?: string, children: React.ReactNode }} props
 */
export function Label({ htmlFor, required = false, className, children, ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('block text-sm font-medium text-slate-700', className)}
      {...props}
    >
      {children}
      {required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
    </label>
  );
}

export default Label;
