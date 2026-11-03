import { Spinner } from './Spinner';
import { cn } from '@/lib/utils/cn';

/**
 * Centered full-area loading state.
 * @param {{ message?: string, className?: string }} props
 */
export function LoadingState({ message = 'Loading…', className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16 text-slate-500', className)}>
      <Spinner size="lg" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export default LoadingState;

