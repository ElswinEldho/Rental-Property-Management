'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Simple hover tooltip wrapper.
 * @param {{
 *   content: string,
 *   position?: 'top'|'bottom'|'left'|'right',
 *   className?: string,
 *   children: React.ReactNode
 * }} props
 */
export function Tooltip({ content, position = 'top', className, children }) {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-xs text-white shadow-lg',
            positionClasses[position] ?? positionClasses.top
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export default Tooltip;

