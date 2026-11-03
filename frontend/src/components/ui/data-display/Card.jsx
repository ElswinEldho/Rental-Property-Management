import { cn } from '@/lib/utils/cn';

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

/**
 * General-purpose card container.
 * @param {{
 *   title?: string,
 *   description?: string,
 *   footer?: React.ReactNode,
 *   padding?: 'none'|'sm'|'md'|'lg',
 *   className?: string,
 *   children?: React.ReactNode
 * }} props
 */
export function Card({ title, description, footer, padding = 'md', className, children }) {
  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white shadow-sm', className)}>
      {(title || description) && (
        <div className={cn('border-b border-slate-100', paddingClasses[padding] ?? paddingClasses.md)}>
          {title && <h3 className="font-semibold text-slate-800">{title}</h3>}
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
      )}
      <div className={cn(paddingClasses[padding] ?? paddingClasses.md)}>{children}</div>
      {footer && (
        <div className={cn('border-t border-slate-100', paddingClasses[padding] ?? paddingClasses.md)}>
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;

