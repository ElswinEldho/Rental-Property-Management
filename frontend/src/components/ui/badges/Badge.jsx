import { cn } from '@/lib/utils/cn';

const variantClasses = {
  success: 'bg-green-100 text-green-700 border-green-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
  danger: 'bg-red-100 text-red-700 border-red-200',
  info: 'bg-brand-100 text-brand-700 border-brand-100',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
};

const sizeClasses = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
};

/**
 * @param {{
 *   variant?: 'success'|'warning'|'danger'|'info'|'neutral',
 *   size?: 'sm'|'md'|'lg',
 *   className?: string,
 *   children: React.ReactNode
 * }} props
 */
export function Badge({ variant = 'neutral', size = 'md', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        variantClasses[variant] ?? variantClasses.neutral,
        sizeClasses[size] ?? sizeClasses.md,
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;

