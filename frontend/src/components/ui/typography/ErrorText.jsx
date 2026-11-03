import { cn } from '@/lib/utils/cn';

/**
 * Red error text displayed below form inputs.
 * @param {{ id?: string, className?: string, children: React.ReactNode }} props
 */
export function ErrorText({ id, className, children, ...props }) {
  return (
    <p id={id} role="alert" className={cn('mt-1 text-xs text-red-600', className)} {...props}>
      {children}
    </p>
  );
}

export default ErrorText;

