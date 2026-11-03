import { cn } from '@/lib/utils/cn';

/**
 * Shimmer loading placeholder.
 * @param {{ width?: string, height?: string, rounded?: boolean, className?: string }} props
 */
export function Skeleton({ width, height, rounded = false, className }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse bg-slate-200',
        rounded ? 'rounded-full' : 'rounded',
        className
      )}
      style={{ width, height }}
    />
  );
}

export default Skeleton;
