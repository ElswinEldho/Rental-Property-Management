import { cn } from '@/lib/utils/cn';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Dashboard metric card.
 * @param {{
 *   label: string,
 *   value: string|number,
 *   change?: string,
 *   changeType?: 'positive'|'negative'|'neutral',
 *   icon?: React.ReactNode,
 *   className?: string
 * }} props
 */
export function StatCard({ label, value, change, changeType = 'neutral', icon, className }) {
  const changeConfig = {
    positive: { color: 'text-green-600', Icon: TrendingUp },
    negative: { color: 'text-red-600', Icon: TrendingDown },
    neutral: { color: 'text-slate-500', Icon: Minus },
  };

  const { color, Icon: ChangeIcon } = changeConfig[changeType] ?? changeConfig.neutral;

  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white p-6 shadow-sm', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 truncate">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">{value}</p>
        </div>
        {icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            {icon}
          </div>
        )}
      </div>
      {change && (
        <div className={cn('mt-3 flex items-center gap-1 text-sm font-medium', color)}>
          <ChangeIcon className="h-4 w-4" aria-hidden="true" />
          <span>{change}</span>
        </div>
      )}
    </div>
  );
}

export default StatCard;

