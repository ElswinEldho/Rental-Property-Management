import { cn } from '@/lib/utils/cn';

/**
 * Section wrapper with titled layout.
 * @param {{
 *   title?: string,
 *   description?: string,
 *   actions?: React.ReactNode,
 *   className?: string,
 *   children: React.ReactNode
 * }} props
 */
export function SectionWrapper({ title, description, actions, className, children }) {
  return (
    <section className={cn('space-y-4', className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-800">{title}</h3>}
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
}

export default SectionWrapper;

