'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * Slide-over drawer component.
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   title?: string,
 *   description?: string,
 *   side?: 'left'|'right',
 *   className?: string,
 *   children: React.ReactNode
 * }} props
 */
export function DrawerWrapper({
  isOpen,
  onClose,
  title,
  description,
  side = 'right',
  className,
  children,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={cn('fixed inset-y-0 flex max-w-full', side === 'right' ? 'right-0 pl-10' : 'left-0 pr-10')}>
        <div className={cn('w-screen max-w-md bg-white shadow-2xl flex flex-col', className)}>
          <div className="p-6 border-b border-slate-100 flex items-start justify-between">
            <div>
              {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
              {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default DrawerWrapper;

