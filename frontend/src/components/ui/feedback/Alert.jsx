'use client';

import { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const variants = {
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: CheckCircle,
    iconClass: 'text-green-500',
  },
  warning: {
    container: 'bg-amber-50 border-amber-200 text-amber-800',
    icon: AlertTriangle,
    iconClass: 'text-amber-500',
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: XCircle,
    iconClass: 'text-red-500',
  },
  info: {
    container: 'bg-brand-50 border-brand-100 text-brand-700',
    icon: Info,
    iconClass: 'text-brand-500',
  },
};

/**
 * @param {{
 *   variant?: 'success'|'warning'|'error'|'info',
 *   title?: string,
 *   message?: string,
 *   dismissible?: boolean,
 *   onDismiss?: Function,
 *   className?: string,
 *   children?: React.ReactNode
 * }} props
 */
export function Alert({ variant = 'info', title, message, dismissible = false, onDismiss, className, children }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const config = variants[variant] ?? variants.info;
  const Icon = config.icon;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      className={cn('flex gap-3 rounded-lg border p-4', config.container, className)}
    >
      <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', config.iconClass)} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        {title && <p className="font-medium mb-1">{title}</p>}
        {message && <p className="text-sm opacity-90">{message}</p>}
        {children}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default Alert;
