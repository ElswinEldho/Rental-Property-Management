import { cn } from '@/lib/utils/cn';

/**
 * Page header containing title, subtitle, breadcrumbs, and action buttons.
 * @param {{
 *   title: string,
 *   description?: string,
 *   actions?: React.ReactNode,
 *   breadcrumbs?: React.ReactNode,
 *   className?: string
 * }} props
 */
export function PageHeader({ title, description, actions, breadcrumbs, className }) {
  return (
    <div className={cn('border-b border-slate-200 pb-5 space-y-2', className)}>
      {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

export default PageHeader;

