import { cn } from '@/lib/utils/cn';

/**
 * Responsive Sidebar wrapper.
 * @param {{
 *   brand?: React.ReactNode,
 *   footer?: React.ReactNode,
 *   className?: string,
 *   children: React.ReactNode
 * }} props
 */
export function Sidebar({ brand, footer, className, children }) {
  return (
    <aside className={cn('flex flex-col w-64 border-r border-slate-200 bg-white h-screen shrink-0', className)}>
      {brand && <div className="h-16 flex items-center px-6 border-b border-slate-100">{brand}</div>}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">{children}</div>
      {footer && <div className="p-4 border-t border-slate-100">{footer}</div>}
    </aside>
  );
}

export default Sidebar;

