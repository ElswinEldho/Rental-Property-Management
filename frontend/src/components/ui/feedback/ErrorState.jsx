import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/buttons/Button';
import { cn } from '@/lib/utils/cn';

/**
 * Error state with optional retry.
 * @param {{ title?: string, message?: string, onRetry?: Function, className?: string }} props
 */
export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  className,
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 py-16 text-center', className)}>
      <AlertTriangle className="h-12 w-12 text-red-400" aria-hidden="true" />
      <div>
        <p className="font-semibold text-slate-800">{title}</p>
        <p className="mt-1 text-sm text-slate-500 max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export default ErrorState;

