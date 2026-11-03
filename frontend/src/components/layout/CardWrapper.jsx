import { cn } from '@/lib/utils/cn';

/**
 * Card-like wrapper with shadow and optional header.
 * @param {{
 *   title?: string,
 *   description?: string,
 *   className?: string,
 *   children: React.ReactNode
 * }} props
 */
export function CardWrapper({ title, description, className, children }) {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 shadow-sm p-6', className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
          {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

export default CardWrapper;

