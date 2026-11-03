'use client';

import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const toastIcons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const toastColors = {
  success: 'bg-green-50 border-green-200 text-green-900',
  warning: 'bg-amber-50 border-amber-200 text-amber-900',
  error: 'bg-red-50 border-red-200 text-red-900',
  info: 'bg-brand-50 border-brand-200 text-brand-900',
};

/**
 * Standalone Toast item.
 * @param {{
 *   id?: string,
 *   type?: 'success'|'warning'|'error'|'info',
 *   message: string,
 *   onClose?: () => void,
 *   className?: string
 * }} props
 */
export function Toast({ type = 'info', message, onClose, className }) {
  const Icon = toastIcons[type] ?? toastIcons.info;

  return (
    <div
      role="status"
      className={cn(
        'flex items-center gap-3 p-4 rounded-xl border shadow-lg max-w-sm pointer-events-auto transition-all',
        toastColors[type] ?? toastColors.info,
        className
      )}
    >
      <Icon className="h-5 w-5 shrink-0 opacity-80" />
      <p className="text-sm font-medium flex-1">{message}</p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-0.5 rounded"
          aria-label="Dismiss toast"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default Toast;

