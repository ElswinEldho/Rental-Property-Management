import { cn } from '@/lib/utils/cn';

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
};

/**
 * Loading spinner.
 * @param {{ size?: 'sm'|'md'|'lg', className?: string }} props
 */
export function Spinner({ size = 'md', className }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block rounded-full border-current border-t-transparent animate-spin',
        sizeClasses[size] ?? sizeClasses.md,
        className
      )}
    />
  );
}

export default Spinner;
