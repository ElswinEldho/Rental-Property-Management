import { cn } from '@/lib/utils/cn';

/**
 * Titled section within a form.
 * @param {{
 *   title: string,
 *   description?: string,
 *   className?: string,
 *   children: React.ReactNode
 * }} props
 */
export function FormSection({ title, description, className, children }) {
  return (
    <div className={cn('space-y-4 pt-4 border-t border-slate-200 first:border-0 first:pt-0', className)}>
      <div>
        <h4 className="text-base font-semibold text-slate-900">{title}</h4>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default FormSection;

