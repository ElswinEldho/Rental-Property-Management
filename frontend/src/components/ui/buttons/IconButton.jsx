import { cn } from '@/lib/utils/cn';

const variantClasses = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400',
  outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400',
};

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

/**
 * Icon-only button. aria-label is required for accessibility.
 * @param {{
 *   'aria-label': string,
 *   variant?: 'primary'|'secondary'|'danger'|'ghost'|'outline',
 *   size?: 'sm'|'md'|'lg',
 *   disabled?: boolean,
 *   onClick?: Function,
 *   className?: string,
 *   children: React.ReactNode
 * }} props
 */
export function IconButton({
  variant = 'ghost',
  size = 'md',
  disabled = false,
  onClick,
  className,
  children,
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-lg',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant] ?? variantClasses.ghost,
        sizeClasses[size] ?? sizeClasses.md,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default IconButton;
