import { cn } from '@/lib/utils/cn';

/**
 * Muted helper text displayed below form inputs.
 * @param {{ id?: string, className?: string, children: React.ReactNode }} props
 */
export function HelperText({ id, className, children, ...props }) {
  return (
    <p id={id} className={cn('mt-1 text-xs text-slate-500', className)} {...props}>
      {children}
    </p>
  );
}

export default HelperText;
