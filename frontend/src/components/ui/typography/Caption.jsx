import { cn } from '@/lib/utils/cn';

/**
 * Small secondary text for captions and metadata.
 * @param {{ className?: string, children: React.ReactNode }} props
 */
export function Caption({ className, children, ...props }) {
  return (
    <span className={cn('text-xs text-slate-500 leading-tight', className)} {...props}>
      {children}
    </span>
  );
}

export default Caption;
