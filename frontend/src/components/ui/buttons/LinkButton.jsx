import { cn } from '@/lib/utils/cn';

const variantClasses = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
};

const sizeClasses = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

/**
 * Anchor tag styled as a button.
 * @param {{
 *   href: string,
 *   variant?: 'primary'|'secondary'|'danger'|'ghost'|'outline',
 *   size?: 'sm'|'md'|'lg',
 *   leftIcon?: React.ReactNode,
 *   rightIcon?: React.ReactNode,
 *   className?: string,
 *   children: React.ReactNode
 * }} props
 */
export function LinkButton({
  href,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-colors duration-150 no-underline',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        variantClasses[variant] ?? variantClasses.primary,
        sizeClasses[size] ?? sizeClasses.md,
        className
      )}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </a>
  );
}

export default LinkButton;
