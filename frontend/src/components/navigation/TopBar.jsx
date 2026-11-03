import { cn } from '@/lib/utils/cn';

/**
 * Top application navigation bar.
 * @param {{
 *   left?: React.ReactNode,
 *   right?: React.ReactNode,
 *   className?: string
 * }} props
 */
export function TopBar({ left, right, className }) {
  return (
    <header className={cn('h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between z-10', className)}>
      <div className="flex items-center gap-4">{left}</div>
      <div className="flex items-center gap-4">{right}</div>
    </header>
  );
}

export default TopBar;

