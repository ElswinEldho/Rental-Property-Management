import { cn } from '@/lib/utils/cn';

const sizeClasses = {
  lg: 'text-lg',
  md: 'text-base',
  sm: 'text-sm',
};

/**
 * @param {{ size?: 'lg'|'md'|'sm', muted?: boolean, className?: string, children: React.ReactNode }} props
 */
export function Paragraph({ size = 'md', muted = false, className, children, ...props }) {
  return (
    <p
      className={cn(
        'leading-relaxed',
        sizeClasses[size] ?? sizeClasses.md,
        muted ? 'text-slate-500' : 'text-slate-700',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export default Paragraph;
