import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

/**
 * Sidebar navigation item.
 * @param {{
 *   href: string,
 *   icon?: React.ReactNode,
 *   label: string,
 *   active?: boolean,
 *   badge?: string|number,
 *   className?: string
 * }} props
 */
export function NavItem({ href, icon, label, active = false, badge, className }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        active
          ? 'bg-brand-50 text-brand-700'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
        className
      )}
    >
      {icon && <span className={cn('h-5 w-5 shrink-0', active ? 'text-brand-600' : 'text-slate-400')}>{icon}</span>}
      <span className="flex-1 truncate">{label}</span>
      {badge !== undefined && (
        <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-semibold">
          {badge}
        </span>
      )}
    </Link>
  );
}

export default NavItem;

