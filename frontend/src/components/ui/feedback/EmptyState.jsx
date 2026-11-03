import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/buttons/Button';

/**
 * Empty state illustration with optional CTA.
 * @param {{
 *   icon?: React.ReactNode,
 *   title: string,
 *   description?: string,
 *   action?: { label: string, onClick: Function },
 *   className?: string
 * }} props
 */
export function EmptyState({ icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 py-16 text-center', className)}>
      {icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          {icon}
        </div>
      )}
      <div>
        <p className="font-semibold text-slate-700">{title}</p>
        {description && <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>}
      </div>
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;

