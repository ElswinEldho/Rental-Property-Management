import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * Breadcrumb navigation trail.
 * @param {{
 *   items: Array<{label: string, href?: string}>,
 *   className?: string
 * }} props
 */
export function Breadcrumb({ items = [], className }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-2 text-xs text-slate-500', className)}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className="flex items-center space-x-2">
            {idx > 0 && <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />}
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-slate-800 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-medium text-slate-900' : ''}>{item.label}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;

