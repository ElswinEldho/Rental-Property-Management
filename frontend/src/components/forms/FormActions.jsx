import { cn } from '@/lib/utils/cn';

/**
 * Submit / Reset button row for forms.
 * @param {{
 *   align?: 'left'|'center'|'right'|'between',
 *   className?: string,
 *   children: React.ReactNode
 * }} props
 */
export function FormActions({ align = 'right', className, children }) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div className={cn('flex items-center gap-3 pt-6 border-t border-slate-100', alignClasses[align] ?? alignClasses.right, className)}>
      {children}
    </div>
  );
}

export default FormActions;

