import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * Top-level form error summary banner.
 * @param {{
 *   errors: string[]|Record<string, string>,
 *   className?: string
 * }} props
 */
export function FormErrorSummary({ errors, className }) {
  if (!errors) return null;

  const errorList = Array.isArray(errors)
    ? errors
    : Object.values(errors).filter(Boolean);

  if (errorList.length === 0) return null;

  return (
    <div
      role="alert"
      className={cn('rounded-lg bg-red-50 border border-red-200 p-4 text-red-800', className)}
    >
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
        <h5 className="font-medium text-sm">Please correct the following errors:</h5>
      </div>
      <ul className="list-disc list-inside text-xs space-y-1 pl-1">
        {errorList.map((err, idx) => (
          <li key={idx}>{err}</li>
        ))}
      </ul>
    </div>
  );
}

export default FormErrorSummary;

